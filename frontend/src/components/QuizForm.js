import React, { useState } from 'react';
import axios from 'axios';
import '../styles/QuizForm.css';

function QuizForm({ subject, goBack }) {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: '' }
  ]);

  if (!subject) return <p>⚠️ No subject selected. Please select a subject first.</p>;

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { questionText: '', options: ['', '', '', ''], correctAnswer: '' }
    ]);
  };

  const deleteQuestion = (qIndex) => {
    const updated = [...questions];
    updated.splice(qIndex, 1);
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  const deleteOption = (qIndex, optIndex) => {
    const updated = [...questions];
    const removed = updated[qIndex].options.splice(optIndex, 1);
    if (updated[qIndex].correctAnswer === removed[0]) {
      updated[qIndex].correctAnswer = '';
    }
    setQuestions(updated);
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

      <label>Quiz Title:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter quiz title"
      />

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="question-block">
          <h3>Question {qIndex + 1}</h3>

          <label>Question Text:</label>
          <input
            type="text"
            value={q.questionText}
            onChange={(e) => {
              const updated = [...questions];
              updated[qIndex].questionText = e.target.value;
              setQuestions(updated);
            }}
            placeholder="Enter the question"
          />

          {q.options.map((opt, optIndex) => (
            <div className="option-row" key={optIndex}>
              <label>Option {optIndex + 1}:</label>
              <input
                type="text"
                value={opt}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[qIndex].options[optIndex] = e.target.value;
                  setQuestions(updated);
                }}
              />
              <div className="option-checkbox">
                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  id={`correct-${qIndex}-${optIndex}`}
                  checked={q.correctAnswer === opt}
                  onChange={() => {
                    const updated = [...questions];
                    updated[qIndex].correctAnswer = opt;
                    setQuestions(updated);
                  }}
                  disabled={!!q.correctAnswer && q.correctAnswer !== opt}
                />
                <label className="checkbox-label" htmlFor={`correct-${qIndex}-${optIndex}`}></label>
              </div>
              <button
                onClick={() => deleteOption(qIndex, optIndex)}
                className="delete-option-btn"
              >
                🗑️
              </button>
            </div>
          ))}

          <button className="add-option-btn" onClick={() => addOption(qIndex)}>➕ Add Option</button>

          <button className="delete-question-btn" onClick={() => deleteQuestion(qIndex)}>
            ❌ Delete Question
          </button>
        </div>
      ))}

      <button className="add-btn" onClick={addQuestion}>➕ Add Question</button>
      <button className="save-btn" onClick={handleSubmit}>💾 Save Quiz</button>
      <button className="back-btn" onClick={goBack}>🔙 Back</button>
    </div>
  );
}

export default QuizForm;
