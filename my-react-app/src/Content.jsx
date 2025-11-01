import "./Content.css";

// This function shows the list of courses on the main page
function Content({ onCourseSelect }) { // ← Added onCourseSelect parameter
                                       // This is our course data - you can add more courses here later
    const courses = [
        {
            id: 'cs-101',
            code: 'CS 101',
            name: 'Introduction to Computer Science',
            description: 'Fundamental concepts of computer science including programming, algorithms, and data structures.',
            department: 'Computer Science',
            credits: 4
        },
        {
            id: 'cs-161',
            code: 'CS 161',
            name: 'Data Structures and Algorithms',
            description: 'Advanced data structures and algorithm analysis. Learn about arrays, linked lists, trees, and sorting algorithms.',
            department: 'Computer Science',
            credits: 4
        },
        {
            id: 'math-101',
            code: 'MATH 101',
            name: 'Calculus I',
            description: 'Introduction to differential and integral calculus with applications.',
            department: 'Mathematics',
            credits: 3
        }
    ];

    return (
        <div className="content-wrapper">
            <h2>Available Courses</h2>
            <p>Click on any course to view resources, filters, and chat with our AI assistant.</p>

            {/* Course List - replaces the fake content */}
            <div className="course-list">
                {courses.map(course => (
                    <div
                        key={course.id}
                        className="course-item"
                        onClick={() => onCourseSelect(course)} // ← THIS IS IMPORTANT: tells App which course was clicked
                    >
                        <div className="course-header">
                            <h3 className="course-code">{course.code}</h3>
                            <span className="credits-badge">{course.credits} credits</span>
                        </div>
                        <h4 className="course-name">{course.name}</h4>
                        <p className="course-description">{course.description}</p>
                        <p className="course-department"><strong>Department:</strong> {course.department}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Content;