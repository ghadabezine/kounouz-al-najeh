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

  const generateQuiz = () => {
    setLoading(true);
    setTimeout(() => {
      setQuiz([
        {
          question: "What is React Native?",
          answer: "A framework for building mobile apps using React.",
        },
        {
          question: "What is State in React?",
          answer:
            "State is a built-in object that holds data about a component.",
        },
      ]);
      setLoading(false);
    }, 2000); // Simulating AI quiz generation
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI-Generated Quiz</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : quiz ? (
        quiz.map((q, index) => (
          <View key={index} style={styles.quizCard}>
            <Text style={styles.question}>{q.question}</Text>
            <Text style={styles.answer}>{q.answer}</Text>
          </View>
        ))
      ) : (
        <TouchableOpacity onPress={generateQuiz} style={styles.generateButton}>
          <Text style={styles.generateButtonText}>Generate Quiz</Text>
        </TouchableOpacity>
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
    color: "#333",
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
    marginBottom: 5,
  },
  answer: {
    fontSize: 14,
    color: "#555",
  },
  generateButton: {
    backgroundColor: "#6200EE",
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
});
