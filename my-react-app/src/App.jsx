import "./App.css";
import Header from "./Header.jsx";
import Searching from "./Searching.jsx";
import Content from "./Content.jsx";
import Footer from "./Footer.jsx";
import { useState } from 'react';
import { CourseDetail } from './ClassTab/CourseDetail';
import { AuthProvider } from './context/AuthContext';

function App() {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);

    const handleSearch = (results) => {
        setSearchResults(results);
        setSelectedCourse(null); // Clear selected course when searching
    };

    return (
        <AuthProvider>
            <div className="app-shell">
                <Header />
                <Searching onSearch={handleSearch} />

                {/* this is the part that must grow */}
                <main className="page-content">
                    {selectedCourse ? (
                        // If a course is selected, show course detail page
                        <CourseDetail
                            course={selectedCourse}
                            onBack={() => setSelectedCourse(null)}
                        />
                    ) : (
                        // Otherwise, show course list
                        <Content 
                            onCourseSelect={setSelectedCourse} 
                            searchQuery={searchQuery} 
                            searchResults={searchResults}
                        />
                    )}

                    <Footer />
                </main>
            </div>
        </AuthProvider>
    );
}

export default App;