// components/SubjectsDashboard.js
import React from "react";

const SubjectsDashboard = ({ subjects, onFileUpload, onCreateQuiz, onViewQuizzes }) => {
    return (
        <div>
            <h1 className="title">Courses Dashboard</h1>
            <div className="grid">
                {subjects.map((subject) => (
                    <div key={subject._id} className="card">
                        <h2>{subject.name}</h2>
                        <button
                            className="button"
                            onClick={() => onFileUpload(subject)}
                        >
                            Upload File
                        </button>
                        <button
                            className="button"
                            onClick={() => onCreateQuiz(subject)}
                        >
                            Create Quiz
                        </button>
                        <button
                            className="button"
                            onClick={() => onViewQuizzes(subject)}
                        >
                            View Quizzes
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubjectsDashboard;