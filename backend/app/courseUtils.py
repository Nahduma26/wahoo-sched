def group_courses_by_section(courses):
    course_groups = {}
    
    for course in courses:
        section = convert_course_to_section(course)
        key = f"{section['subject']}-{section['catalog_number']}"
        
        if key not in course_groups:
            course_groups[key] = {
                'subject': section['subject'],
                'catalog_number': section['catalog_number'],
                'name': section['name'],
                'sections': []
            }
        
        course_groups[key]['sections'].append(section)
    
    groups_as_array = list(course_groups.values())
    
    for group in groups_as_array:
        group['sections'].sort(key=lambda x: x['section'])
    
    return groups_as_array


def convert_course_to_section(course):
    meeting = course.get('meetings', [{}])[0] if course.get('meetings') else {}
    instructor = course.get('instructors', [{}])[0] if course.get('instructors') else {}
    
    def format_time(time_str):
        if not time_str:
            return ''
        parts = str(time_str).split('.')
        return f"{parts[0]}:{parts[1]}" if len(parts) > 1 else str(time_str)
    
    section = {
        'subject': course.get('subject', ''),
        'catalog_number': course.get('catalog_number', ''),
        'name': course.get('title', ''),
        'credits': course.get('credits', ''),
        'id': course.get('id', 0),
        'section': course.get('section', ''),
        'professor': instructor.get('name', 'Unknown'),
        'days': parse_days(meeting.get('days', '')),
        'startTime': format_time(meeting.get('start_time')),
        'endTime': format_time(meeting.get('end_time')),
        'status': course.get('status', '')
    }
    
    return section


def parse_days(day_string):
    day_map = {
        'Mo': 'Mo',
        'Tu': 'Tu', 
        'We': 'We',
        'Th': 'Th',
        'Fr': 'Fr'
    }
    
    if day_string == "TBA":
        return ['TBA']
    
    day_arr = []
    i = 0
    while i < len(day_string):
        day = day_string[i:i+2]
        if day in day_map:
            day_arr.append(day_map[day])
            i += 2
        else:
            i += 1
    
    return day_arr