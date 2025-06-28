from flask import Blueprint, jsonify, request

courseList = [
    {"id": 1, "name": "Course 1", "code": "C01", "description": "Description of Course 1"},
    {"id": 2, "name": "Course 2", "code": "C02", "description": "Description of Course 2"},
    {"id": 3, "name": "Course 3", "code": "C03", "description": "Description of Course 3"},
    {"id": 4, "name": "Course 4", "code": "C04", "description": "Description of Course 4"},
]

course_page = Blueprint('course_page', __name__)

@course_page.route('/courses', methods=['GET'])
def get_courses():
    """
    Get the list of courses.
    """
    return jsonify(courseList)