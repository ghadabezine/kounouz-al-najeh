import { useState } from 'react';
import axios from 'axios';
import React from 'react';

function QuizForm({ subject, goBack }) {
    // ✅ Move all hooks to the top
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([
        { questionText: '', options: ['', '', '', ''], correctAnswer: '' }
    ]);

    // ✅ Early return after hooks are defined
    if (!subject) {
        return <p>⚠️ No subject selected. Please select a subject first.</p>;
    }

    const addQuestion = () => {
        setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
    };

    const handleSubmit = async () => {
        try {
            console.log("✅ Sending data:", { title, subject: subject._id, questions });

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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Quiz Title"
            />
            {questions.map((q, qIndex) => (
                <div key={qIndex}>
                    <input
                        value={q.questionText}
                        onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[qIndex].questionText = e.target.value;
                            setQuestions(updatedQuestions);
                        }}
                        placeholder="Question"
                    />
                    {q.options.map((opt, optIndex) => (
                        <input
                            key={optIndex}
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
                        {q.options.map((opt, idx) => (
                            <option key={idx} value={opt}>{opt || `Option ${idx + 1}`}</option>
                        ))}
                    </select>
                </div>
            ))}
            <button onClick={addQuestion}>Add Question</button>
            <button onClick={handleSubmit}>Save Quiz</button>
            <button onClick={goBack}>Back</button>
        </div>
    );
}

export default QuizForm;
