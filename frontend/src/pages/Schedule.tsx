import type { CourseSection } from "../types"

interface ScheduleProps {
    mySchedule: CourseSection[];
    handleRemoveFromSchedule: (course: CourseSection) => void;
}

export default function Schedule({ mySchedule, handleRemoveFromSchedule }: ScheduleProps) {
    return (
        <div className="schedule">
            <h2>My Schedule</h2>
            {mySchedule.length === 0 ? (
                <p>No courses added to schedule.</p>
            ) : (
                <ul>
                    {mySchedule.map((course) => (
                        <li key={course.id}>
                            {course.subject} {course.catalog_number}: {course.name} - {course.professor}
                            <button onClick={() => handleRemoveFromSchedule(course)}>
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}