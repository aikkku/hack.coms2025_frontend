import "./App.css";
import Header from "./Header.jsx";
import Searching from "./Searching.jsx";
import Content from "./Content.jsx";
import Footer from "./Footer.jsx";
import { useState, useEffect } from "react";
import { CourseDetail } from "./ClassTab/CourseDetail";
import { AuthProvider } from "./context/AuthContext";
import Landing from "./Landing.jsx";

function App() {
    const [showLanding, setShowLanding] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [searchQuery] = useState("");
    const [searchResults, setSearchResults] = useState(null);

    const handleSearch = (results) => {
        setSearchResults(results);
        setSelectedCourse(null);
    };

    // Handle logo click - reset to main page without reloading
    const handleLogoClick = () => {
        setSelectedCourse(null);
        setSearchResults(null);
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Listen for logo click events
    useEffect(() => {
        const handleLogoClickEvent = () => {
            handleLogoClick();
        };
        window.addEventListener('logoClick', handleLogoClickEvent);
        return () => window.removeEventListener('logoClick', handleLogoClickEvent);
    }, []);

    return (
        // ✅ Wrap the whole app, including the landing page
        <AuthProvider>
            {showLanding ? (
                <Landing onContinue={() => setShowLanding(false)} />
            ) : (
                <div className="app-shell">
                    <Header />
                    <main className="page-content">
                        <Searching onSearch={handleSearch} />
                        {selectedCourse ? (
                            <CourseDetail
                                course={selectedCourse}
                                onBack={() => setSelectedCourse(null)}
                            />
                        ) : (
                            <Content
                                onCourseSelect={setSelectedCourse}
                                searchQuery={searchQuery}
                                searchResults={searchResults}
                            />
                        )}
                        <Footer />
                    </main>
                </div>
            )}
        </AuthProvider>
    );
}

export default App;