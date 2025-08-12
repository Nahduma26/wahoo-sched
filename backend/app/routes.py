from flask import Blueprint, jsonify, request
import supabase
from supabase import create_client, Client
import os

courseList = [
    {
        "id": 1, "name": "Program and Data Representation", "subject": "CS", "code": "2150",
        "description": "A second course in computing for students in science and engineering.",
        "professor": "Paul McBurney", "credits": 4, "days": ["T", "Th"], "startTime": "14:00", "endTime": "15:15",
        "gen_eds": ["Second Writing Requirement"], "status": "Open"
    },
    {
        "id": 2, "name": "Intro to Statistical Analysis", "subject": "STAT", "code": "2120",
        "description": "Introduction to the basics of statistical reasoning and data analysis.",
        "professor": "Bethany Loberg", "credits": 4, "days": ["M", "W", "F"], "startTime": "10:00", "endTime": "10:50",
        "gen_eds": ["Quantitative Reasoning"], "status": "Open"
    },
    {
        "id": 3, "name": "Commercial Law I", "subject": "COMM", "code": "2010",
        "description": "Basic legal principles applicable to ordinary commercial transactions.",
        "professor": "Sherri Moore", "credits": 3, "days": ["M", "W"], "startTime": "15:30", "endTime": "16:45",
        "gen_eds": [], "status": "Closed"
    },
    {
        "id": 4, "name": "Intro to Archaeology", "subject": "ANTH", "code": "2800",
        "description": "Topics include the history of archaeology and archaeological methods.",
        "professor": "Fraser Neiman", "credits": 3, "days": ["T", "Th"], "startTime": "11:00", "endTime": "12:15",
        "gen_eds": ["Social Sciences", "Historical Studies"], "status": "Open"
    },
    {
        "id": 5, "name": "Introduction to Programming", "subject": "CS", "code": "1110",
        "description": "A first course in computer science for non-majors.",
        "professor": "David Evans", "credits": 3, "days": ["M", "W", "F"], "startTime": "13:00", "endTime": "13:50",
        "gen_eds": ["Quantitative Reasoning"], "status": "Waitlisted"
    },
    {
        "id": 6, "name": "Microeconomics", "subject": "ECON", "code": "2010",
        "description": "The theory of prices and markets.", "professor": "Kenneth Elzinga", "credits": 3,
        "days": ["T", "Th"], "startTime": "09:30", "endTime": "10:45", "gen_eds": ["Social Sciences"], "status": "Open"
    },
    {
        "id": 7, "name": "Shakespeare", "subject": "ENGL", "code": "3270",
        "description": "A survey of Shakespeare's major plays.", "professor": "Clare Kinney", "credits": 3,
        "days": ["M", "W"], "startTime": "11:00", "endTime": "12:15", "gen_eds": ["Humanities"], "status": "Open"
    },
    {
        "id": 8, "name": "Abnormal Psychology", "subject": "PSYC", "code": "3500",
        "description": "A comprehensive survey of the scientific study of mental disorders.",
        "professor": "Eric Turkheimer", "credits": 3, "days": ["T", "Th"], "startTime": "12:30", "endTime": "13:45",
        "gen_eds": ["Social Sciences"], "status": "Closed"
    },
    {
        "id": 9, "name": "Software Development Methods", "subject": "CS", "code": "3140",
        "description": "A course in software engineering and best practices.", "professor": "Paul McBurney",
        "credits": 3, "days": ["T", "Th"], "startTime": "15:30", "endTime": "16:45", "gen_eds": [], "status": "Open"
    },
    {
        "id": 10, "name": "Calculus I", "subject": "MATH", "code": "1310",
        "description": "An introduction to differential and integral calculus.", "professor": "John Imbrie",
        "credits": 4, "days": ["M", "W", "F"], "startTime": "09:00", "endTime": "09:50", "gen_eds": ["Quantitative Reasoning"],
        "status": "Open"
    },
    {
        "id": 11, "name": "Macroeconomics", "subject": "ECON", "code": "2020",
        "description": "The theory of national income and economic growth.", "professor": "Maxim Engers",
        "credits": 3, "days": ["M", "W", "F"], "startTime": "14:00", "endTime": "14:50", "gen_eds": ["Social Sciences"],
        "status": "Waitlisted"
    },
    {
        "id": 12, "name": "American Literature", "subject": "ENGL", "code": "2559",
        "description": "A survey of American literature from the colonial period to the present.",
        "professor": "Stephen Railton", "credits": 3, "days": ["T", "Th"], "startTime": "14:00", "endTime": "15:15",
        "gen_eds": ["Humanities", "Second Writing Requirement"], "status": "Open"
    },
    {
        "id": 13, "name": "General Physics I", "subject": "PHYS", "code": "1425",
        "description": "Introductory physics covering mechanics, heat, and sound.", "professor": "Robert Jones",
        "credits": 4, "days": ["M", "W", "F"], "startTime": "11:00", "endTime": "11:50", "gen_eds": ["Natural Sciences"],
        "status": "Open"
    },
    {
        "id": 14, "name": "Database Systems", "subject": "CS", "code": "4750",
        "description": "A course on the design and implementation of database management systems.",
        "professor": "Kevin Skadron", "credits": 3, "days": ["M", "W"], "startTime": "12:30", "endTime": "13:45",
        "gen_eds": [], "status": "Closed"
    },
    {
        "id": 15, "name": "The Modern Age", "subject": "HIEU", "code": "2002",
        "description": "A survey of European history from the late 17th century to the present.",
        "professor": "Allan Megill", "credits": 3, "days": ["T", "Th"], "startTime": "11:00", "endTime": "12:15",
        "gen_eds": ["Historical Studies", "Humanities"], "status": "Open"
    },
    {
        "id": 16, "name": "General Chemistry I", "subject": "CHEM", "code": "1410",
        "description": "Introduction to the principles of chemistry.", "professor": "James Demas", "credits": 3,
        "days": ["M", "W", "F"], "startTime": "09:00", "endTime": "09:50", "gen_eds": ["Natural Sciences"], "status": "Waitlisted"
    },
    {
        "id": 17, "name": "Social Psychology", "subject": "PSYC", "code": "2600",
        "description": "Introduction to the study of the individual in social contexts.",
        "professor": "Timothy Wilson", "credits": 3, "days": ["T", "Th"], "startTime": "14:00", "endTime": "15:15",
        "gen_eds": ["Social Sciences"], "status": "Open"
    },
    {
        "id": 18, "name": "Biomechanics", "subject": "BME", "code": "3030",
        "description": "Study of mechanics of solids and fluids as applied to biological systems.",
        "professor": "Silvia Blemker", "credits": 3, "days": ["T", "Th"], "startTime": "09:30", "endTime": "10:45",
        "gen_eds": [], "status": "Open"
    },
    {
        "id": 19, "name": "Computer Graphics", "subject": "CS", "code": "4450",
        "description": "Introduction to the principles of computer graphics.", "professor": "David Luebke", "credits": 3,
        "days": ["M", "W", "F"], "startTime": "15:00", "endTime": "15:50", "gen_eds": [], "status": "Open"
    },
    {
        "id": 20, "name": "Foundation Studio I", "subject": "SARC", "code": "1010",
        "description": "Introduction to the concepts and techniques of architectural design.",
        "professor": "Schaeffer Somers", "credits": 4, "days": ["M", "W"], "startTime": "13:00", "endTime": "16:45",
        "gen_eds": ["Humanities"], "status": "Open"
    },
    {
        "id": 21, "name": "Calculus II", "subject": "MATH", "code": "1320",
        "description": "Continuation of Calculus I.", "professor": "Zoran Grujic", "credits": 4, "days": ["T", "Th"],
        "startTime": "14:00", "endTime": "15:15", "gen_eds": ["Quantitative Reasoning"], "status": "Open"
    },
    {
        "id": 22, "name": "Introduction to Media Studies", "subject": "MDST", "code": "2000",
        "description": "Surveys the forms, institutions, and effects of media.", "professor": "Andrea Press", "credits": 3,
        "days": ["M", "W", "F"], "startTime": "12:00", "endTime": "12:50", "gen_eds": ["Humanities"], "status": "Closed"
    },
    {
        "id": 23, "name": "Intro to American Politics", "subject": "PLAP", "code": "1010",
        "description": "An introduction to the American political system.", "professor": "Larry Sabato", "credits": 3,
        "days": ["T", "Th"], "startTime": "11:00", "endTime": "12:15", "gen_eds": ["Social Sciences"], "status": "Open"
    },
    {
        "id": 24, "name": "Organic Chemistry I", "subject": "CHEM", "code": "2410",
        "description": "First semester of the year-long organic chemistry sequence.", "professor": "Charles Grisham", "credits": 3,
        "days": ["M", "W", "F"], "startTime": "11:00", "endTime": "11:50", "gen_eds": ["Natural Sciences"], "status": "Waitlisted"
    },
    {
        "id": 25, "name": "Theory of Financial Markets", "subject": "COMM", "code": "3110",
        "description": "An introduction to the theory and practice of investment management.",
        "professor": "Michael Gallmeyer", "credits": 3, "days": ["T", "Th"], "startTime": "15:30", "endTime": "16:45",
        "gen_eds": [], "status": "Open"
    },
    {
        "id": 26, "name": "Algorithms", "subject": "CS", "code": "4102",
        "description": "A course on the design and analysis of algorithms.", "professor": "Gabriel Robins", "credits": 3,
        "days": ["M", "W"], "startTime": "15:30", "endTime": "16:45", "gen_eds": [], "status": "Open"
    },
    {
        "id": 27, "name": "Buddhism", "subject": "RELB", "code": "2100",
        "description": "A survey of the Buddhist tradition in Asia and the West.", "professor": "Kurtis Schaeffer", "credits": 3,
        "days": ["T", "Th"], "startTime": "12:30", "endTime": "13:45", "gen_eds": ["Humanities", "Historical Studies"],
        "status": "Open"
    },
    {
        "id": 28, "name": "History of the United States Since 1865", "subject": "HIUS", "code": "2002",
        "description": "A survey of American history from the end of the Civil War to the present.",
        "professor": "Gary Gallagher", "credits": 3, "days": ["M", "W", "F"], "startTime": "10:00", "endTime": "10:50",
        "gen_eds": ["Historical Studies"], "status": "Open"
    },
    {
        "id": 29, "name": "Introduction to Cognitive Science", "subject": "COGS", "code": "1010",
        "description": "An interdisciplinary introduction to the study of the mind.", "professor": "Per Sederberg", "credits": 3,
        "days": ["M", "W"], "startTime": "14:00", "endTime": "15:15", "gen_eds": ["Social Sciences"], "status": "Open"
    },
    {
        "id": 30, "name": "Discrete Mathematics", "subject": "CS", "code": "2102",
        "description": "A course on the foundations of discrete mathematics for computer science.",
        "professor": "Thomas Horton", "credits": 3, "days": ["T", "Th"], "startTime": "09:30", "endTime": "10:45",
        "gen_eds": ["Quantitative Reasoning"], "status": "Closed"
    },
    {
        "id": 31, "name": "Principles of Financial Accounting", "subject": "COMM", "code": "2020",
        "description": "A course on the principles and practices of financial accounting.", "professor": "Luann Lynch",
        "credits": 3, "days": ["T", "Th"], "startTime": "14:00", "endTime": "15:15", "gen_eds": [], "status": "Open"
    },
    {
        "id": 32, "name": "Introduction to Linguistics", "subject": "LING", "code": "3250",
        "description": "An introduction to the study of language.", "professor": "Mark Elson", "credits": 3,
        "days": ["M", "W", "F"], "startTime": "13:00", "endTime": "13:50", "gen_eds": ["Social Sciences"], "status": "Open"
    },
    {
        "id": 33, "name": "Atmosphere and Weather", "subject": "EVSC", "code": "1010",
        "description": "An introduction to the study of the atmosphere and weather.", "professor": "Robert Davis",
        "credits": 3, "days": ["T", "Th"], "startTime": "11:00", "endTime": "12:15", "gen_eds": ["Natural Sciences"],
        "status": "Open"
    },
    {
        "id": 34, "name": "Child Development", "subject": "PSYC", "code": "2700",
        "description": "An introduction to the study of child development.", "professor": "Vikram Jaswal",
        "credits": 3, "days": ["M", "W"], "startTime": "11:00", "endTime": "12:15", "gen_eds": ["Social Sciences"],
        "status": "Open"
    },
    {
        "id": 35, "name": "Linear Algebra", "subject": "MATH", "code": "3351",
        "description": "A course on the theory and applications of linear algebra.", "professor": "Weiqiang Wang",
        "credits": 3, "days": ["T", "Th"], "startTime": "12:30", "endTime": "13:45", "gen_eds": ["Quantitative Reasoning"],
        "status": "Waitlisted"
    },
    {
        "id": 36, "name": "Poetry Writing", "subject": "ENWR", "code": "2300",
        "description": "An introduction to the writing of poetry.", "professor": "Rita Dove", "credits": 3,
        "days": ["W"], "startTime": "15:00", "endTime": "17:30", "gen_eds": ["Humanities"], "status": "Closed"
    },
    {
        "id": 37, "name": "Intro to International Relations", "subject": "PLIR", "code": "1010",
        "description": "An introduction to the study of international relations.", "professor": "Allen Lynch",
        "credits": 3, "days": ["M", "W", "F"], "startTime": "12:00", "endTime": "12:50", "gen_eds": ["Social Sciences"],
        "status": "Open"
    },
    {
        "id": 38, "name": "Human Anatomy and Physiology I", "subject": "BIOL", "code": "3230",
        "description": "First semester of a two-semester course on human anatomy and physiology.",
        "professor": "Mary Smith", "credits": 4, "days": ["T", "Th"], "startTime": "14:00", "endTime": "15:15",
        "gen_eds": ["Natural Sciences"], "status": "Open"
    },
    {
        "id": 39, "name": "Operating Systems", "subject": "CS", "code": "4414",
        "description": "A course on the principles of operating systems.", "professor": "Yuan Tian", "credits": 3,
        "days": ["T", "Th"], "startTime": "15:30", "endTime": "16:45", "gen_eds": [], "status": "Open"
    },
    {
        "id": 40, "name": "Intermediate Spanish", "subject": "SPAN", "code": "2010",
        "description": "Continuation of the study of Spanish.", "professor": "Alicia Lopez-Operé",
        "credits": 3, "days": ["M", "W", "F"], "startTime": "10:00", "endTime": "10:50", "gen_eds": ["Humanities"],
        "status": "Open"
    },
    {
        "id": 41, "name": "History of Art I", "subject": "ARTH", "code": "1051",
        "description": "A survey of the history of art from the ancient world to the Renaissance.",
        "professor": "Paul Barolsky", "credits": 4, "days": ["T", "Th"], "startTime": "09:30", "endTime": "10:45",
        "gen_eds": ["Humanities", "Historical Studies"], "status": "Open"
    },
    {
        "id": 42, "name": "Intro to Biomedical Engineering", "subject": "BME", "code": "1001",
        "description": "An introduction to the field of biomedical engineering.", "professor": "Jonathan Kipnis",
        "credits": 3, "days": ["M", "W"], "startTime": "14:00", "endTime": "15:15", "gen_eds": [], "status": "Waitlisted"
    },
    {
        "id": 43, "name": "Intro to Race and Ethnicity", "subject": "AAS", "code": "1010",
        "description": "An introduction to the study of race and ethnicity.", "professor": "Deborah McDowell",
        "credits": 3, "days": ["T", "Th"], "startTime": "12:30", "endTime": "13:45", "gen_eds": ["Social Sciences"],
        "status": "Open"
    },
    {
        "id": 44, "name": "Intro to Business", "subject": "COMM", "code": "1800",
        "description": "An introduction to the world of business.", "professor": "Mark White", "credits": 3,
        "days": ["M", "W", "F"], "startTime": "13:00", "endTime": "13:50", "gen_eds": [], "status": "Open"
    },
    {
        "id": 45, "name": "Exercise Physiology", "subject": "KINE", "code": "3350",
        "description": "A course on the physiological responses to exercise.", "professor": "Arthur Weltman",
        "credits": 3, "days": ["T", "Th"], "startTime": "11:00", "endTime": "12:15", "gen_eds": ["Natural Sciences"],
        "status": "Open"
    },
    {
        "id": 46, "name": "Introduction to Philosophy", "subject": "PHIL", "code": "1000",
        "description": "An introduction to the main problems of philosophy.", "professor": "Jorge Secada",
        "credits": 3, "days": ["M", "W", "F"], "startTime": "14:00", "endTime": "14:50", "gen_eds": ["Humanities"],
        "status": "Closed"
    },
    {
        "id": 47, "name": "Modern Chinese History", "subject": "HIEA", "code": "2031",
        "description": "A survey of Chinese history from the 17th century to the present.",
        "professor": "John Israel", "credits": 3, "days": ["T", "Th"], "startTime": "14:00", "endTime": "15:15",
        "gen_eds": ["Historical Studies"], "status": "Open"
    },
    {
        "id": 48, "name": "Cybersecurity", "subject": "CS", "code": "4630",
        "description": "An introduction to the principles and practices of cybersecurity.",
        "professor": "Yonghwi Kwon", "credits": 3, "days": ["M", "W"], "startTime": "11:00", "endTime": "12:15",
        "gen_eds": [], "status": "Open"
    },
    {
        "id": 49, "name": "Intro to Drama", "subject": "DRAM", "code": "2020",
        "description": "An introduction to the study of drama.", "professor": "John Frick", "credits": 3,
        "days": ["T", "Th"], "startTime": "15:30", "endTime": "16:45", "gen_eds": ["Humanities"], "status": "Open"
    },
    {
        "id": 50, "name": "General Biology I", "subject": "BIOL", "code": "2100",
        "description": "An introduction to the principles of biology.", "professor": "Masashi Kawasaki",
        "credits": 3, "days": ["M", "W", "F"], "startTime": "09:00", "endTime": "09:50", "gen_eds": ["Natural Sciences"],
        "status": "Open"
    },
    # New Conflicting Courses
    {
        "id": 51, "name": "Money and Banking", "subject": "ECON", "code": "3030",
        "description": "A course on the principles of money and banking.", "professor": "Steven Stern", "credits": 3,
        "days": ["T", "Th"], "startTime": "11:00", "endTime": "12:15", "gen_eds": ["Social Sciences"], "status": "Open"
    },
    {
        "id": 52, "name": "Software Development I", "subject": "CS", "code": "2110",
        "description": "An introduction to software development with a focus on object-oriented programming.",
        "professor": "Mark Sherriff", "credits": 3, "days": ["M", "W", "F"], "startTime": "10:00", "endTime": "10:50",
        "gen_eds": [], "status": "Open"
    },
    {
        "id": 53, "name": "History of Architecture", "subject": "SARC", "code": "2500",
        "description": "A survey of architectural history from ancient times to the present.",
        "professor": "Lisa Reilly", "credits": 3, "days": ["M", "W"], "startTime": "15:30", "endTime": "16:45",
        "gen_eds": ["Historical Studies"], "status": "Open"
    },
    {
        "id": 54, "name": "Philosophy of Mind", "subject": "PHIL", "code": "2450",
        "description": "An examination of the nature of the mind and consciousness.", "professor": "Walter Sinnott-Armstrong",
        "credits": 3, "days": ["T", "Th"], "startTime": "12:30", "endTime": "13:45", "gen_eds": ["Humanities"], "status": "Waitlisted"
    },
    {
        "id": 55, "name": "Spiritual But Not Religious", "subject": "RELG", "code": "2660",
        "description": "An exploration of spirituality outside of organized religion.", "professor": "Heather Warren",
        "credits": 3, "days": ["T", "Th"], "startTime": "12:30", "endTime": "13:45", "gen_eds": ["Humanities"], "status": "Open"
    },
    {
        "id": 56, "name": "Fiction Writing", "subject": "ENWR", "code": "2520",
        "description": "A workshop in the writing of fiction.", "professor": "Jeb Livingood", "credits": 3,
        "days": ["M"], "startTime": "11:00", "endTime": "13:30", "gen_eds": ["Humanities"], "status": "Open"
    },
    {
        "id": 57, "name": "Introduction to Geopolitics", "subject": "PLIR", "code": "3500",
        "description": "Study of the influence of geographic factors on international politics.", "professor": "Gerard Toal",
        "credits": 3, "days": ["M", "W"], "startTime": "14:00", "endTime": "15:15", "gen_eds": ["Social Sciences"], "status": "Open"
    },
    {
        "id": 58, "name": "Introduction to Immunology", "subject": "BIOL", "code": "4050",
        "description": "A course on the principles of immunology.", "professor": "Thomas Platts-Mills", "credits": 3,
        "days": ["M", "W", "F"], "startTime": "09:00", "endTime": "09:50", "gen_eds": ["Natural Sciences"], "status": "Open"
    },
    {
        "id": 59, "name": "Digital Systems Design", "subject": "ECE", "code": "2330",
        "description": "An introduction to the design of digital systems.", "professor": "Mircea Stan", "credits": 4,
        "days": ["T", "Th"], "startTime": "14:00", "endTime": "15:15", "gen_eds": [], "status": "Open"
    },
    {
        "id": 60, "name": "Modern Art", "subject": "ARTH", "code": "2471",
        "description": "A survey of modern art from the late 19th century to the present.",
        "professor": "Matthew Affron", "credits": 3, "days": ["M", "W", "F"], "startTime": "13:00", "endTime": "13:50",
        "gen_eds": ["Humanities"], "status": "Waitlisted"
    },
    {
        "id": 61, "name": "Calculus III", "subject": "MATH", "code": "2310",
        "description": "A course on multivariable calculus.", "professor": "Craig Huneke", "credits": 4,
        "days": ["T", "Th"], "startTime": "09:30", "endTime": "10:45", "gen_eds": ["Quantitative Reasoning"], "status": "Open"
    },
    {
        "id": 62, "name": "Introduction to Film", "subject": "MDST", "code": "2200",
        "description": "An introduction to the study of film.", "professor": "William Little", "credits": 3,
        "days": ["T", "Th"], "startTime": "15:30", "endTime": "16:45", "gen_eds": ["Humanities"], "status": "Open"
    },
    {
        "id": 63, "name": "Public Speaking", "subject": "DRAM", "code": "2030",
        "description": "A course on the principles and practice of public speaking.", "professor": "Kate Burke",
        "credits": 3, "days": ["M", "W", "F"], "startTime": "10:00", "endTime": "10:50", "gen_eds": [], "status": "Closed"
    },
    {
        "id": 64, "name": "Data Structures and Algorithms 2", "subject": "CS", "code": "3100",
        "description": "A second course in data structures and algorithms.", "professor": "Nada Basit",
        "credits": 3, "days": ["T", "Th"], "startTime": "14:00", "endTime": "15:15", "gen_eds": [], "status": "Open"
    },
    {
        "id": 65, "name": "Climate Change", "subject": "EVSC", "code": "2500",
        "description": "An introduction to the science of climate change.", "professor": "Scott Doney",
        "credits": 3, "days": ["M", "W"], "startTime": "11:00", "endTime": "12:15", "gen_eds": ["Natural Sciences"],
        "status": "Open"
    }
]
course_page = Blueprint('course_page', __name__)

@course_page.route('/courses', methods=['GET'])
def get_courses():
    """
    Get the list of courses.
    """
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_ANON_KEY")
    supabase: Client = create_client(url, key)
    data = supabase.table('courses').select('*').execute()
    if not data:
        return jsonify({"error": "No courses found"}), 404
    return jsonify(data.data), 200