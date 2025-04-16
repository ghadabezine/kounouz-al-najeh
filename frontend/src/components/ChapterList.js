import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ChapterList.css';

const ChapterList = ({ subject, goBack }) => {
  const [chapters, setChapters] = useState([]);
  const [newChapter, setNewChapter] = useState('');
  const [editingChapter, setEditingChapter] = useState(null);
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
      console.error('Error fetching chapters:', error);
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
      setError(null);
    } catch (error) {
      console.error('Error adding chapter:', error);
      setError(error.response?.data?.error || 'Failed to add chapter');
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm('Are you sure you want to delete this chapter?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/api/chapters/${chapterId}`);
      setChapters(chapters.filter(chapter => chapter._id !== chapterId));
      setError(null);
    } catch (error) {
      console.error('Error deleting chapter:', error);
      setError(error.response?.data?.error || 'Failed to delete chapter');
    }
  };

  const handleEditChapter = async (chapterId, newName) => {
    if (!newName.trim()) {
      setError('Chapter name cannot be empty');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5001/api/chapters/${chapterId}`, {
        name: newName
      });
      setChapters(chapters.map(chapter => 
        chapter._id === chapterId ? response.data : chapter
      ));
      setEditingChapter(null);
      setError(null);
    } catch (error) {
      console.error('Error editing chapter:', error);
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

      <div className="add-chapter">
        <input
          type="text"
          value={newChapter}
          onChange={(e) => setNewChapter(e.target.value)}
          placeholder="Enter chapter name"
          onKeyPress={(e) => e.key === 'Enter' && handleAddChapter()}
        />
        <button onClick={handleAddChapter}>Add Chapter</button>
      </div>

      <div className="chapters-grid">
        {chapters.map((chapter) => (
          <div key={chapter._id} className="chapter-card">
            {editingChapter === chapter._id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={chapter.name}
                  onChange={(e) => {
                    const updatedChapters = chapters.map(c => 
                      c._id === chapter._id ? { ...c, name: e.target.value } : c
                    );
                    setChapters(updatedChapters);
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleEditChapter(chapter._id, chapter.name)}
                />
                <div className="edit-buttons">
                  <button onClick={() => handleEditChapter(chapter._id, chapter.name)}>Save</button>
                  <button onClick={() => setEditingChapter(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h3>{chapter.name}</h3>
                <div className="chapter-actions">
                  <button onClick={() => setEditingChapter(chapter._id)}>Edit</button>
                  <button onClick={() => handleDeleteChapter(chapter._id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterList; 