import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ChapterQuizzes.css';

const ChapterQuizzes = ({ chapter, goBack }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [newQuiz, setNewQuiz] = useState({
        title: '',
        questions: [{
            questionText: '',
            options: ['', '', '', ''],
            correctAnswer: ''
        }]
    });

    useEffect(() => {
        fetchQuizzes();
    }, [chapter]);

    const fetchQuizzes = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/api/quizzes?chapter=${chapter._id}`);
            setQuizzes(response.data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };

    const handleAddQuiz = async () => {
        try {
            const response = await axios.post('http://localhost:5001/api/quizzes', {
                ...newQuiz,
                chapter: chapter._id
            });
            setQuizzes([...quizzes, response.data]);
            setShowAddPopup(false);
            setNewQuiz({
                title: '',
                questions: [{
                    questionText: '',
                    options: ['', '', '', ''],
                    correctAnswer: ''
                }]
            });
        } catch (error) {
            console.error('Error adding quiz:', error);
        }
    };

    const handleEditQuiz = async () => {
        try {
            const response = await axios.put(`http://localhost:5001/api/quizzes/${editingQuiz._id}`, editingQuiz);
            setQuizzes(quizzes.map(q => q._id === editingQuiz._id ? response.data : q));
            setShowEditPopup(false);
            setEditingQuiz(null);
        } catch (error) {
            console.error('Error editing quiz:', error);
        }
    };

    const handleDeleteQuiz = async (quizId) => {
        try {
            await axios.delete(`http://localhost:5001/api/quizzes/${quizId}`);
            setQuizzes(quizzes.filter(q => q._id !== quizId));
        } catch (error) {
            console.error('Error deleting quiz:', error);
        }
    };

    const addQuestion = () => {
        setNewQuiz(prev => ({
            ...prev,
            questions: [...prev.questions, {
                questionText: '',
                options: ['', '', '', ''],
                correctAnswer: ''
            }]
        }));
    };

    return (
        <div className="chapter-quizzes">
            <div className="quizzes-header">
                <h2>Quizzes for {chapter.title}</h2>
                <button onClick={goBack} className="back-button">Back to Chapters</button>
            </div>

            <button className="add-button" onClick={() => setShowAddPopup(true)}>
                + Add Quiz
            </button>

            <div className="quizzes-grid">
                {quizzes.map(quiz => (
                    <div key={quiz._id} className="quiz-card">
                        <h3>{quiz.title}</h3>
                        <div className="quiz-actions">
                            <button onClick={() => {
                                setEditingQuiz(quiz);
                                setShowEditPopup(true);
                            }}>Edit</button>
                            <button onClick={() => handleDeleteQuiz(quiz._id)}>Delete</button>
                        </div>
                        <div className="questions-list">
                            {quiz.questions.map((q, index) => (
                                <div key={index} className="question-item">
                                    <p>{q.questionText}</p>
                                    <ul>
                                        {q.options.map((opt, optIndex) => (
                                            <li key={optIndex} className={opt === q.correctAnswer ? 'correct' : ''}>
                                                {opt}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {showAddPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Add New Quiz</h3>
                        <input
                            type="text"
                            placeholder="Quiz Title"
                            value={newQuiz.title}
                            onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                        />
                        {newQuiz.questions.map((q, qIndex) => (
                            <div key={qIndex} className="question-form">
                                <input
                                    type="text"
                                    placeholder="Question Text"
                                    value={q.questionText}
                                    onChange={(e) => {
                                        const updated = [...newQuiz.questions];
                                        updated[qIndex].questionText = e.target.value;
                                        setNewQuiz({ ...newQuiz, questions: updated });
                                    }}
                                />
                                {q.options.map((opt, optIndex) => (
                                    <input
                                        key={optIndex}
                                        type="text"
                                        placeholder={`Option ${optIndex + 1}`}
                                        value={opt}
                                        onChange={(e) => {
                                            const updated = [...newQuiz.questions];
                                            updated[qIndex].options[optIndex] = e.target.value;
                                            setNewQuiz({ ...newQuiz, questions: updated });
                                        }}
                                    />
                                ))}
                                <select
                                    value={q.correctAnswer}
                                    onChange={(e) => {
                                        const updated = [...newQuiz.questions];
                                        updated[qIndex].correctAnswer = e.target.value;
                                        setNewQuiz({ ...newQuiz, questions: updated });
                                    }}
                                >
                                    <option value="">Select Correct Answer</option>
                                    {q.options.map((opt, optIndex) => (
                                        <option key={optIndex} value={opt}>
                                            Option {optIndex + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        <button onClick={addQuestion}>Add Question</button>
                        <div className="popup-buttons">
                            <button onClick={handleAddQuiz}>Save</button>
                            <button onClick={() => setShowAddPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showEditPopup && editingQuiz && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Edit Quiz</h3>
                        <input
                            type="text"
                            value={editingQuiz.title}
                            onChange={(e) => setEditingQuiz({ ...editingQuiz, title: e.target.value })}
                        />
                        {editingQuiz.questions.map((q, qIndex) => (
                            <div key={qIndex} className="question-form">
                                <input
                                    type="text"
                                    value={q.questionText}
                                    onChange={(e) => {
                                        const updated = [...editingQuiz.questions];
                                        updated[qIndex].questionText = e.target.value;
                                        setEditingQuiz({ ...editingQuiz, questions: updated });
                                    }}
                                />
                                {q.options.map((opt, optIndex) => (
                                    <input
                                        key={optIndex}
                                        type="text"
                                        value={opt}
                                        onChange={(e) => {
                                            const updated = [...editingQuiz.questions];
                                            updated[qIndex].options[optIndex] = e.target.value;
                                            setEditingQuiz({ ...editingQuiz, questions: updated });
                                        }}
                                    />
                                ))}
                                <select
                                    value={q.correctAnswer}
                                    onChange={(e) => {
                                        const updated = [...editingQuiz.questions];
                                        updated[qIndex].correctAnswer = e.target.value;
                                        setEditingQuiz({ ...editingQuiz, questions: updated });
                                    }}
                                >
                                    <option value="">Select Correct Answer</option>
                                    {q.options.map((opt, optIndex) => (
                                        <option key={optIndex} value={opt}>
                                            Option {optIndex + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        <div className="popup-buttons">
                            <button onClick={handleEditQuiz}>Save</button>
                            <button onClick={() => setShowEditPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChapterQuizzes; 