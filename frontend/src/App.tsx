import { useState, useEffect } from "react"
import { getCourses} from "./services/courseService"
 
interface Course {
  id: number;
  name: string;
  subject: string;
  code: string;
  description: string;
  professor: string;
  credits: number;
  days: string[]; 
  startTime: string; 
  endTime: string;   
  gen_eds: string[]; 
  status: 'Open' | 'Closed' | 'Waitlisted'; 
}

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
      <div>
        <input
          type="text"
          className="subjectSearch"
          placeholder="Search by subject"
          value={subjectFilter}
          onChange = {
          (e) => {
            setSubjectFilter(e.target.value)
          } }></input>

          <select
          className="classLevel"
          value={levelFilter}
          onChange={(e) => {
            setLevelFilter(e.target.value)
          }}>
            <option value="">All Levels</option>
            <option value="1">1000 Levels</option>
            <option value="2">2000 Levels</option>
            <option value="3">3000 Levels</option>
            <option value="4">4000 Levels</option>
          </select>

          <input type="text"
          className="professorName" value={professorNameFilter}
          placeholder="Search by professor name"
          onChange ={(e) => {
            setProfessorNameFilter(e.target.value)
          } }
          ></input>


      </div>
      <div className="course-list"> 
        {filteredCourses.map((course) => (
          <div key={course.id} className="course-card">
            
            <div className="card-header">
              <h3>{course.subject} {course.code}: {course.name}</h3>
              <span className={course.status === 'Open' ? 'status-open' : 'status-closed'}>
                {course.status}
              </span>
            </div>

            <div className="card-body">
              <p><strong>Professor:</strong> {course.professor}</p>
              <p><strong>Credits:</strong> {course.credits}</p>
              <p><strong>Meets:</strong> {course.days.join('/')} from {course.startTime} - {course.endTime}</p>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default App