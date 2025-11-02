import "./Content.css";
import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { courseAPI } from "./services/api";

// This function shows the list of courses on the main page
function Content({ onCourseSelect, searchQuery, searchResults }) {
    const { token, isAuthenticated } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Load courses when authenticated
    useEffect(() => {
        if (isAuthenticated && token) {
            loadCourses();
        } else {
            setCourses([]);
        }
    }, [isAuthenticated, token]);

    // Update courses when search results change
    useEffect(() => {
        if (searchResults && Array.isArray(searchResults)) {
            setCourses(searchResults);
        }
    }, [searchResults]);

    const loadCourses = async () => {
        setLoading(true);
        setError("");
        
        try {
            const results = await courseAPI.getCourses(token);
            setCourses(Array.isArray(results) ? results : []);
        } catch (err) {
            setError(err.message || "Failed to load courses");
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    // Transform backend course format to frontend format
    const transformCourse = (course) => {
        return {
            id: course.id,
            code: course.course_code || course.code,
            name: course.title || course.name,
            description: course.description || "",
            department: course.department || "",
            credits: course.credits || 0,
            instructors: course.instructors || "",
            // Keep all original data
            ...course
        };
    };

    if (!isAuthenticated) {
        return (
            <div className="content-wrapper">
                <h2>Available Courses</h2>
                <p>Please login to view available courses.</p>
            </div>
        );
    }

    if (loading && courses.length === 0) {
        return (
            <div className="content-wrapper">
                <h2>Available Courses</h2>
                <p>Loading courses...</p>
            </div>
        );
    }

    if (error && courses.length === 0) {
        return (
            <div className="content-wrapper">
                <h2>Available Courses</h2>
                <p className="error-message">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="content-wrapper">
            <h2>Available Courses</h2>
            <p>Click on any course to view resources, filters, and chat with our AI assistant.</p>

            {courses.length === 0 ? (
                <p>No courses found. {searchQuery ? "Try a different search term." : "Search for courses to get started."}</p>
            ) : (
                <div className="course-list">
                    {courses.map(course => {
                        const transformed = transformCourse(course);
                        return (
                            <div
                                key={transformed.id}
                                className="course-item"
                                onClick={() => onCourseSelect(transformed)}
                            >
                                <div className="course-header">
                                    <h3 className="course-code">{transformed.code}</h3>
                                    {transformed.credits > 0 && (
                                        <span className="credits-badge">{transformed.credits} credits</span>
                                    )}
                                </div>
                                <h4 className="course-name">{transformed.name}</h4>
                                {transformed.description && (
                                    <p className="course-description">{transformed.description}</p>
                                )}
                                {transformed.instructors && (
                                    <p className="course-department"><strong>Instructors:</strong> {transformed.instructors}</p>
                                )}
                                {transformed.department && (
                                    <p className="course-department"><strong>Department:</strong> {transformed.department}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Content;