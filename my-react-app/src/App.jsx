import "./App.css";
import Header from "./Header.jsx";
import Searching from "./Searching.jsx";
import Content from "./Content.jsx";
import Footer from "./Footer.jsx";

function App() {
    return (
        <div className="app-shell">
            <Header />
            <Searching />

            {/* this is the part that must grow */}
            <main className="page-content">
                <Content />

                <Footer />

            </main>

        </div>
    );
}

export default App;