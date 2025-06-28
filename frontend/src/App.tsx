import { useState, useEffect } from "react"
import { getCourses} from "./services/courseService"
 
interface Course {
  id: number
  name: string
  description: string
}

function App() {
  const [courseData, setCourseData] = useState<Course[]>([])
  useEffect(() => {
    async function fetchCourses() {
      const courses = await getCourses()
      setCourseData(courses)
    }
    fetchCourses() 
  }, [])
  return (
    <div className="App">
      <h1>Course List</h1>
      <ul>
        {courseData.map((course) => (
          <li key={course.id}>
            {course.name} - {course.description}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App