import './MaterialDetailModal.css';

// Material type mapping
const MATERIAL_TYPES = {
    0: 'Lecture',
    1: 'Assignment',
    2: 'Exam',
    3: 'Quiz',
    4: 'Notes',
    5: 'Other'
};

/**
 * MaterialDetailModal Component
 * Displays detailed information about a material in a popup/modal
 */
export function MaterialDetailModal({ material, onClose }) {
    if (!material) return null;

    return (
        <div className="material-detail-overlay" onClick={onClose}>
            <div className="material-detail-modal" onClick={(e) => e.stopPropagation()}>
                <div className="material-detail-header">
                    <h2>{material.title}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="material-detail-content">
                    <div className="material-detail-section">
                        <div className="material-badge">
                            {MATERIAL_TYPES[material.type] || `Type ${material.type}`}
                        </div>
                    </div>

                    <div className="material-detail-section">
                        <h3>Description</h3>
                        <p>{material.description || 'No description provided.'}</p>
                    </div>

                    {material.file_link && (
                        <div className="material-detail-section">
                            <h3>File</h3>
                            <a 
                                href={material.file_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="file-link"
                            >
                                View/Download File ↗
                            </a>
                        </div>
                    )}

                    <div className="material-detail-meta">
                        <div className="meta-item">
                            <span className="meta-label">Score:</span>
                            <span className="meta-value">{material.score}</span>
                        </div>
                    </div>
                </div>

                <div className="material-detail-footer">
                    <button onClick={onClose} className="close-modal-button">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

