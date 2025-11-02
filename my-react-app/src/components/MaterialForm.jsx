import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { materialAPI } from '../services/api';
import './MaterialForm.css';

// Material type options (matching backend)
const MATERIAL_TYPES = [
    { value: 0, label: 'Lecture' },
    { value: 1, label: 'Assignment' },
    { value: 2, label: 'Exam' },
    { value: 3, label: 'Quiz' },
    { value: 4, label: 'Notes' },
    { value: 5, label: 'Other' }
];

/**
 * MaterialForm Component
 * Allows users to create and submit new course materials
 */
export function MaterialForm({ courseId, onSuccess, onCancel }) {
    const { token } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState(0);
    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            // Create material with default values
            const materialData = {
                course_id: courseId,
                title: title.trim(),
                description: description.trim(),
                type: type,
                role: false, // Default role value
                score: 0, // Initial score is 0
                file_link: '' // Will be updated if file is uploaded
            };

            // Create the material first
            const createdMaterial = await materialAPI.createMaterial(token, materialData);

            // If file is provided, upload it
            if (file) {
                try {
                    const uploadedMaterial = await materialAPI.uploadFile(token, createdMaterial.id, file);
                    // Material with file uploaded successfully
                    onSuccess?.(uploadedMaterial);
                } catch (uploadError) {
                    // Material created but file upload failed - still success but warn user
                    console.error('Material created but file upload failed:', uploadError);
                    onSuccess?.(createdMaterial);
                    alert('Material created but file upload failed. You can upload the file later.');
                }
            } else {
                // No file, just created material
                onSuccess?.(createdMaterial);
            }

            // Reset form
            setTitle('');
            setDescription('');
            setType(0);
            setFile(null);
        } catch (err) {
            setError(err.message || 'Failed to create material');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="material-form-overlay" onClick={onCancel}>
            <div className="material-form" onClick={(e) => e.stopPropagation()}>
                <div className="material-form-header">
                    <h2>Add New Material</h2>
                    <button className="close-button" onClick={onCancel}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="form-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter material title"
                            required
                            maxLength={200}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the material..."
                            required
                            rows={4}
                            maxLength={1000}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">Type *</label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(parseInt(e.target.value))}
                            required
                        >
                            {MATERIAL_TYPES.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="file">File (Optional)</label>
                        <input
                            id="file"
                            type="file"
                            onChange={(e) => setFile(e.target.files[0] || null)}
                            accept=".docx,.pdf,.txt"
                        />
                        {file && (
                            <p className="file-info">Selected: {file.name}</p>
                        )}
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="cancel-button">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting} className="submit-button">
                            {submitting ? 'Creating...' : 'Create Material'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

