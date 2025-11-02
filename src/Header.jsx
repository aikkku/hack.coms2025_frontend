import "./Header.css";
import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { AuthModal } from "./components/AuthModal";

function Header() {
    const { isAuthenticated, logout, user } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const username = user?.name || "User";

    const handleLogoClick = (e) => {
        e.preventDefault();
        // Dispatch custom event to reset app state without reloading
        // This prevents logout while navigating to home
        window.dispatchEvent(new CustomEvent('logoClick'));
        // Also scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <header className="header">
                <div className="header-left" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                    <img src="/Duck.png" alt="Logo" className="logo" />
                    <h1>UR Smart</h1>
                </div>

                <div className="header-right">
                    {isAuthenticated ? (
                        <>
                            <div className="user-info">
                                <span className="username">Hi, {username} 👋</span>
                                {user && (
                                    <div className="karma-display">
                                        <span className="karma-points">{user.karma || 0} Karma</span>
                                        <span className="user-level">{user.level || 'Newbie'}</span>
                                    </div>
                                )}
                            </div>
                            <button onClick={logout} className="logout-button">
                                Logout
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setShowAuthModal(true)} className="login-button">
                            Login
                        </button>
                    )}
                </div>
            </header>
            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </>
    );
}

export default Header;