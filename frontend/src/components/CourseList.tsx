import type { CourseGroup, CourseSection } from '../types';

interface CourseListProps {
  courses: CourseGroup[];
  handleAddToSchedule: (course: CourseSection) => void;
  mySchedule?: CourseSection[];
}

export default function CourseList({ courses, handleAddToSchedule, mySchedule }: CourseListProps) {
  return (
    <div className="course-list">
      {courses.length > 0 ? (
        courses.map((courseGroup) => (
          <div key={`${courseGroup.subject}-${courseGroup.catalog_number}`} className="course-group">
            <h2>{`${courseGroup.subject} ${courseGroup.catalog_number}: ${courseGroup.name}`}</h2>
            <ul>
              {courseGroup.sections.map((section) => (
                <li key={section.id} className="course-section">
                  <div>
                    <strong>Section:</strong> {section.section} | <strong>Professor:</strong> {section.professor} | <strong>Days:</strong> {section.days.join(', ')} | <strong>Time:</strong> {section.startTime} - {section.endTime} | <strong>Status:</strong> {section.status}
                  </div>
                  <button 
                    onClick={() => handleAddToSchedule(section)}
                    disabled={mySchedule?.some((c) => c.id === section.id)}
                  >
                    {mySchedule?.some((c) => c.id === section.id) ? "In Schedule" : "Add to Schedule"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
}