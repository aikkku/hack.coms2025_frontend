import { useEffect, useState } from 'react';
import './KarmaAlert.css';

/**
 * KarmaAlert Component
 * Shows a notification when user earns karma points
 */
export function KarmaAlert({ karma, level, onClose }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Auto-hide after 3 seconds
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // Wait for fade-out animation
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!visible) return null;

    return (
        <div className={`karma-alert ${visible ? 'visible' : ''}`}>
            <div className="karma-alert-content">
                <div className="karma-alert-icon">✨</div>
                <div className="karma-alert-text">
                    <div className="karma-alert-title">+{karma} Karma Earned!</div>
                    {level && (
                        <div className="karma-alert-level">Level: {level}</div>
                    )}
                </div>
            </div>
        </div>
    );
}

