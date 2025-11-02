import "./Header.css";
import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { AuthModal } from "./components/AuthModal";

function Header() {
    const { isAuthenticated, logout, user } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const username = user?.name || "User";

    return (
        <>
            <header className="header">
                <div className="header-left">
                    <img src="/944167.png" alt="Logo" className="logo" />
                    <h1>URSmart</h1>
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