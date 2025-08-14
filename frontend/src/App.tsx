import { useState, useEffect, use } from "react"
import { Routes, Route, Link } from "react-router-dom"
import { getCourses} from "./services/courseService"
import FilterBar from "./components/FilterBar"
import CourseList from "./components/CourseList"
import type { CourseGroup, CourseSection } from "./types"
import Home from "./pages/Home"
import Schedule from "./pages/Schedule"
import ErrorPage from "./pages/ErrorPage"

function App() {
  const [courseData, setCourseData] = useState<CourseGroup[]>([])
  const [mySchedule, setMySchedule] = useState<CourseSection[]>(() => { 
    const savedSchedule = localStorage.getItem("mySchedule")
    if (savedSchedule) {
      try {
        return JSON.parse(savedSchedule) as CourseSection[]
      } catch (error) {
        console.error("Error parsing schedule from localStorage:", error)
      }
    }
    return []
  })
  function handleAddToSchedule(course: CourseSection) {
    if (!mySchedule.some((c) => c.id === course.id)) {
      setMySchedule([...mySchedule, course])
    } else {
      alert("This course is already in your schedule.")
    }
  }
  function handleRemoveFromSchedule(course: CourseSection) {
    setMySchedule(mySchedule.filter((c) => c.id !== course.id))
  }
  useEffect(() => {
    async function fetchCourses() {
      const courses = await getCourses()
      setCourseData(courses)
    }
    fetchCourses() 
  }, [])
  useEffect(() => {
    localStorage.setItem("mySchedule", JSON.stringify(mySchedule))
  }, [mySchedule])
  return (
    <div className="App">
      <nav>
        <Link to="/home">Go to Home</Link>
        <span> | </span>
        <Link to="/schedule">Go to My Schedule</Link>
      </nav>
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              courseData={courseData} 
              setCourseData={setCourseData} 
              mySchedule={mySchedule} 
              setMySchedule={setMySchedule} 
              handleAddToSchedule={handleAddToSchedule}
            />
          }
        />
        <Route 
          path="/home" 
          element={
            <Home 
              courseData={courseData} 
              setCourseData={setCourseData} 
              mySchedule={mySchedule} 
              setMySchedule={setMySchedule} 
              handleAddToSchedule={handleAddToSchedule}
            />
          }
        />
        <Route
          path="/schedule"
          element={<Schedule mySchedule={mySchedule} handleRemoveFromSchedule={handleRemoveFromSchedule} />}
        />
        <Route path = "*" element={<ErrorPage />} />
      </Routes>
    </div>
  )
}

export default App