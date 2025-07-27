import { useState, useEffect } from "react"
import { Routes, Route, Link } from "react-router-dom"
import { getCourses} from "./services/courseService"
import FilterBar from "./components/FilterBar"
import CourseList from "./components/CourseList"
import type { Course } from "./types"
import Home from "./pages/Home"
import Schedule from "./pages/Schedule"
import ErrorPage from "./pages/ErrorPage"

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
    <div className="App">
      <nav>
        <Link to="/home">Go to Home</Link>
        <span> | </span>
        <Link to="/schedule">Go to My Schedule</Link>
      </nav>
      <Routes>
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
          element={<Schedule mySchedule={mySchedule} />}
        />
        <Route path = "*" element={<ErrorPage />} />
      </Routes>
    </div>
  )
}

export default App