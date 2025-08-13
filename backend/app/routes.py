from flask import Blueprint, jsonify, request
import supabase
from supabase import create_client, Client
import os

course_page = Blueprint('course_page', __name__)

@course_page.route('/courses', methods=['GET'])
def get_courses():
    """
    Get the list of courses.
    """
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_ANON_KEY")
    supabase: Client = create_client(url, key)
    data = supabase.table('Course').select('*').execute()
    if not data:
        return jsonify({"error": "No courses found"}), 404
    return jsonify(data.data), 200