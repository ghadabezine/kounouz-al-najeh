// components/SubjectsDashboard.js
import React from "react";

const SubjectsDashboard = ({ subjects, onFileUpload, onCreateQuiz }) => {
    return (
        <div>
            <h1 className="title">Courses Dashboard</h1>
            <div className="grid">
                {subjects.map((subject) => (
                    <div key={subject._id} className="card">
                        <h2>{subject.name}</h2>
                        <button
                            className="button"
                            onClick={() => onFileUpload(subject)} // ✅ Correct handler
                        >
                            Upload File
                        </button>
                        <button
                            className="button"
                            onClick={() => onCreateQuiz(subject)} // ✅ Create quiz button
                        >
                            Create Quiz
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubjectsDashboard;
