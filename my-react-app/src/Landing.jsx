// Landing.jsx
import React, { useState } from "react";
import { AuthModal } from "./components/AuthModal.jsx"; // adjust path
import "./Landing.css";

export default function Landing({ onContinue }) {
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <div className="landing-container">
            <h1>Welcome to Course Finder</h1>
            <p>Discover and explore all available courses easily.</p>

            <button
                className="signup-button"
                onClick={() => setShowAuthModal(true)}
            >
                Sign Up
            </button>

            {showAuthModal && (
                <AuthModal
                    // ❗ just close modal
                    onClose={() => setShowAuthModal(false)}
                    // ✅ only when auth success → go to main app
                    onSuccess={() => {
                        setShowAuthModal(false);
                        onContinue(); // <- this sets showLanding(false) in App
                    }}
                />
            )}
        </div>
    );
}