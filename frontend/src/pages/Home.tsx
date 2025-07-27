import { useState, useEffect } from "react"
import { getCourses} from "../services/courseService"
import FilterBar from "../components/FilterBar"
import CourseList from "../components/CourseList"
import type { Course } from "../types"
import { filterNonConflictingCourses } from "../utils/scheduleUtils"

interface HomeProps {
    courseData: Course[];
    setCourseData: (courses: Course[]) => void;
    mySchedule: Course[];
    setMySchedule: (courses: Course[]) => void;
    handleAddToSchedule: (course: Course) => void;
}

function Home({ courseData, setCourseData, handleAddToSchedule, mySchedule }: HomeProps) {
  const [subjectFilter, setSubjectFilter] = useState<string>("")
  const [levelFilter, setLevelFilter] = useState<string>("")
  const [professorNameFilter, setProfessorNameFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [showOnlyNonConflicting, setShowOnlyNonConflicting] = useState(false);
  var filteredCourses = courseData.filter((course) => {
    return (
      (subjectFilter === "" || course.subject.toLowerCase().includes(subjectFilter.toLowerCase()))
      && (levelFilter === "" || course.code.startsWith(levelFilter))
      && (professorNameFilter === "" || course.professor.toLowerCase().includes(professorNameFilter.toLowerCase()))
      && (statusFilter === "" || course.status === statusFilter)
    )
  })
  if (showOnlyNonConflicting) {
    filteredCourses = filterNonConflictingCourses(filteredCourses, mySchedule)
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
        showOnlyNonConflicting={showOnlyNonConflicting}
        setShowOnlyNonConflicting={setShowOnlyNonConflicting}
      />

      <CourseList courses={filteredCourses} handleAddToSchedule={handleAddToSchedule} />

    </div>
  )
}

export default Home