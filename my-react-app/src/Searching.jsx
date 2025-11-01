import "./Searching.css";
import { useState } from "react";

function Searching() {
    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for:", query);
        // 🔍 You can replace this with your real search logic later
    };

    return (
        <form className="search-container" onSubmit={handleSearch}>
            <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
        </form>
    );
}

export default Searching;