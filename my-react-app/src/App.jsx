import "./App.css";
import Header from "./Header.jsx";
import Searching from "./Searching.jsx";
import Content from "./Content.jsx";
import Footer from "./Footer.jsx";
// earvin
import { useState } from 'react'; // ← ADD THIS LINE
import { CourseDetail } from './ClassTab/CourseDetail';

function App() {
    //earvin
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="app-shell">
            <Header />
            <Searching />

            {/* this is the part that must grow */}
            <main className="page-content">
                {/* ← REPLACE <Content /> with this conditional logic */}
                {selectedCourse ? (
                    // If a course is selected, show YOUR course detail page
                    <CourseDetail
                        course={selectedCourse}
                        onBack={() => setSelectedCourse(null)}
                    />
                ) : (
                    // Otherwise, show your partner's content
                <Content onCourseSelect={setSelectedCourse} searchQuery={searchQuery} />
                    )}

                <Footer />

            </main>

        </div>
    );
}

export default App;