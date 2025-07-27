import type { Course } from '../types';

function hasTimeConflict(course1: Course, course2: Course): boolean {
    const days1 = new Set(course1.days);
    const days2 = new Set(course2.days);
    const commonDays = [...days1].filter(day => days2.has(day));

    if (commonDays.length === 0) return false;

    const start1 = course1.startTime;
    const end1 = course1.endTime;
    const start2 = course2.startTime;
    const end2 = course2.endTime;
    return (
        (start1 < end2 && end1 > start2) ||
        (start2 < end1 && end2 > start1)
    );
}

export function filterNonConflictingCourses(courses: Course[], schedule: Course[]): Course[] {
    return courses.filter(course => {
        return !schedule.some(scheduledCourse => hasTimeConflict(course, scheduledCourse));
    });
}