<<<<<<< HEAD
import React, { useState } from "react";
import axios from "axios";
import "../styles/QuizForm.css";

function QuizForm({ chapter, goBack }) {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswerIndex: null },
  ]);

  if (!chapter)
    return <p>⚠️ No chapter selected. Please select a chapter first.</p>;

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { questionText: "", options: ["", "", "", ""], correctAnswerIndex: null },
    ]);
  };

  const deleteQuestion = (qIndex) => {
    const updated = [...questions];
    updated.splice(qIndex, 1);
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const deleteOption = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(optIndex, 1);

    // If correct option was deleted, reset it
    if (updated[qIndex].correctAnswerIndex === optIndex) {
      updated[qIndex].correctAnswerIndex = null;
    } else if (updated[qIndex].correctAnswerIndex > optIndex) {
      updated[qIndex].correctAnswerIndex -= 1; // shift index
    }

    setQuestions(updated);
  };

  const handleSubmit = async () => {
    // Basic validation
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        alert(`⚠️ Question ${i + 1} is missing text`);
        return;
      }
      if (q.options.length < 2 || q.options.some((opt) => !opt.trim())) {
        alert(`⚠️ Question ${i + 1} has invalid options`);
        return;
      }
      if (
        q.correctAnswerIndex === null ||
        !q.options[q.correctAnswerIndex] ||
        !q.options[q.correctAnswerIndex].trim()
      ) {
        alert(`⚠️ Question ${i + 1} has no valid correct answer selected`);
        return;
      }
    }

    try {
      const formattedQuestions = questions.map((q) => ({
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.options[q.correctAnswerIndex],
      }));

      // FIX: Use the proper URL structure matching your backend routes
      const response = await axios.post(
        `http://localhost:5005/api/quizzes/${chapter._id}/quizzes`,
        {
          title,
          questions: formattedQuestions,
          // Chapter ID is now in the URL, not needed in body
        }
      );

      alert(`✅ Quiz Created: ${response.data._id}`);
      goBack();
    } catch (err) {
      console.error("❌ Error creating quiz:", err);
      console.error("📋 Full error response:", err?.response?.data);
      alert("❌ Error creating quiz. Check console for details.");
    }
  };

  return (
    <div className="quiz-form">
      <h1>Create Quiz for {chapter.name}</h1>

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
=======
import { useState } from "react";
import axios from "axios";
import React from "react";
import "../styles/QuizForm.css"; // ✅ Import the CSS

function QuizForm({ subject, goBack }) {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);

  if (!subject)
    return <p>⚠️ No subject selected. Please select a subject first.</p>;

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5002/api/quizzes", {
        title,
        subject: subject._id,
        questions,
      });
      alert(`✅ Quiz Created: ${response.data._id}`);
      goBack();
    } catch (err) {
      console.error("❌ Error creating quiz:", err.response?.data || err);
      alert("❌ Error creating quiz.");
    }
  };

  return (
    <div className="quiz-form">
      <h1>Create Quiz for {subject.name}</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
 HEAD
        placeholder="Quiz Title"

        placeholder="Enter quiz title"
      />

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="question-block">
          <h3>Question {qIndex + 1}</h3>
 HEAD


          <label>Question Text:</label>
          <input
            type="text"
            value={q.questionText}
            onChange={(e) => {
 HEAD
              const updatedQuestions = [...questions];
              updatedQuestions[qIndex].questionText = e.target.value;
              setQuestions(updatedQuestions);

>>>>>>> f603a2515574303b1ebbf32af460cfd4a61be625
              const updated = [...questions];
              updated[qIndex].questionText = e.target.value;
              setQuestions(updated);
            }}
            placeholder="Enter the question"
          />

          {q.options.map((opt, optIndex) => (
<<<<<<< HEAD
=======
 HEAD
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

      <button className="add-btn" onClick={addQuestion}>
        Add Question
      </button>
      <button className="save-btn" onClick={handleSubmit}>
        Save Quiz
      </button>
      <button className="back-btn" onClick={goBack}>
        Back
      </button>

>>>>>>> f603a2515574303b1ebbf32af460cfd4a61be625
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
<<<<<<< HEAD
                  checked={q.correctAnswerIndex === optIndex}
                  onChange={() => {
                    const updated = [...questions];
                    updated[qIndex].correctAnswerIndex = optIndex;
                    setQuestions(updated);
                  }}
                />
                <label
                  className="checkbox-label"
                  htmlFor={`correct-${qIndex}-${optIndex}`}
                ></label>
=======
                  checked={q.correctAnswer === opt}
                  onChange={() => {
                    const updated = [...questions];
                    updated[qIndex].correctAnswer = opt;
                    setQuestions(updated);
                  }}
                  disabled={!!q.correctAnswer && q.correctAnswer !== opt}
                />
                <label className="checkbox-label" htmlFor={`correct-${qIndex}-${optIndex}`}></label>
>>>>>>> f603a2515574303b1ebbf32af460cfd4a61be625
              </div>
              <button
                onClick={() => deleteOption(qIndex, optIndex)}
                className="delete-option-btn"
              >
                🗑️
              </button>
            </div>
          ))}

<<<<<<< HEAD
          <button className="add-option-btn" onClick={() => addOption(qIndex)}>
            ➕ Add Option
          </button>
          <button
            className="delete-question-btn"
            onClick={() => deleteQuestion(qIndex)}
          >
=======
          <button className="add-option-btn" onClick={() => addOption(qIndex)}>➕ Add Option</button>

          <button className="delete-question-btn" onClick={() => deleteQuestion(qIndex)}>
>>>>>>> f603a2515574303b1ebbf32af460cfd4a61be625
            ❌ Delete Question
          </button>
        </div>
      ))}

<<<<<<< HEAD
      <button className="add-btn" onClick={addQuestion}>
        ➕ Add Question
      </button>
      <button className="save-btn" onClick={handleSubmit}>
        💾 Save Quiz
      </button>
      <button className="back-btn" onClick={goBack}>
        🔙 Back
      </button>
=======
      <button className="add-btn" onClick={addQuestion}>➕ Add Question</button>
      <button className="save-btn" onClick={handleSubmit}>💾 Save Quiz</button>
      <button className="back-btn" onClick={goBack}>🔙 Back</button>
>>>>>>> f603a2515574303b1ebbf32af460cfd4a61be625
    </div>
  );
}

export default QuizForm;
