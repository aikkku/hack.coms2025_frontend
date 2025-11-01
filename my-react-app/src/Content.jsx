import "./Content.css";

function Content() {
    return (
        <div className="content-wrapper">
            <h2>Courses</h2>
            <p>This is where your main page content goes.</p>

            {/* fake long content to test scrolling */}
            <div className="content-block">
                {[...Array(30)].map((_, i) => (
                    <p key={i}>Item #{i + 1} — content...</p>
                ))}
            </div>
        </div>
    );
}

export default Content;