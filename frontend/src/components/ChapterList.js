import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ChapterList.css';

const ChapterList = ({ subject, goBack, onFileUpload, onCreateQuiz, onViewQuizzes }) => {
  const [chapters, setChapters] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [newChapter, setNewChapter] = useState('');
  const [editingChapter, setEditingChapter] = useState({ id: '', name: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChapters();
  }, [subject]);

  const fetchChapters = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/chapters/subject/${subject._id}`);
      setChapters(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch chapters. Please try again.');
    }
  };

  const handleAddChapter = async () => {
    if (!newChapter.trim()) {
      setError('Chapter name cannot be empty');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5001/api/chapters', {
        name: newChapter,
        subject: subject._id
      });
      setChapters([...chapters, response.data]);
      setNewChapter('');
      setShowAddPopup(false);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add chapter');
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm('Are you sure you want to delete this chapter?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/chapters/${chapterId}`);
      setChapters(chapters.filter(chapter => chapter._id !== chapterId));
      setError(null);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete chapter');
    }
  };

  const handleEditChapter = async () => {
    if (!editingChapter.name.trim()) {
      setError('Chapter name cannot be empty');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:5001/api/chapters/${editingChapter.id}`, {
        name: editingChapter.name
      });
      setChapters(chapters.map(chapter =>
        chapter._id === editingChapter.id ? response.data : chapter
      ));
      setEditingChapter({ id: '', name: '' });
      setShowEditPopup(false);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to edit chapter');
    }
  };

  return (
    <div className="chapter-list">
      <div className="chapter-header">
        <h2>{subject.name} - Chapters</h2>
        <button onClick={goBack} className="back-button">Back to Courses</button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <button className="add-button" onClick={() => setShowAddPopup(true)}>
        + Add Chapter
      </button>
      <div className="chapters-grid">
        {chapters.map((chapter) => (
          <div key={chapter._id} className="chapter-card">
            <h3>{chapter.name}</h3>
            <div className="chapter-actions">
              <button onClick={() => onFileUpload(chapter)}>Upload File</button>
              <button onClick={() => onCreateQuiz(chapter)}>Create Quiz</button>
              <button onClick={() => onViewQuizzes(chapter)}>View Quizzes</button>
              <button onClick={() => {
                setEditingChapter({ id: chapter._id, name: chapter.name });
                setShowEditPopup(true);
              }}>Edit</button>
              <button onClick={() => handleDeleteChapter(chapter._id)}>Delete</button>
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
      {showEditPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Edit Chapter</h3>
            <input
              type="text"
              value={editingChapter.name}
              onChange={(e) => setEditingChapter({ ...editingChapter, name: e.target.value })}
              placeholder="Enter chapter name"
            />
            <div className="popup-buttons">
              <button onClick={handleEditChapter}>Confirm</button>
              <button onClick={() => setShowEditPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterList;
