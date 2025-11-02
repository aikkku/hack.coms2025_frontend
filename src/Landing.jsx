// Landing.jsx
import React, { useState } from "react";
import { AuthModal } from "./components/AuthModal.jsx"; // your path
import "./Landing.css";

export default function Landing({ onContinue }) {
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <div className="landing-container">
            {/* LEFT SIDE */}
            <div className="landing-left">
                <h1>Welcome to UR Smart</h1>
                <p>UR Smart, Together We Learn Smarter.</p>
                <button
                    className="signup-button"
                    onClick={() => setShowAuthModal(true)}
                >
                    Log in
                </button>
            </div>

            {/* RIGHT SIDE (decoration / hero) */}
            {/*<div className="landing-right">
                <div className="glass-card">
                    <h2>Browse classes faster</h2>
                    <p>Smart search · Filters · Saved courses</p>
                </div>
                <div className="circle c1"></div>
                <div className="circle c2"></div>
            </div> */}

            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    onSuccess={() => {
                        setShowAuthModal(false);
                        onContinue(); // go to main app
                    }}
                />
            )}
        </div>
    );
}