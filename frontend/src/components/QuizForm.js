import { useState } from 'react';
import axios from 'axios';
import React from 'react';
import '../styles/QuizForm.css'; // ✅ Import the CSS

function QuizForm({ subject, goBack }) {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([
        { questionText: '', options: ['', '', '', ''], correctAnswer: '' }
    ]);

    if (!subject) return <p>⚠️ No subject selected. Please select a subject first.</p>;

    const addQuestion = () => {
        setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:5001/api/quizzes', {
                title,
                subject: subject._id,
                questions,
            });
            alert(`✅ Quiz Created: ${response.data._id}`);
            goBack();
        } catch (err) {
            console.error("❌ Error creating quiz:", err.response?.data || err);
            alert('❌ Error creating quiz.');
        }
    };

    return (
        <div className="quiz-form">
            <h1>Create Quiz for {subject.name}</h1>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Quiz Title"
            />

            {questions.map((q, qIndex) => (
                <div key={qIndex} className="question-block">
                    <h3>Question {qIndex + 1}</h3>
                    <input
                        type="text"
                        value={q.questionText}
                        onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[qIndex].questionText = e.target.value;
                            setQuestions(updatedQuestions);
                        }}
                        placeholder="Enter the question"
                    />

                    {q.options.map((opt, optIndex) => (
                        <input
                            key={optIndex}
                            type="text"
                            value={opt}
                            onChange={(e) => {
                                const updatedQuestions = [...questions];
                                updatedQuestions[qIndex].options[optIndex] = e.target.value;
                                setQuestions(updatedQuestions);
                            }}
                            placeholder={`Option ${optIndex + 1}`}
                        />
                    ))}

                    <select
                        value={q.correctAnswer}
                        onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[qIndex].correctAnswer = e.target.value;
                            setQuestions(updatedQuestions);
                        }}
                    >
                        <option value="">Select correct answer</option>
                        {q.options.map((opt, idx) => (
                            <option key={idx} value={opt}>
                                {opt || `Option ${idx + 1}`}
                            </option>
                        ))}
                    </select>
                </div>
            ))}

            <button className="add-btn" onClick={addQuestion}>Add Question</button>
            <button className="save-btn" onClick={handleSubmit}>Save Quiz</button>
            <button className="back-btn" onClick={goBack}>Back</button>
        </div>
    );
}

export default QuizForm;
