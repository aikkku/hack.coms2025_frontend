import "./Searching.css";
import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { courseAPI } from "./services/api";

function Searching({ onSearch }) {
    const [query, setQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState("");
    const { token, isAuthenticated } = useAuth();

    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated || !token) {
            setError("Please login to search courses");
            return;
        }

        setSearching(true);
        setError("");

        try {
            const results = await courseAPI.searchCourses(token, query);
            if (onSearch) {
                onSearch(results);
            }
        } catch (err) {
            setError(err.message || "Failed to search courses");
        } finally {
            setSearching(false);
        }
    };

    return (
        <form className="search-container" onSubmit={handleSearch}>
            <input
                type="text"
                placeholder="Search courses by code, title, or instructors..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
                disabled={!isAuthenticated}
            />
            <button 
                type="submit" 
                className="search-button"
                disabled={searching || !isAuthenticated}
            >
                {searching ? "Searching..." : "Search"}
            </button>
            {error && <div className="search-error">{error}</div>}
        </form>
    );
}

export default Searching;