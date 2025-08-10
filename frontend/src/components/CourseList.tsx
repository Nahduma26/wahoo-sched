import type { Course } from '../types';

interface CourseListProps {
  courses: Course[];
  handleAddToSchedule: (course: Course) => void;
  mySchedule?: Course[];
}

export default function CourseList({ courses, handleAddToSchedule, mySchedule }: CourseListProps) {
  return (
    <div className="course-list">
      {courses.map((course) => {
        if (!mySchedule?.some((c) => c.id === course.id)) {
          return (
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
              <div className="card-footer">
                <button className="add-button" onClick={() => handleAddToSchedule(course)}>
                  Add to Schedule
                </button>
              </div>
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
}