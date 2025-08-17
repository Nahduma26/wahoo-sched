import { convertJsonToGroup } from "../utils/courseUtils";


async function getCourses(subject?: string, professor?: string, level?: string, status?: string, currentPage?: number, pageSize?: number): Promise<any> {
    const url = 'http://127.0.0.1:5000/api/courses'
    const params = new URLSearchParams();

    if (subject) params.append('subject', subject);
    if (professor) params.append('professor', professor);
    if (level) params.append('level', level);
    if (status) params.append('status', status);
    if (currentPage) params.append('page', currentPage.toString());
    if (pageSize) params.append('page_size', pageSize.toString());

    try {
        const response = await fetch(`${url}?${params.toString()}`)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

    const json = await response.json()
    console.log('Response JSON:', json)
    const courses = json.courses
    const totalPages = json.totalPages
    console.log('Fetched courses:', courses, 'Total pages:', totalPages)
    return { courses: convertJsonToGroup(courses), totalPages }
    } catch (error) {
        return { courses: [], totalPages: 0 };
        console.error('Error fetching courses:', error);
    }
}

export { getCourses }