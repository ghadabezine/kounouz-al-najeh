import React, { useState } from "react";
import "../styles/SubjectsDashboard.css";

const SubjectsDashboard = ({
    subjects,
    onFileUpload,
    onCreateQuiz,
    onViewQuizzes,
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
            <h1 className="title">Courses Dashboard</h1>

            <button className="add-button" onClick={() => setShowAddPopup(true)}>
                + Add Course
            </button>

            <div className="grid">
                {subjects.map((subject) => (
                    <div key={subject._id} className="card">
                        <button className="delete-button" onClick={() => onDeleteSubject(subject._id)}>
                            X
                        </button>

                        <button
                            className="edit-button"
                            onClick={() => {
                                setEditSubject({ id: subject._id, name: subject.name });
                                setShowEditPopup(true);
                            }}
                        >
                            Edit
                        </button>

                        <h2>{subject.name}</h2>

                        {/* Button container for horizontal alignment */}
                        <div className="button-container">
                            <button className="button" onClick={() => onFileUpload(subject)}>
                                Upload File
                            </button>
                            <button className="button" onClick={() => onCreateQuiz(subject)}>
                                Create Quiz
                            </button>
                            <button className="button" onClick={() => onViewQuizzes(subject)}>
                                View Quizzes
                            </button>
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
                            <button onClick={handleAddSubject}>Confirm</button>
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
                            placeholder="Enter new course name"
                        />
                        <div className="popup-buttons">
                            <button onClick={handleEditSubject}>Confirm</button>
                            <button onClick={() => setShowEditPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectsDashboard;