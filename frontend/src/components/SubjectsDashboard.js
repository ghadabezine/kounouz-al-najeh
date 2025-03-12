import React from "react";
import "../styles/SubjectsDashboard.css"; // ✅ Import updated CSS

const SubjectsDashboard = ({ subjects, onFileUpload, onCreateQuiz, onViewQuizzes }) => {
  return (
    <div className="grid">
      {subjects.map((subject) => (
        <div key={subject._id} className="card">
          <h2>{subject.name}</h2>
          <div className="button-container">
            <button className="button" onClick={() => onFileUpload(subject)}>Upload File</button>
            <button className="button" onClick={() => onCreateQuiz(subject)}>Create Quiz</button>
            <button className="button" onClick={() => onViewQuizzes(subject)}>View Quizzes</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubjectsDashboard;
