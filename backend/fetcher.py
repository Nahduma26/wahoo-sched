import supabase
from supabase import create_client, Client
from dotenv import load_dotenv
import os
import requests
import time

load_dotenv()
def populate_supabase():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_ANON_KEY")
    supabase: Client = create_client(url, key)

    # Fetch courses from the API
    subjectsResponse = requests.get('https://sisuva.admin.virginia.edu/psc/ihprd/UVSS/SA/s/WEBLIB_HCX_CM.H_CLASS_SEARCH.FieldFormula.IScript_ClassSearchOptions?institution=UVA01&term=1262')
    subjects = subjectsResponse.json().get('subjects', [])
    departments = [item['subject'] for item in subjects if 'subject' in item]
    all_courses = []

    for department in departments:
        page = 1
        while True:
            response = requests.get(
                f'https://sisuva.admin.virginia.edu/psc/ihprd/UVSS/SA/s/WEBLIB_HCX_CM.H_CLASS_SEARCH.FieldFormula.IScript_ClassSearch?institution=UVA01&term=1262&subject={department}&page={page}'
            )
            if response.status_code != 200:
                print(f"Error fetching data for {department} on page {page}: {response.status_code}")
                break
            data = response.json().get('classes', [])
            if not data:
                break
            all_courses.extend(data)
            page += 1
            time.sleep(0.2)
    course_list = []
    for course in all_courses:
        course_mapping = {
            "id": course.get("class_nbr"),
            'course_id': course.get('crse_id'),
            'term': course.get('strm'),
            'subject': course.get('subject'),
            'catalog_number': course.get('catalog_nbr'),
            'section': course.get('class_section'),
            'title': course.get('descr'),
            'credits': course.get('units'),
            'status': course.get('enrl_stat'),
            'instructors': course.get('instructors', []),
            'meetings': course.get('meetings', []),
        }
        course_list.append(course_mapping)

    # Insert all courses into the 'courses' table
    if course_list:
        supabase.table('Course').insert(course_list).execute()

if __name__ == "__main__":
    populate_supabase()