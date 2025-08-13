import type { CourseSection } from '../types';

function hasTimeConflict(section1: CourseSection, section2: CourseSection): boolean {
    const days1 = new Set(section1.days);
    const days2 = new Set(section2.days);
    const commonDays = [...days1].filter(day => days2.has(day));

    if (commonDays.length === 0) return false;

    const start1 = section1.startTime;
    const end1 = section1.endTime;
    const start2 = section2.startTime;
    const end2 = section2.endTime;
    return (
        (start1 < end2 && end1 > start2) ||
        (start2 < end1 && end2 > start1)
    );
}

export function filterNonConflictingCourses(courses: CourseSection[], schedule: CourseSection[]): CourseSection[] {
    return courses.filter(course => {
        return !schedule.some(scheduledCourse => hasTimeConflict(course, scheduledCourse));
    });
}