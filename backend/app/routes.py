from flask import Blueprint, jsonify, request
import supabase
from supabase import create_client, Client
import os
import json
from .course_utils import group_courses_by_section
from flask_openai import OpenAI
from .openai_utils import get_openai_client

course_page = Blueprint('course_page', __name__)

@course_page.route('/courses', methods=['GET'])
def get_courses():
    """
    Get the list of courses.
    """
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_ANON_KEY")
    professor = request.args.get('professor')
    subject = request.args.get('subject')
    level = request.args.get('level')
    status = request.args.get('status')
    page = request.args.get('page', default=0, type=int)
    page_size = request.args.get('page_size', default=25, type=int)

    if page < 0:
        page = 0

    if page_size < 1 or page_size > 100:
        page_size = 25

    supabase: Client = create_client(url, key)
    query = supabase.table('Course').select('*')
    if professor:
        query = supabase.rpc('search_courses_by_prof', {'prof_name': professor})
    if subject:
        query = query.ilike('subject', f'%{subject}%')
    if level:
        query = query.ilike('catalog_number', f'{level}%')
    if status:
        query = query.eq('status', status)
    
    all_courses = []

    db_page = 0
    db_page_size = 1000

    while True:
        response = query.range(db_page * db_page_size, (db_page + 1) * db_page_size - 1).execute()

        if not response.data:
            break
        
        all_courses.extend(response.data)

        if len(response.data) < db_page_size:
            break
        
        db_page += 1

    if not response.data:
        return jsonify({"data": [], "totalPages": 0})

    grouped_courses = group_courses_by_section(all_courses)
    total_items = len(grouped_courses)

    start_index = page * page_size
    end_index = start_index + page_size
    
    paginated_courses = grouped_courses[start_index:end_index]
    
    total_pages = 0
    if total_items > 0:
        total_pages = (total_items + page_size - 1) // page_size


    return jsonify({
        "courses": paginated_courses,
        "totalPages": total_pages
    })


@course_page.route('/ai-search', methods=['GET', 'POST'])
def ai_search():
    """
    AI search for courses based on a query.
    """
    query = request.json.get('query', '')
    openai = get_openai_client()
    completion = openai.client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "Based on the provided query, return a list of courses in JSON format with the following attributes: professor, status (either 'O', 'W', or 'C'), subject (based on the University of Virginia's course mnemonic), and level (e.g., '1', '2', etc.)."
            },
            {
                "role": "user",
                "content": query
            }
        ]
     )

    if not completion.choices or not completion.choices[0].message:
        return jsonify({"error": "No response from AI"}), 500
    response = completion.choices[0].message.content.strip()
    try:
        courses = json.loads(response)
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON response from AI"}), 400
    return jsonify({"courses": courses})
