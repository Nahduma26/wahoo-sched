import { useState, useEffect } from "react"
import { getCourses} from "./services/courseService"
import FilterBar from "./components/FilterBar"
import CourseList from "./components/CourseList"
import type { Course } from "./types"


function App() {
  const [courseData, setCourseData] = useState<Course[]>([])
  const [subjectFilter, setSubjectFilter] = useState<string>("")
  const [levelFilter, setLevelFilter] = useState<string>("")
  const [professorNameFilter, setProfessorNameFilter] = useState<string>("")
  const filteredCourses = courseData.filter((course) => {
    return (
      (subjectFilter === "" || course.subject.toLowerCase().includes(subjectFilter.toLowerCase()))
      && (levelFilter === "" || course.code.startsWith(levelFilter))
      && (professorNameFilter === "" || course.professor.toLowerCase().includes(professorNameFilter.toLowerCase()))
    )
}
)
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
      <FilterBar
        subjectFilter={subjectFilter}
        setSubjectFilter={setSubjectFilter}
        levelFilter={levelFilter}
        setLevelFilter={setLevelFilter}
        professorNameFilter={professorNameFilter}
        setProfessorNameFilter={setProfessorNameFilter}
      />
      
      <CourseList courses={filteredCourses} />
    </div>
  )
}

export default App