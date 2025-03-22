import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";

export default function QuizDetailsScreen({ route }) {
  const { quizId } = route.params;
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds timer

  useEffect(() => {
    // Fetch quiz details
    axios
      .get(`http://localhost:5001/api/quiz/${quizId}`)
      .then((response) => {
        setQuiz(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quiz:", error);
      });

    // Timer
    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timerInterval); // Clear timer when component unmounts
  }, [quizId]);

  const handleAnswerChange = (questionIndex, answer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    axios
      .post("http://localhost:5001/api/quiz/submit", { quizId, answers })
      .then((response) => {
        Alert.alert(
          `Your score: ${response.data.score}/${response.data.total}`
        );
      })
      .catch((error) => {
        console.error("Error submitting quiz:", error);
      });
  };

  if (!quiz) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{quiz.title}</Text>
      <Text style={styles.timer}>Time Left: {timeLeft}s</Text>

      {quiz.questions.map((q, index) => (
        <View key={q._id} style={styles.questionContainer}>
          <Text style={styles.questionText}>{q.questionText}</Text>
          {q.options.map((option, i) => (
            <TouchableOpacity
              key={i}
              style={styles.optionButton}
              onPress={() => handleAnswerChange(index, option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <Button title="Submit Quiz" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6C5B7B", // Soft purple
  },
  timer: {
    fontSize: 18,
    color: "#F9A826", // Golden yellow
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  optionButton: {
    backgroundColor: "#F9A826",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#fff",
  },
});
