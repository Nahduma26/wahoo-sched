import { useState, useEffect } from "react"
import { getCourses} from "../services/courseService"
import FilterBar from "../components/FilterBar"
import CourseList from "../components/CourseList"
import type { CourseGroup, CourseSection } from "../types"
import { filterNonConflictingCourses } from "../utils/scheduleUtils"

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
  var filteredCourses = courseData.filter((group) => {
    const groupMatches = (subjectFilter === "" || group.subject.toLowerCase().includes(subjectFilter.toLowerCase())) && (levelFilter === "" || group.catalog_number.startsWith(levelFilter));
    return groupMatches && group.sections.length > 0;
  }).map((group) => {
    var filteredSections = group.sections.filter((section) => {
      return (
        (professorNameFilter === "" || section.professor.toLowerCase().includes(professorNameFilter.toLowerCase())) &&
        (statusFilter === "" || section.status === statusFilter)
      )
  })
    if (showOnlyNonConflicting && mySchedule.length > 0) {
      filteredSections = filterNonConflictingCourses(filteredSections, mySchedule)
    }
    return {
      ...group,
      sections: filteredSections
    }
  })
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

      <CourseList courses={filteredCourses} handleAddToSchedule={handleAddToSchedule} mySchedule={mySchedule} />

    </div>
  )
}

export default Home