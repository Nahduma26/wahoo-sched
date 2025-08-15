from flask import Blueprint, jsonify, request
import supabase
from supabase import create_client, Client
import os
import json

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
    current_page = 0
    page_size = 1000
    all_courses = []

    while True:
        start_index = current_page * page_size
        end_index = (current_page + 1) * page_size - 1
        data = query.range(start_index, end_index).execute()
        if not data.data:
            break
        all_courses.extend(data.data)
        if len(data.data) < page_size:
            break
        current_page += 1

    if not all_courses:
        return jsonify([]), 200
    return jsonify(all_courses), 200