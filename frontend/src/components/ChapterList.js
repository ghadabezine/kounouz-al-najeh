import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ChapterList.css';

const ChapterList = ({ 
    subject, 
    goBack, 
    onFileUpload, 
    onCreateQuiz, 
    onViewQuizzes,
    isDarkMode 
}) => {
    const [chapters, setChapters] = useState([]);
    const [isAddingChapter, setIsAddingChapter] = useState(false);
    const [isEditingChapter, setIsEditingChapter] = useState(false);
    const [editingChapter, setEditingChapter] = useState(null);
    const [newChapterName, setNewChapterName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchChapters();
    }, [subject._id]);

    const fetchChapters = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/api/chapters/subject/${subject._id}`);
            setChapters(response.data);
        } catch (error) {
            console.error('Error fetching chapters:', error);
        }
    };
    const handleAddChapter = async () => {
        if (!newChapterName.trim()) {
            alert('Please enter a chapter name');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5001/api/chapters', {
                name: newChapterName,
                subject: subject._id
            });

            if (response.data) {
                await fetchChapters(); // Refresh the chapters list
                setNewChapterName('');
                setIsAddingChapter(false);
            } else {
                alert('Failed to add chapter. Please try again.');
            }
        } catch (error) {
            console.error("❌ Error adding chapter:", error);
            alert('Failed to add chapter: ' + (error.response?.data?.error || 'Unknown error'));
        }
    };
    
    const handleEditChapter = async () => {
        if (newChapterName.trim() && editingChapter) {
            try {
                await axios.put(`http://localhost:5001/api/chapters/${editingChapter._id}`, {
                    name: newChapterName
                });
                setNewChapterName('');
                setIsEditingChapter(false);
                setEditingChapter(null);
                fetchChapters();
            } catch (error) {
                console.error('Error editing chapter:', error);
            }
        }
    };

    const startEdit = (e, chapter) => {
        e.stopPropagation(); // Prevent any parent click handlers
        setEditingChapter(chapter);
        setNewChapterName(chapter.name);
        setIsEditingChapter(true);
    };

    const handleDeleteChapter = async (chapterId) => {
        if (window.confirm('Are you sure you want to delete this chapter?')) {
            try {
                await axios.delete(`http://localhost:5001/api/chapters/${chapterId}`);
                fetchChapters();
            } catch (error) {
                console.error('Error deleting chapter:', error);
            }
        }
    };

    const filteredChapters = chapters.filter(chapter =>
        chapter.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="chapter-header">
                <h1 className="chapter-title">{subject.name}</h1>
                <button className="action-button" onClick={goBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back to Subjects
                </button>
            </div>

            <div className="search-bar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                    type="text"
                    placeholder="Search chapters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="stats-container">
                <div className="stat-card">
                    <h3>{chapters.length}</h3>
                    <p>Total Chapters</p>
                </div>
                <div className="stat-card">
                    <h3>{chapters.filter(c => c.files?.length > 0).length}</h3>
                    <p>Chapters with Content</p>
                </div>
                <div className="stat-card">
                    <h3>{chapters.filter(c => c.quizzes?.length > 0).length}</h3>
                    <p>Chapters with Quizzes</p>
                </div>
            </div>

            <button className="action-button" onClick={() => setIsAddingChapter(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"/>
                </svg>
                Add New Chapter
            </button>

            <div className="dashboard-grid">
                {filteredChapters.map(chapter => (
                    <div key={chapter._id} className="chapter-card">
                        <div className="card-icons">
                            <button className="icon-button edit" onClick={(e) => startEdit(e, chapter)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                            </button>
                            <button className="icon-button delete" onClick={() => handleDeleteChapter(chapter._id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>
                        
                        <div className="chapter-info">
                            <h3>{chapter.name}</h3>
                            <div className="chapter-meta">
                                <div className="chapter-meta-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                                        <polyline points="13 2 13 9 20 9"/>
                                    </svg>
                                    {chapter.files?.length || 0} Files
                                </div>
                                <div className="chapter-meta-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 11l3 3L22 4"/>
                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                                    </svg>
                                    {chapter.quizzes?.length || 0} Quizzes
                                </div>
                            </div>
                        </div>
                        
                        <div className="chapter-actions">
                            <button className="action-button" onClick={() => onFileUpload(chapter)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="17 8 12 3 7 8"/>
                                    <line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                                Upload Files
                            </button>
                            <button className="action-button" onClick={() => onCreateQuiz(chapter)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                    <path d="M14 2v6h6"/>
                                    <path d="M12 18v-6"/>
                                    <path d="M9 15h6"/>
                                </svg>
                                Create Quiz
                            </button>
                            <button 
                                className={`action-button ${chapter.quizzes?.length ? 'has-quizzes' : ''}`} 
                                onClick={() => onViewQuizzes(chapter)}
                                disabled={!chapter.quizzes?.length}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"/>
                                    <path d="M8 7h2"/>
                                    <path d="M8 11h2"/>
                                    <path d="M8 15h2"/>
                                </svg>
                                View Quizzes
                                {chapter.quizzes?.length > 0 && (
                                    <span className="quiz-count">{chapter.quizzes.length}</span>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {(isAddingChapter || isEditingChapter) && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{isEditingChapter ? 'Edit Chapter' : 'Add New Chapter'}</h2>
                        <input
                            type="text"
                            placeholder="Enter chapter name"
                            value={newChapterName}
                            onChange={(e) => setNewChapterName(e.target.value)}
                            autoFocus
                        />
                        <div className="modal-actions">
                            <button className="action-button" onClick={isEditingChapter ? handleEditChapter : handleAddChapter}>
                                {isEditingChapter ? 'Save Changes' : 'Add Chapter'}
                            </button>
                            <button className="action-button" onClick={() => {
                                setIsAddingChapter(false);
                                setIsEditingChapter(false);
                                setEditingChapter(null);
                                setNewChapterName('');
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

export default ChapterList;
