import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
 */
export function CourseDetail({ course, onBack }) {
    const { token, isAuthenticated, refreshUser, user } = useAuth();
    const [activeTab, setActiveTab] = useState('resources');
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [showMaterialForm, setShowMaterialForm] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    const [karmaAlert, setKarmaAlert] = useState(null);

    const [selectedMaterialsForChat, setSelectedMaterialsForChat] = useState([]);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [chatting, setChatting] = useState(false);

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

    const handleDeleteMaterial = async (material, e) => {
        e.stopPropagation();
        if (!window.confirm(`Are you sure you want to delete "${material.title}"?`)) return;

        try {
            await materialAPI.deleteMaterial(token, material.id);
            await loadMaterials();
        } catch (err) {
            alert(`Failed to delete material: ${err.message}`);
        }
    };

    const handleMaterialCreated = async () => {
        await loadMaterials();
        setShowMaterialForm(false);
        refreshUser();

        setTimeout(async () => {
            try {
                const userInfo = await userAPI.getCurrentUser(token);
                const level = getLevel(userInfo.karma);
                setKarmaAlert({ karma: 10, level });
            } catch (err) {
                console.error('Failed to fetch user karma:', err);
                setKarmaAlert({ karma: 10, level: null });
            }
        }, 500);
    };

    const handleUpvote = async (material) => {
        if (!token) return;
        try {
            const updatedMaterial = {
                ...material,
                score: material.score + 1
            };
            const updated = await materialAPI.updateMaterialScore(token, material.id, updatedMaterial);
            setMaterials(materials.map(m => m.id === material.id ? updated : m));
        } catch (err) {
            alert(`Failed to upvote: ${err.message}`);
        }
    };

    const handleDownvote = async (material) => {
        if (!token) return;
        try {
            const updatedMaterial = {
                ...material,
                score: Math.max(material.score - 1, 0)
            };
            const updated = await materialAPI.updateMaterialScore(token, material.id, updatedMaterial);
            setMaterials(materials.map(m => m.id === material.id ? updated : m));
        } catch (err) {
            alert(`Failed to downvote: ${err.message}`);
        }
    };

    const toggleMaterialForChat = (materialId) => {
        setSelectedMaterialsForChat(prev =>
            prev.includes(materialId)
                ? prev.filter(id => id !== materialId)
                : [...prev, materialId]
        );
    };

    const handleSendChat = async () => {
        if (!chatMessage.trim() || selectedMaterialsForChat.length === 0) {
            alert('Please select materials and enter a message');
            return;
        }

        const userMessage = chatMessage.trim();
        setChatMessage('');
        setChatting(true);
        const newHistory = [...chatHistory, { role: 'user', content: userMessage }];
        setChatHistory(newHistory);

        try {
            const response = await chatbotAPI.chat(
                token,
                course.id,
                selectedMaterialsForChat,
                userMessage
            );
            setChatHistory([
                ...newHistory,
                { role: 'assistant', content: response.response }
            ]);
        } catch (err) {
            alert(`Chat failed: ${err.message}`);
            setChatHistory(newHistory);
        } finally {
            setChatting(false);
        }
    };

    return (
        <div className="course-detail">
            {karmaAlert && (
                <KarmaAlert
                    karma={karmaAlert.karma}
                    level={karmaAlert.level}
                    onClose={() => setKarmaAlert(null)}
                />
            )}

            <button className="back-button" onClick={onBack}>
                ← Back to Courses
            </button>

            <div className="course-header">
                <h1 className="course-title">{course?.code}: {course?.name}</h1>
                {course?.description && <p className="course-description">{course.description}</p>}
                {course?.instructors && <p className="course-department">Instructors: {course.instructors}</p>}
            </div>

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

                {/* === Resources Tab === */}
                {activeTab === 'resources' && (
                    <div className="resources-content">
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
                        {loading && <p className="loading-text">Loading materials...</p>}
                        {error && <div className="error-message">Error: {error}</div>}

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
                                                            >
                                                                🗑️
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="material-tile-description">
                                                    {material.description
                                                        ? material.description.length > 100
                                                            ? material.description.substring(0, 100) + '...'
                                                            : material.description
                                                        : 'No description'}
                                                </p>

                                                <div className="material-tile-votes">
                                                    <button
                                                        className="vote-button upvote"
                                                        onClick={(e) => { e.stopPropagation(); handleUpvote(material); }}
                                                    >
                                                        ▲
                                                    </button>
                                                    <span className="vote-score">{material.score}</span>
                                                    <button
                                                        className="vote-button downvote"
                                                        onClick={(e) => { e.stopPropagation(); handleDownvote(material); }}
                                                    >
                                                        ▼
                                                    </button>
                                                </div>

                                                {material.file_link && (
                                                    <div className="material-tile-file">📎 File Available</div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* === Chat Bot Tab === */}
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
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {msg.content}
                                                </ReactMarkdown>
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

            {showMaterialForm && (
                <MaterialForm
                    courseId={course.id}
                    onSuccess={handleMaterialCreated}
                    onCancel={() => setShowMaterialForm(false)}
                />
            )}

            {selectedMaterial && (
                <MaterialDetailModal
                    material={selectedMaterial}
                    onClose={() => setSelectedMaterial(null)}
                />
            )}
        </div>
    );
}
