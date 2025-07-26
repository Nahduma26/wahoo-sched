import { useState, useEffect } from "react"
import { getCourses} from "../services/courseService"
import FilterBar from "../components/FilterBar"
import CourseList from "../components/CourseList"
import type { Course } from "../types"
import Pagination from "../components/Pagination"

function Home() {
  const [courseData, setCourseData] = useState<Course[]>([])
  const [subjectFilter, setSubjectFilter] = useState<string>("")
  const [levelFilter, setLevelFilter] = useState<string>("")
  const [professorNameFilter, setProfessorNameFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [mySchedule, setMySchedule] = useState<Course[]>([])
  const [coursesPerPage] = useState<number>(10)
  const indexOfLastCourse = currentPage * coursesPerPage
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage
  const currentCourses = courseData.slice(indexOfFirstCourse, indexOfLastCourse)
  const filteredCourses = courseData.filter((course) => {
    return (
      (subjectFilter === "" || course.subject.toLowerCase().includes(subjectFilter.toLowerCase()))
      && (levelFilter === "" || course.code.startsWith(levelFilter))
      && (professorNameFilter === "" || course.professor.toLowerCase().includes(professorNameFilter.toLowerCase()))
      && (statusFilter === "" || course.status === statusFilter)
    )
}
)
  function handleAddToSchedule(course: Course) {
    if (!mySchedule.some((c) => c.id === course.id)) {
      setMySchedule([...mySchedule, course])
    } else {
      alert("This course is already in your schedule.")
    }
  }
  function handleClearFilters() {
    setSubjectFilter("")
    setLevelFilter("")
    setProfessorNameFilter("")
    setStatusFilter("")
  }
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
        handleClearFilters={handleClearFilters}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <CourseList courses={currentCourses} handleAddToSchedule={handleAddToSchedule} />
      {/* <Pagination
        coursesPerPage={coursesPerPage}
        totalCourses={filteredCourses.length}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage} /> */}

    </div>
  )
}

export default Home