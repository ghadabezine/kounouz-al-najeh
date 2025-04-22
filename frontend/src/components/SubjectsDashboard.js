import React, { useState } from "react";
import "../styles/SubjectsDashboard.css";

const SubjectsDashboard = ({
    subjects,
    onViewChapters,
    onDeleteSubject,
    onAddSubject,
    onEditSubject,
    isDarkMode
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleAdd = () => {
        if (newSubjectName.trim()) {
            onAddSubject(newSubjectName);
            setNewSubjectName('');
            setIsAdding(false);
        }
    };

    const handleEdit = () => {
        if (newSubjectName.trim() && editingSubject) {
            onEditSubject(editingSubject._id, newSubjectName);
            setNewSubjectName('');
            setIsEditing(false);
            setEditingSubject(null);
        }
    };

    const startEdit = (e, subject) => {
        e.stopPropagation(); // Prevent card click
        setEditingSubject(subject);
        setNewSubjectName(subject.name);
        setIsEditing(true);
    };

    const handleDelete = (e, subjectId) => {
        e.stopPropagation(); // Prevent card click
        if (window.confirm('Are you sure you want to delete this subject?')) {
            onDeleteSubject(subjectId);
        }
    };

    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="search-bar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                    type="text"
                    placeholder="Search subjects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="stats-container">
                <div className="stat-card">
                    <h3>{subjects.length}</h3>
                    <p>Total Subjects</p>
                </div>
                <div className="stat-card">
                    <h3>{subjects.filter(s => s.chapters?.length > 0).length}</h3>
                    <p>Active Subjects</p>
                </div>
            </div>

            <button className="action-button" onClick={() => setIsAdding(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"/>
                </svg>
                Add New Subject
            </button>

            <div className="dashboard-grid">
                {filteredSubjects.map(subject => (
                    <div 
                        key={subject._id} 
                        className="content-card"
                        onClick={() => onViewChapters(subject)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-icons">
                            <button className="icon-button edit" onClick={(e) => startEdit(e, subject)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                            </button>
                            <button className="icon-button delete" onClick={(e) => handleDelete(e, subject._id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>
                        <h2>{subject.name}</h2>
                        <p>{subject.chapters?.length || 0} Chapters</p>
                    </div>
                ))}
            </div>

            {(isAdding || isEditing) && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{isEditing ? 'Edit Subject' : 'Add New Subject'}</h2>
                        <input
                            type="text"
                            placeholder="Enter subject name"
                            value={newSubjectName}
                            onChange={(e) => setNewSubjectName(e.target.value)}
                            autoFocus
                        />
                        <div className="modal-actions">
                            <button className="action-button" onClick={isEditing ? handleEdit : handleAdd}>
                                {isEditing ? 'Save Changes' : 'Add Subject'}
                            </button>
                            <button className="action-button" onClick={() => {
                                setIsAdding(false);
                                setIsEditing(false);
                                setEditingSubject(null);
                                setNewSubjectName('');
                            }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectsDashboard;