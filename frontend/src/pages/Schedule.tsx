import type { Course } from "../types"

interface ScheduleProps {
    mySchedule: Course[];
}

export default function Schedule({ mySchedule }: ScheduleProps) {
    return (
        <div className="schedule">
            <h2>My Schedule</h2>
            {mySchedule.length === 0 ? (
                <p>No courses added to schedule.</p>
            ) : (
                <ul>
                    {mySchedule.map((course) => (
                        <li key={course.id}>
                            {course.subject} {course.code}: {course.name} - {course.professor}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}