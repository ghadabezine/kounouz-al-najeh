import React, { useState } from "react";
import "../styles/SubjectsDashboard.css";

const SubjectsDashboard = ({
    subjects,
    onViewChapters,
    onDeleteSubject,
    onAddSubject,
    onEditSubject,
}) => {
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [newSubject, setNewSubject] = useState("");
    const [editSubject, setEditSubject] = useState({ id: "", name: "" });

    const handleAddSubject = () => {
        if (newSubject.trim()) {
            onAddSubject(newSubject);
            setNewSubject("");
            setShowAddPopup(false);
        }
    };

    const handleEditSubject = () => {
        if (editSubject.name.trim()) {
            onEditSubject(editSubject.id, editSubject.name);
            setEditSubject({ id: "", name: "" });
            setShowEditPopup(false);
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h2>Your Courses</h2>
                <button className="add-button" onClick={() => setShowAddPopup(true)}>
                    + Add Course
                </button>
            </div>

            <div className="subjects-grid">
                {subjects.map((subject) => (
                    <div key={subject._id} className="subject-card" onClick={() => onViewChapters(subject)}>
                        <div className="card-actions">
                            <button 
                                className="edit-icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditSubject({ id: subject._id, name: subject.name });
                                    setShowEditPopup(true);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            </button>
                            <button 
                                className="delete-icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('Are you sure you want to delete this course?')) {
                                        onDeleteSubject(subject._id);
                                    }
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <h3>{subject.name}</h3>
                        <div className="card-footer">
                            <span>Click to view chapters</span>
                        </div>
                    </div>
                ))}
            </div>

            {showAddPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Add New Course</h3>
                        <input
                            type="text"
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            placeholder="Enter course name"
                        />
                        <div className="popup-buttons">
                            <button onClick={handleAddSubject}>Create</button>
                            <button onClick={() => setShowAddPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showEditPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Edit Course</h3>
                        <input
                            type="text"
                            value={editSubject.name}
                            onChange={(e) => setEditSubject({ ...editSubject, name: e.target.value })}
                            placeholder="Enter course name"
                        />
                        <div className="popup-buttons">
                            <button onClick={handleEditSubject}>Save</button>
                            <button onClick={() => {
                                setEditSubject({ id: "", name: "" });
                                setShowEditPopup(false);
                            }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectsDashboard;