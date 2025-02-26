import React, { useState, useEffect } from 'react';
import axios from 'axios';

import '../styles/viewQuizzes.css'; // Import the external CSS file

const ViewQuizzes = ({ subject, goBack }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [expandedQuiz, setExpandedQuiz] = useState(null);

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

    const toggleQuiz = (quizId) => {
        setExpandedQuiz(expandedQuiz === quizId ? null : quizId);
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
             x
            </div>

            {/* Page title */}
            <h1 className="title">Quizzes for {subject.name}</h1>

            {/* Quizzes list */}
            <div className="quiz-list">
                {quizzes.length > 0 ? (
                    quizzes.map((quiz) => (
                        <div key={quiz._id} className="quiz-card">
                            {/* Quiz header with toggle arrow */}
                            <div className="quiz-header" onClick={() => toggleQuiz(quiz._id)}>
                                <h2 className="quiz-title">{quiz.title}</h2>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`toggle-icon ${expandedQuiz === quiz._id ? 'rotate' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {/* Quiz questions (visible if expanded) */}
                            {expandedQuiz === quiz._id && (
                                <div className="quiz-questions">
                                    {quiz.questions.map((question, qIndex) => (
                                        <div key={qIndex} className="question-card">
                                            <p className="question-text">{question.questionText}</p>
                                            <div className="options">
                                                {question.options.map((option, optIndex) => (
                                                    <div
                                                        key={optIndex}
                                                        className={`option ${option === question.correctAnswer ? 'correct' : ''}`}
                                                    >
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
        </div>
    );
};

export default ViewQuizzes;
