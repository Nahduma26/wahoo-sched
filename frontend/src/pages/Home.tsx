import { useState, useEffect, useMemo } from "react"
import { getCourses} from "../services/courseService"
import FilterBar from "../components/FilterBar"
import CourseList from "../components/CourseList"
import type { CourseGroup, CourseSection } from "../types"
import { filterNonConflictingCourses } from "../utils/scheduleUtils"
import { sub } from "framer-motion/client"

interface HomeProps {
    courseData: CourseGroup[];
    setCourseData: (courses: CourseGroup[]) => void;
    mySchedule: CourseSection[];
    setMySchedule: (courses: CourseSection[]) => void;
    handleAddToSchedule: (course: CourseSection) => void;
}

function Home({ courseData, setCourseData, handleAddToSchedule, mySchedule }: HomeProps) {
  const [subjectFilter, setSubjectFilter] = useState<string>("")
  const [levelFilter, setLevelFilter] = useState<string>("")
  const [professorNameFilter, setProfessorNameFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [showOnlyNonConflicting, setShowOnlyNonConflicting] = useState(false);

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
  useEffect(() => {
    getCourses(subjectFilter, professorNameFilter, levelFilter, statusFilter).then((courses) => {
      setCourseData(courses)
    })
  }, [subjectFilter, professorNameFilter, levelFilter, statusFilter])

  const coursesToDisplay = useMemo(() => {
    if (!showOnlyNonConflicting || mySchedule.length === 0) {
      return courseData;
    }
    return courseData.map(course => ({
      ...course,
      sections: filterNonConflictingCourses(course.sections, mySchedule)
    }))
  }, [courseData, mySchedule, showOnlyNonConflicting])

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

      <CourseList courses={coursesToDisplay} handleAddToSchedule={handleAddToSchedule} mySchedule={mySchedule} />

    </div>
  )
}

export default Home