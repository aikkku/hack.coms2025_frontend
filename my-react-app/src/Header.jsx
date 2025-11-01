import "./Header.css";

function Header() {
    const username = "Rain";

    return (
        <header className="header">
            <div className="header-left">
                <img src="/944167.png" alt="Logo" className="logo" />
                <h1>URSmart</h1>
            </div>

            <div className="header-right">
                <span className="username">Hi, {username} 👋</span>
            </div>
        </header>
    );
}

export default Header;