from flask import Blueprint, jsonify, request

courseList = [
    {
        "id": 1,
        "name": "Program and Data Representation",
        "subject": "CS",
        "code": "2150",
        "description": "A second course in computing for students in science and engineering.",
        "professor": "Paul McBurney",
        "credits": 4,
        "days": ["T", "Th"],
        "startTime": "14:00",
        "endTime": "15:15",
        "gen_eds": ["Second Writing Requirement"],
        "status": "Open"
    },
    {
        "id": 2,
        "name": "Intro to Statistical Analysis",
        "subject": "STAT",
        "code": "2120",
        "description": "Introduction to the basics of statistical reasoning and data analysis.",
        "professor": "Bethany Loberg",
        "credits": 4,
        "days": ["M", "W", "F"],
        "startTime": "10:00",
        "endTime": "10:50",
        "gen_eds": ["Quantitative Reasoning"],
        "status": "Open"
    },
    {
        "id": 3,
        "name": "Commercial Law I",
        "subject": "COMM",
        "code": "2010",
        "description": "Basic legal principles applicable to ordinary commercial transactions.",
        "professor": "Sherri Moore",
        "credits": 3,
        "days": ["M", "W"],
        "startTime": "15:30",
        "endTime": "16:45",
        "gen_eds": [],
        "status": "Closed"
    },
    {
        "id": 4,
        "name": "Intro to Archaeology",
        "subject": "ANTH",
        "code": "2800",
        "description": "Topics include the history of archaeology and archaeological methods.",
        "professor": "Fraser Neiman",
        "credits": 3,
        "days": ["T", "Th"],
        "startTime": "11:00",
        "endTime": "12:15",
        "gen_eds": ["Social Sciences", "Historical Studies"],
        "status": "Open"
    }
]

course_page = Blueprint('course_page', __name__)

@course_page.route('/courses', methods=['GET'])
def get_courses():
    """
    Get the list of courses.
    """
    return jsonify(courseList)