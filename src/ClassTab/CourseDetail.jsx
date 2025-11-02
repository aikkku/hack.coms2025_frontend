// This is the page that shows when you click a course
import { useState, useEffect } from 'react';
import './CourseDetail.css';
import { useAuth } from '../context/AuthContext';
import { materialAPI, chatbotAPI, userAPI } from '../services/api';
import { MaterialForm } from '../components/MaterialForm';
import { MaterialDetailModal } from '../components/MaterialDetailModal';
import { KarmaAlert } from '../components/KarmaAlert';

/**
 * Get user level based on karma
 */
const getLevel = (karma) => {
    if (karma < 50) return 'Newbie';
    if (karma < 150) return 'Student';
    if (karma < 300) return 'Tutor';
    if (karma < 500) return 'Expert';
    return 'Master';
};

// Material type mapping (based on backend - type is an integer)
const MATERIAL_TYPES = {
    0: 'Lecture',
    1: 'Assignment',
    2: 'Exam',
    3: 'Quiz',
    4: 'Notes',
    5: 'Other'
};

/**
 * CourseDetail Component
 * Main component for viewing course details, materials, and chatbot
 */
export function CourseDetail({ course, onBack }) {
    const { token, isAuthenticated, refreshUser, user } = useAuth();
    const [activeTab, setActiveTab] = useState('resources');
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // UI state
    const [showMaterialForm, setShowMaterialForm] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    
    // Karma alert state
    const [karmaAlert, setKarmaAlert] = useState(null);
    
    // Chatbot state
    const [selectedMaterialsForChat, setSelectedMaterialsForChat] = useState([]);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [chatting, setChatting] = useState(false);

    // Fetch materials when component mounts or course changes
    useEffect(() => {
        if (isAuthenticated && token && course?.id) {
            loadMaterials();
        } else {
            setMaterials([]);
        }
    }, [isAuthenticated, token, course?.id]);

    const loadMaterials = async () => {
        if (!course?.id) return;
        
        setLoading(true);
        setError('');

        try {
            const results = await materialAPI.getMaterialsByCourse(token, course.id);
            setMaterials(Array.isArray(results) ? results : []);
        } catch (err) {
            setError(err.message || 'Failed to load materials');
            setMaterials([]);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle material deletion
     */
    const handleDeleteMaterial = async (material, e) => {
        e.stopPropagation(); // Prevent opening material modal
        
        if (!window.confirm(`Are you sure you want to delete "${material.title}"?`)) {
            return;
        }

        try {
            await materialAPI.deleteMaterial(token, material.id);
            // Reload materials after deletion
            await loadMaterials();
        } catch (err) {
            alert(`Failed to delete material: ${err.message}`);
        }
    };

    /**
     * Handle material creation success
     * Refresh materials list and show karma alert
     */
    const handleMaterialCreated = async (newMaterial) => {
        // Reload materials
        await loadMaterials();
        setShowMaterialForm(false);
        
        // Refresh user info to get updated karma
        refreshUser();
        
        // Show karma alert after a brief delay to allow user info to update
        setTimeout(async () => {
            try {
                const userInfo = await userAPI.getCurrentUser(token);
                const level = getLevel(userInfo.karma);
                setKarmaAlert({
                    karma: 10,
                    level: level
                });
            } catch (err) {
                console.error('Failed to fetch user karma:', err);
                setKarmaAlert({ karma: 10, level: null });
            }
        }, 500);
    };

    /**
     * Handle upvote - increase material score
     */
    const handleUpvote = async (material) => {
        if (!token) return;

        try {
            const updatedMaterial = {
                course_id: material.course_id,
                title: material.title,
                type: material.type,
                description: material.description,
                role: material.role,
                score: material.score + 1,
                file_link: material.file_link || ''
            };

            const updated = await materialAPI.updateMaterialScore(token, material.id, updatedMaterial);
            setMaterials(materials.map(m => m.id === material.id ? updated : m));
        } catch (err) {
            alert(`Failed to upvote: ${err.message}`);
        }
    };

    /**
     * Handle downvote - decrease material score
     */
    const handleDownvote = async (material) => {
        if (!token) return;

        try {
            const updatedMaterial = {
                course_id: material.course_id,
                title: material.title,
                type: material.type,
                description: material.description,
                role: material.role,
                score: Math.max(material.score - 1, 0), // Don't go below 0
                file_link: material.file_link || ''
            };

            const updated = await materialAPI.updateMaterialScore(token, material.id, updatedMaterial);
            setMaterials(materials.map(m => m.id === material.id ? updated : m));
        } catch (err) {
            alert(`Failed to downvote: ${err.message}`);
        }
    };

    /**
     * Toggle material selection for chatbot context
     */
    const toggleMaterialForChat = (materialId) => {
        setSelectedMaterialsForChat(prev => 
            prev.includes(materialId)
                ? prev.filter(id => id !== materialId)
                : [...prev, materialId]
        );
    };

    /**
     * Send chat message to chatbot
     */
    const handleSendChat = async () => {
        if (!chatMessage.trim() || selectedMaterialsForChat.length === 0) {
            alert('Please select materials and enter a message');
            return;
        }

        const userMessage = chatMessage.trim();
        setChatMessage('');
        setChatting(true);

        // Add user message to chat history
        const newHistory = [...chatHistory, { role: 'user', content: userMessage }];
        setChatHistory(newHistory);

        try {
            const response = await chatbotAPI.chat(
                token,
                course.id,
                selectedMaterialsForChat,
                userMessage
            );

            // Add bot response to chat history
            setChatHistory([
                ...newHistory,
                { role: 'assistant', content: response.response }
            ]);
        } catch (err) {
            alert(`Chat failed: ${err.message}`);
            setChatHistory(newHistory.slice(0, -1)); // Remove user message on error
        } finally {
            setChatting(false);
        }
    };


    return (
        <div className="course-detail">
            {/* Karma Alert */}
            {karmaAlert && (
                <KarmaAlert
                    karma={karmaAlert.karma}
                    level={karmaAlert.level}
                    onClose={() => setKarmaAlert(null)}
                />
            )}

            {/* Back button */}
            <button className="back-button" onClick={onBack}>
                ← Back to Courses
            </button>

            {/* Course information */}
            <div className="course-header">
                <h1 className="course-title">{course?.code}: {course?.name}</h1>
                {course?.description && (
                    <p className="course-description">{course.description}</p>
                )}
                {course?.instructors && (
                    <p className="course-department">Instructors: {course.instructors}</p>
                )}
            </div>

            {/* Tabs for Resources vs Chat */}
            <div className="tabs-section">
                <div className="tabs">
                    <button 
                        className={`tab ${activeTab === 'resources' ? 'active' : ''}`}
                        onClick={() => setActiveTab('resources')}
                    >
                        Resources ({materials.length})
                    </button>
                    <button 
                        className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
                        onClick={() => setActiveTab('chat')}
                    >
                        Chat Bot
                    </button>
                </div>

                {/* Resources Tab Content */}
                {activeTab === 'resources' && (
                    <div className="resources-content">
                        {/* Add Material Button */}
                        {isAuthenticated && (
                            <div className="add-material-section">
                                <button 
                                    className="add-material-button"
                                    onClick={() => setShowMaterialForm(true)}
                                >
                                    + Add Material
                                </button>
                            </div>
                        )}

                        {/* Loading State */}
                        {loading && <p className="loading-text">Loading materials...</p>}

                        {/* Error State */}
                        {error && <div className="error-message">Error: {error}</div>}

                        {/* Materials Grid - Horizontal Scrollable Tiles */}
                        {!loading && !error && (
                            <div className="materials-grid">
                                {materials.length === 0 ? (
                                    <p className="no-materials">No materials found. Be the first to add one!</p>
                                ) : (
                                    materials.map(material => {
                                        const isOwner = user && material.user_id === user.id;
                                        return (
                                            <div 
                                                key={material.id} 
                                                className="material-tile"
                                                onClick={() => setSelectedMaterial(material)}
                                            >
                                                <div className="material-tile-header">
                                                    <h4 className="material-tile-title">{material.title}</h4>
                                                    <div className="material-tile-header-right">
                                                        <span className="material-tile-type">
                                                            {MATERIAL_TYPES[material.type] || `Type ${material.type}`}
                                                        </span>
                                                        {isOwner && (
                                                            <button
                                                                className="delete-material-button"
                                                                onClick={(e) => handleDeleteMaterial(material, e)}
                                                                title="Delete this material"
                                                            >
                                                                🗑️
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="material-tile-description">
                                                    {material.description ? 
                                                        (material.description.length > 100 
                                                            ? material.description.substring(0, 100) + '...' 
                                                            : material.description)
                                                        : 'No description'}
                                                </p>
                                                
                                                {/* Reddit-style Vote Buttons */}
                                                <div className="material-tile-votes">
                                                    <button
                                                        className="vote-button upvote"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleUpvote(material);
                                                        }}
                                                        title="Upvote"
                                                    >
                                                        ▲
                                                    </button>
                                                    <span className="vote-score">{material.score}</span>
                                                    <button
                                                        className="vote-button downvote"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDownvote(material);
                                                        }}
                                                        title="Downvote"
                                                    >
                                                        ▼
                                                    </button>
                                                </div>

                                                {material.file_link && (
                                                    <div className="material-tile-file">
                                                        📎 File Available
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Chat Bot Tab Content */}
                {activeTab === 'chat' && (
                    <div className="chat-content">
                        <div className="chat-materials-selection">
                            <h3>Select Materials for Context</h3>
                            {materials.length === 0 ? (
                                <p>No materials available. Add materials first to use the chatbot.</p>
                            ) : (
                                <div className="material-checkboxes">
                                    {materials.map(material => (
                                        <label key={material.id} className="material-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={selectedMaterialsForChat.includes(material.id)}
                                                onChange={() => toggleMaterialForChat(material.id)}
                                            />
                                            <span>{material.title}</span>
                                            {material.file_link && <span className="has-file">📎</span>}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="chat-interface">
                            <div className="chat-messages">
                                {chatHistory.length === 0 ? (
                                    <div className="chat-placeholder">
                                        {selectedMaterialsForChat.length === 0 
                                            ? 'Select materials above and ask a question to get started!'
                                            : 'Start a conversation with the AI assistant...'}
                                    </div>
                                ) : (
                                    chatHistory.map((msg, idx) => (
                                        <div key={idx} className={`chat-message ${msg.role}`}>
                                            <div className="chat-message-content">
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))
                                )}
                                {chatting && (
                                    <div className="chat-message assistant">
                                        <div className="chat-message-content">
                                            Thinking...
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="chat-input-container">
                                <input
                                    type="text"
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && !chatting && handleSendChat()}
                                    placeholder="Ask a question about the selected materials..."
                                    className="chat-input"
                                    disabled={chatting || selectedMaterialsForChat.length === 0}
                                />
                                <button
                                    onClick={handleSendChat}
                                    disabled={chatting || selectedMaterialsForChat.length === 0 || !chatMessage.trim()}
                                    className="chat-send-button"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Material Form Modal */}
            {showMaterialForm && (
                <MaterialForm
                    courseId={course.id}
                    onSuccess={handleMaterialCreated}
                    onCancel={() => setShowMaterialForm(false)}
                />
            )}

            {/* Material Detail Modal */}
            {selectedMaterial && (
                <MaterialDetailModal
                    material={selectedMaterial}
                    onClose={() => setSelectedMaterial(null)}
                />
            )}
        </div>
    );
}
