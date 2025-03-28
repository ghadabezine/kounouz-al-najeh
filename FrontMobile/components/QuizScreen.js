import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

export default function QuizScreen() {
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);

  const generateQuiz = () => {
    setLoading(true);
    setTimeout(() => {
      const generatedQuiz = [
        {
          question: "What is React Native?",
          options: [
            "A framework for building mobile apps using Java",
            "A framework for building mobile apps using React.",
            "A framework for building mobile apps using Vue.",
            "A tool for managing state in apps.",
          ],
          correctAnswer: "A framework for building mobile apps using React.",
        },
        {
          question: "What is State in React?",
          options: [
            "A built-in object that holds data about a component.",
            "A tool to make HTTP requests.",
            "A CSS property used for styling.",
            "A method to handle events.",
          ],
          correctAnswer: "A built-in object that holds data about a component.",
        },
      ];
      setQuiz(generatedQuiz);
      setLoading(false);
    }, 2000); // Simulating AI quiz generation
  };

  const handleAnswerSelection = (questionIndex, selectedOption) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: selectedOption,
    }));
  };

  const submitQuiz = () => {
    let totalScore = 0;
    quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        totalScore += 1;
      }
    });
    setScore(totalScore);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI-Generated Quiz</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#F9A826" style={styles.loader} />
      ) : quiz ? (
        <View>
          {quiz.map((q, index) => (
            <View key={index} style={styles.quizCard}>
              <Text style={styles.question}>{q.question}</Text>
              {q.options.map((option, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.optionButton,
                    selectedAnswers[index] === option && styles.selectedOption,
                  ]}
                  onPress={() => handleAnswerSelection(index, option)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          <TouchableOpacity style={styles.submitButton} onPress={submitQuiz}>
            <Text style={styles.submitButtonText}>Submit Quiz</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={generateQuiz} style={styles.generateButton}>
          <Text style={styles.generateButtonText}>Generate Quiz</Text>
        </TouchableOpacity>
      )}

      {score !== null && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            You scored {score} out of {quiz.length}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6C5B7B", // Soft purple
  },
  loader: {
    marginVertical: 20,
  },
  quizCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#E1D6B1", // Light golden yellow to highlight selected option
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  generateButton: {
    backgroundColor: "#F9A826", // Golden yellow
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#6C5B7B", // Soft purple
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
