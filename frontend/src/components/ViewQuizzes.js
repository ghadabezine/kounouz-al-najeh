import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/logo.jpg";
import "../styles/viewQuizzes.css";

const ViewQuizzes = ({ chapter, goBack }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [expandedQuiz, setExpandedQuiz] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingQuiz, setEditingQuiz] = useState(null);
  // Change from subject-based to chapter-based fetching
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5005/api/quizzes/${chapter._id}/quizzes`
        );
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
    fetchQuizzes();
  }, [chapter]); // Changed from [subject]

  // Toggle quiz expansion
  const toggleQuiz = (quizId) => {
    setExpandedQuiz(expandedQuiz === quizId ? null : quizId);
  };

  // Delete a quiz
  const deleteQuiz = async (quizId) => {
    try {
      await axios.delete(`http://localhost:5005/api/quizzes/quizzes/${quizId}`);
      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  // Delete a question from a quiz
  const deleteQuestion = async (quizId, questionIndex) => {
    try {
      await axios.delete(
        `http://localhost:5005/api/quizzes/quizzes/${quizId}/questions/${questionIndex}`
      );

      // Update the quizzes state to reflect the deletion
      const updatedQuizzes = quizzes.map((quiz) => {
        if (quiz._id === quizId) {
          return {
            ...quiz,
            questions: quiz.questions.filter(
              (_, index) => index !== questionIndex
            ),
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
      // Send the update request to the backend
      await axios.put(
        `http://localhost:5005/api/quizzes/quizzes/${editingQuestion.quizId}/questions/${editingQuestion.questionIndex}`,
        {
          questionText: updatedQuestion.questionText,
          options: updatedQuestion.options,
          correctAnswer: updatedQuestion.correctAnswer,
        }
      );

      // Fetch the updated quiz data
      const response = await axios.get(
        `http://localhost:5005/api/quizzes/${chapter._id}/quizzes`
      );

      // Update the quizzes state with fresh data
      setQuizzes(response.data);
      setEditingQuestion(null); // Close the edit popup
    } catch (error) {
      console.error("Error editing question:", error);
    }
  };

  // Open the edit quiz popup
  const handleEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
  };

  // Save the edited quiz
  const handleSaveQuiz = async (updatedQuiz) => {
    try {
      await axios.put(
        `http://localhost:5005/api/quizzes/quizzes/${updatedQuiz._id}`,
        {
          title: updatedQuiz.title,
          questions: updatedQuiz.questions,
        }
      );

      // Fetch the updated quiz data
      const response = await axios.get(
        `http://localhost:5005/api/quizzes/${chapter._id}/quizzes`
      );

      // Update the quizzes state with fresh data
      setQuizzes(response.data);
      setEditingQuiz(null); // Close the edit popup
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  };

  return (
    <div className="view-quizzes-container">
      {/* Header with logo and back button */}
      <div className="header">
        <button onClick={goBack} className="back-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="back-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Subjects
        </button>
        <img src={logo} alt="Logo" className="logo" />
      </div>

      {/* Page title */}
      <h1 className="title">Quizzes for {chapter.name}</h1>

      {/* Quizzes list */}
      <div className="quiz-list">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div key={quiz._id} className="quiz-card">
              {/* Quiz header with toggle arrow, delete button, and edit button */}
              <div className="quiz-header" onClick={() => toggleQuiz(quiz._id)}>
                <h2 className="quiz-title">{quiz.title}</h2>
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQuiz(quiz._id);
                    }}
                    className="delete-button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="delete-icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditQuiz(quiz);
                    }}
                    className="edit-button"
                  >
                    Edit Quiz
                  </button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`toggle-icon ${
                      expandedQuiz === quiz._id ? "rotate" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
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
                          <button
                            onClick={() => deleteQuestion(quiz._id, qIndex)}
                            className="delete-button"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="delete-icon"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              handleEditQuestion(quiz._id, qIndex, question)
                            }
                            className="edit-button"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                      <div className="options">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`option ${
                              option === question.correctAnswer ? "correct" : ""
                            }`}
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

      {/* Edit Question Popup */}
      {editingQuestion && (
        <EditQuestionPopup
          question={editingQuestion.question}
          onSave={handleSaveQuestion}
          onClose={() => setEditingQuestion(null)}
        />
      )}

      {/* Edit Quiz Popup */}
      {editingQuiz && (
        <EditQuizPopup
          quiz={editingQuiz}
          onSave={handleSaveQuiz}
          onClose={() => setEditingQuiz(null)}
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
        <select
          value={editedQuestion.correctAnswer}
          onChange={(e) => {
            setEditedQuestion({
              ...editedQuestion,
              correctAnswer: e.target.value,
            });
          }}
        >
          {editedQuestion.options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button onClick={() => onSave(editedQuestion)}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

// Edit Quiz Popup Component
const EditQuizPopup = ({ quiz, onSave, onClose }) => {
  const [editedQuiz, setEditedQuiz] = useState(quiz);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedQuiz({ ...editedQuiz, [name]: value });
  };

  // Handle adding a new question
  const handleAddQuestion = () => {
    setEditedQuiz({
      ...editedQuiz,
      questions: [
        ...editedQuiz.questions,
        { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
      ],
    });
  };

  // Handle saving the edited quiz
  const handleSave = () => {
    onSave(editedQuiz);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Edit Quiz</h2>
        <input
          type="text"
          name="title"
          value={editedQuiz.title}
          onChange={handleChange}
          placeholder="Enter Quiz Title"
        />
        <div>
          {editedQuiz.questions.map((question, qIndex) => (
            <div key={qIndex} className="question-card">
              <input
                type="text"
                value={question.questionText}
                onChange={(e) => {
                  const newQuestions = [...editedQuiz.questions];
                  newQuestions[qIndex].questionText = e.target.value;
                  setEditedQuiz({ ...editedQuiz, questions: newQuestions });
                }}
                placeholder="Enter your question here"
              />
              <div>
                {question.options.map((option, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newQuestions = [...editedQuiz.questions];
                      newQuestions[qIndex].options[optIndex] = e.target.value;
                      setEditedQuiz({ ...editedQuiz, questions: newQuestions });
                    }}
                    placeholder={`Enter option ${optIndex + 1}`}
                  />
                ))}
              </div>
              <select
                value={question.correctAnswer}
                onChange={(e) => {
                  const newQuestions = [...editedQuiz.questions];
                  newQuestions[qIndex].correctAnswer = e.target.value;
                  setEditedQuiz({ ...editedQuiz, questions: newQuestions });
                }}
              >
                {question.options.map((option, optIndex) => (
                  <option key={optIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <button onClick={handleAddQuestion}>Add Question</button>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ViewQuizzes;
