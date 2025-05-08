import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";

function TakeQuiz() {
  const [quizzes, setQuizzes] = useState([]); // All available quizzes
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Selected quiz object
  const [answers, setAnswers] = useState({});

  // Fetch all quizzes on component mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:5005/quizzes"); // Ensure the endpoint is /quizzes
        if (response.data && Array.isArray(response.data)) {
          setQuizzes(response.data);
        } else {
          alert("No quizzes found or invalid response format.");
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        alert("Failed to fetch quizzes. Check the server and endpoint.");
      }
    };
    fetchQuizzes();
  }, []);

  const handleQuizSelect = async (e) => {
    const quizId = e.target.value;
    try {
      const response = await axios.get(`http://localhost:5005/quiz/${quizId}`); // Fetch the selected quiz details
      setSelectedQuiz(response.data);
      setAnswers({}); // Reset answers when a new quiz is selected
    } catch (error) {
      console.error("Error fetching selected quiz:", error);
      alert("Failed to load the selected quiz.");
    }
  };

  const handleAnswerChange = (qIndex, value) => {
    setAnswers({ ...answers, [qIndex]: value });
  };

  const handleSubmit = () => {
    if (!selectedQuiz) return;
    const score = selectedQuiz.questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.correctAnswer ? 1 : 0),
      0
    );
    alert(`Score: ${score}/${selectedQuiz.questions.length}`);
  };

  return React.createElement(
    "div",
    { className: "p-4" },
    React.createElement("h1", { className: "text-2xl mb-4" }, "Take a Quiz"),

    quizzes.length > 0
      ? React.createElement(
          "select",
          {
            onChange: handleQuizSelect,
            defaultValue: "",
            className: "p-2 border mb-4 w-full",
          },
          React.createElement(
            "option",
            { value: "", disabled: true },
            "Select a quiz"
          ),
          quizzes.map((quiz) =>
            React.createElement(
              "option",
              { key: quiz._id, value: quiz._id },
              quiz.title
            )
          )
        )
      : React.createElement("p", null, "No quizzes available."),

    selectedQuiz &&
      React.createElement(
        "div",
        null,
        React.createElement(
          "h2",
          { className: "text-xl mb-2" },
          selectedQuiz.title
        ),
        selectedQuiz.questions.map((q, qIndex) =>
          React.createElement(
            "div",
            { key: qIndex, className: "my-4" },
            React.createElement(
              "p",
              { className: "font-semibold" },
              q.questionText
            ),
            q.options.map((opt, optIndex) =>
              React.createElement(
                "label",
                { key: optIndex, className: "block" },
                React.createElement("input", {
                  type: "radio",
                  name: `question-${qIndex}`,
                  value: opt,
                  checked: answers[qIndex] === opt,
                  onChange: (e) => handleAnswerChange(qIndex, e.target.value),
                }),
                ` ${opt}`
              )
            )
          )
        ),

        React.createElement(
          "button",
          {
            onClick: handleSubmit,
            className: "bg-blue-600 text-white p-2 rounded mt-4",
          },
          "Submit Quiz"
        )
      )
  );
}

export default TakeQuiz;
