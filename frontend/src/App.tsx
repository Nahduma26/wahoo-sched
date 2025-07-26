import { useState, useEffect } from "react"
import { getCourses} from "./services/courseService"
import FilterBar from "./components/FilterBar"
import CourseList from "./components/CourseList"
import type { Course } from "./types"
import Pagination from "./components/Pagination"

function App() {
  const [courseData, setCourseData] = useState<Course[]>([])
  const [mySchedule, setMySchedule] = useState<Course[]>([])
  function handleAddToSchedule(course: Course) {
    if (!mySchedule.some((c) => c.id === course.id)) {
      setMySchedule([...mySchedule, course])
    } else {
      alert("This course is already in your schedule.")
    }
  }
  useEffect(() => {
    async function fetchCourses() {
      const courses = await getCourses()
      setCourseData(courses)
    }
    fetchCourses() 
  }, [])
  return (
    <h1>Links</h1>
    
  )
}

export default App