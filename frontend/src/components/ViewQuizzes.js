import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/logo.jpg';
import '../styles/viewQuizzes.css';

const ViewQuizzes = ({ subject, goBack }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [expandedQuiz, setExpandedQuiz] = useState(null);
    const [editingQuestion, setEditingQuestion] = useState(null);

    // Fetch quizzes for the selected subject
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/quizzes?subject=${subject._id}`);
                setQuizzes(response.data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };
        fetchQuizzes();
    }, [subject]);

    // Toggle quiz expansion
    const toggleQuiz = (quizId) => {
        setExpandedQuiz(expandedQuiz === quizId ? null : quizId);
    };

    // Delete a quiz
    const deleteQuiz = async (quizId) => {
        try {
            await axios.delete(`http://localhost:5001/api/quizzes/${quizId}`);
            setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
        } catch (error) {
            console.error("Error deleting quiz:", error);
        }
    };

    // Delete a question from a quiz
    const deleteQuestion = async (quizId, questionIndex) => {
        try {
            await axios.delete(`http://localhost:5001/api/quizzes/${quizId}/questions/${questionIndex}`);

            // Update the quizzes state to reflect the deletion
            const updatedQuizzes = quizzes.map((quiz) => {
                if (quiz._id === quizId) {
                    return {
                        ...quiz,
                        questions: quiz.questions.filter((_, index) => index !== questionIndex),
                    };
                }
                return quiz;
            });

            setQuizzes(updatedQuizzes);
        } catch (error) {
            console.error("Error deleting question:", error);
        }
    };

    // Open the edit question popup
    const handleEditQuestion = (quizId, questionIndex, question) => {
        setEditingQuestion({ quizId, questionIndex, question });
    };

    // Save the edited question
    const handleSaveQuestion = async (updatedQuestion) => {
        try {
            await axios.put(
                `http://localhost:5001/api/quizzes/${editingQuestion.quizId}/questions/${editingQuestion.questionIndex}`,
                updatedQuestion
            );

            // Update the quizzes state to reflect the edited question
            const updatedQuizzes = quizzes.map((quiz) => {
                if (quiz._id === editingQuestion.quizId) {
                    return {
                        ...quiz,
                        questions: quiz.questions.map((q, index) =>
                            index === editingQuestion.questionIndex ? updatedQuestion : q
                        ),
                    };
                }
                return quiz;
            });

            setQuizzes(updatedQuizzes);
            setEditingQuestion(null); // Close the edit popup
        } catch (error) {
            console.error("Error editing question:", error);
        }
    };

    return (
        <div className="view-quizzes-container">
            {/* Header with logo and back button */}
            <div className="header">
                <button onClick={goBack} className="back-button">
                    <svg xmlns="http://www.w3.org/2000/svg" className="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Subjects
                </button>
                <img src={logo} alt="Logo" className="logo" />
            </div>

            {/* Page title */}
            <h1 className="title">Quizzes for {subject.name}</h1>

            {/* Quizzes list */}
            <div className="quiz-list">
                {quizzes.length > 0 ? (
                    quizzes.map((quiz) => (
                        <div key={quiz._id} className="quiz-card">
                            {/* Quiz header with toggle arrow and delete button */}
                            <div className="quiz-header" onClick={() => toggleQuiz(quiz._id)}>
                                <h2 className="quiz-title">{quiz.title}</h2>
                                <div>
                                    <button onClick={(e) => { e.stopPropagation(); deleteQuiz(quiz._id); }} className="delete-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="delete-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`toggle-icon ${expandedQuiz === quiz._id ? 'rotate' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Quiz questions (visible if expanded) */}
                            {expandedQuiz === quiz._id && (
                                <div className="quiz-questions">
                                    {quiz.questions.map((question, qIndex) => (
                                        <div key={qIndex} className="question-card">
                                            <div className="question-header">
                                                <p className="question-text">{question.questionText}</p>
                                                <div>
                                                    <button onClick={() => deleteQuestion(quiz._id, qIndex)} className="delete-button">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="delete-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => handleEditQuestion(quiz._id, qIndex, question)} className="edit-button">
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="options">
                                                {question.options.map((option, optIndex) => (
                                                    <div key={optIndex} className={`option ${option === question.correctAnswer ? 'correct' : ''}`}>
                                                        {option}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="no-quizzes">No quizzes available for this subject.</p>
                )}
            </div>

            {/* Edit Question Popup */}
            {editingQuestion && (
                <EditQuestionPopup
                    question={editingQuestion.question}
                    onSave={handleSaveQuestion}
                    onClose={() => setEditingQuestion(null)}
                />
            )}
        </div>
    );
};

// Edit Question Popup Component
const EditQuestionPopup = ({ question, onSave, onClose }) => {
    const [editedQuestion, setEditedQuestion] = useState(question);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedQuestion({ ...editedQuestion, [name]: value });
    };

    // Handle option changes
    const handleOptionChange = (index, value) => {
        const newOptions = [...editedQuestion.options];
        newOptions[index] = value;
        setEditedQuestion({ ...editedQuestion, options: newOptions });
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Edit Question</h2>
                <input
                    type="text"
                    name="questionText"
                    value={editedQuestion.questionText}
                    onChange={handleChange}
                    placeholder="Question Text"
                />
                <div>
                    {editedQuestion.options.map((option, index) => (
                        <input
                            key={index}
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                        />
                    ))}
                </div>
                <button onClick={() => onSave(editedQuestion)}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default ViewQuizzes;