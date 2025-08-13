import { form } from 'framer-motion/client';
import type { CourseSection, CourseGroup } from '../types';

export function groupCoursesBySection(json: any): CourseGroup[] {
    const courseGroups: { [key: string]: CourseGroup } = {};

    const courseSections: CourseSection[] = json.map((item: any) => jsonToCourseSection(item));

    courseSections.forEach(section => {
        const key = `${section.subject}-${section.catalog_number}`;
        if (!courseGroups[key]) {
            courseGroups[key] = {
                subject: section.subject,
                catalog_number: section.catalog_number,
                name: section.name,
                sections: []
            };
        }
        courseGroups[key].sections.push(section);
    });

    const groupsAsArray = Object.values(courseGroups);

    groupsAsArray.forEach(group => {
        group.sections.sort((a, b) => {
            return a.section.localeCompare(b.section);
        });
    });

    return groupsAsArray;
}

function jsonToCourseSection(json: any): CourseSection {
    const meeting = json.meetings?.[0] || {};
    const instructor = json.instructors?.[0] || {};
    const formatTime = (time: string | undefined): string => {
        if (!time) return '';
        const parts = time.split('.');
        return `${parts[0]}:${parts[1]}`;
    };
    return {
        subject: json.subject,
        catalog_number: json.catalog_number,
        name: json.title,
        credits: json.credits,
        id: json.id,
        section: json.section,
        professor: instructor.name || 'Unknown',
        days: parseDays(meeting.days || ''),
        startTime: formatTime(meeting.start_time),
        endTime: formatTime(meeting.end_time),
        status: json.status
    };
}

function parseDays(dayString: string): string[] {
    const dayMap: { [key: string]: string } = {
        'Mo': 'Mo',
        'Tu': 'Tu',
        'We': 'We',
        'Th': 'Th',
        'Fr': 'Fr',
    };
    if (dayString === "TBA") {
        return ['TBA'];
    }
    const dayArr = [];
    for (let i = 0; i < dayString.length; i += 2) {
        const day = dayString.slice(i, i + 2);
        if (dayMap[day]) {
            dayArr.push(dayMap[day]);
        }
    }
    return dayArr;
}
