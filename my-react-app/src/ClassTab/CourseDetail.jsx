// This is the page that shows when you click a course
import { useState } from 'react';
import './CourseDetail.css'; // This connects to our CSS file

// This function creates our course detail page
export function CourseDetail({ course, onBack }) {
    // These are like "memory" for our page - they remember what user selected
    const [selectedProfessor, setSelectedProfessor] = useState('all');
    const [selectedSemester, setSelectedSemester] = useState('all');
    const [activeTab, setActiveTab] = useState('resources'); // Tracks which tab is open

    // Mock data - pretend data until we get real data later
    const professors = ['Dr. Sarah Johnson', 'Dr. Mike Chen', 'Dr. Emily Davis'];
    const semesters = ['Fall 2023', 'Spring 2024', 'Fall 2024'];
    const resources = [
        {
            id: 1,
            title: 'Final Exam 2023 Past Exam',
            description: 'Previous year final exam with solutions',
            type: 'Exam',
            professor: 'Dr. Sarah Johnson',
            semester: 'Fall 2023',
            uploadDate: '2024-10-20',
            uploader: 'Mike R.',
            upvotes: 89
        }
    ];

    return (
        <div className="course-detail">
            {/* Back button to go back to course list */}
            <button className="back-button" onClick={onBack}>
                ← Back to Courses
            </button>

            {/* Course information at the top */}
            <div className="course-header">
                <h1 className="course-title">{course?.code}: {course?.name}</h1>
                <p className="course-description">{course?.description}</p>
                <p className="course-department">Department: {course?.department}</p>
            </div>

            {/* Filter section with dropdowns */}
            <div className="filters-section">
                <div className="filters-header">
                    <h3>Filters</h3>
                    <button className="clear-filters">
                        X Clear
                    </button>
                </div>

                <div className="filter-grid">
                    {/* Professor dropdown */}
                    <div className="filter-group">
                        <label>Professor</label>
                        <select className="filter-dropdown">
                            <option value="all">All professors</option>
                            {professors.map(prof => (
                                <option key={prof} value={prof}>{prof}</option>
                            ))}
                        </select>
                    </div>

                    {/* Semester dropdown */}
                    <div className="filter-group">
                        <label>Semester</label>
                        <select className="filter-dropdown">
                            <option value="all">All semesters</option>
                            {semesters.map(sem => (
                                <option key={sem} value={sem}>{sem}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabs for Resources vs Chat */}
            <div className="tabs-section">
                <div className="tabs">
                    <button className="tab active">
                        Resources (1)
                    </button>
                    <button className="tab">
                        Chat Bot
                    </button>
                </div>

                {/* Resources content */}
                <div className="resources-content">
                    <div className="resource-card">
                        <div className="resource-header">
                            <h4 className="resource-title">Final Exam 2023 Past Exam</h4>
                            <span className="resource-type">Exam</span>
                        </div>
                        <p className="resource-description">Previous year final exam with solutions</p>
                        <div className="resource-meta">
                            <span>👤 Mike R.</span>
                            <span>🗓️ 2024-10-20</span>
                            <span>👨‍🏫 Dr. Sarah Johnson</span>
                            <span>📅 Fall 2023</span>
                        </div>
                        <div className="resource-actions">
                            <button className="upvote-button">
                                👍 89 upvotes
                            </button>
                            <button className="download-button">
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}