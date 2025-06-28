
async function getCourses(): Promise<any> {
    const url = 'http://127.0.0.1:5000/api/courses'

    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

    const json = await response.json()
    console.log(json)
    return json
    }
    catch (error) {
        console.error('Error fetching courses:', error);
    }
}

export { getCourses }