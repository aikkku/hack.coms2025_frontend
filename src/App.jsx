import "./App.css";
import Header from "./Header.jsx";
import Searching from "./Searching.jsx";
import Content from "./Content.jsx";
import Footer from "./Footer.jsx";
import { useState } from "react";
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