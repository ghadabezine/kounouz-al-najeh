import React, { useState, useEffect } from "react";
import "../styles/ChaptersDashboard.css";

const ChaptersDashboard = ({
  subject,
  onFileUpload,
  onCreateQuiz,
  onViewQuizzes,
  onBackToSubjects,
}) => {
  const [chapters, setChapters] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newChapter, setNewChapter] = useState("");

  useEffect(() => {
    fetch(`/api/chapters/subject/${subject._id}`)
      .then((res) => res.json())
      .then((data) => setChapters(data))
      .catch((err) => console.error(err));
  }, [subject]);

  const handleAddChapter = () => {
    if (newChapter.trim()) {
      fetch('/api/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newChapter, subject: subject._id }),
      })
        .then((res) => res.json())
        .then((chapter) => {
          setChapters((prev) => [...prev, chapter]);
          setNewChapter("");
          setShowAddPopup(false);
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="dashboard">
      <button onClick={onBackToSubjects}>← Back to Courses</button>
      <h1>{subject.name} - Chapters</h1>

      <button className="add-button" onClick={() => setShowAddPopup(true)}>
        + Add Chapter
      </button>

      <div className="grid">
        {chapters.map((chapter) => (
          <div key={chapter._id} className="card">
            <h2>{chapter.name}</h2>
            <div className="button-container">
              <button className="button" onClick={() => onFileUpload(chapter)}>
                Upload File
              </button>
              <button className="button" onClick={() => onCreateQuiz(chapter)}>
                Create Quiz
              </button>
              <button className="button" onClick={() => onViewQuizzes(chapter)}>
                View Quizzes
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Add New Chapter</h3>
            <input
              type="text"
              value={newChapter}
              onChange={(e) => setNewChapter(e.target.value)}
              placeholder="Enter chapter name"
            />
            <div className="popup-buttons">
              <button onClick={handleAddChapter}>Confirm</button>
              <button onClick={() => setShowAddPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChaptersDashboard;
