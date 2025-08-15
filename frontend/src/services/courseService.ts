import { groupCoursesBySection } from "../utils/courseUtils";


async function getCourses(subject?: string, professor?: string, level?: string, status?: string): Promise<any> {
    const url = 'http://127.0.0.1:5000/api/courses'
    const params = new URLSearchParams();

    if (subject) params.append('subject', subject);
    if (professor) params.append('professor', professor);
    if (level) params.append('level', level);
    if (status) params.append('status', status);

    try {
        const response = await fetch(`${url}?${params.toString()}`)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

    const json = await response.json()
    console.log(json)
    return groupCoursesBySection(json)
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

export { getCourses }