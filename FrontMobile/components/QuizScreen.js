import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native"; // To navigate to quiz details

export default function QuizScreen() {
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const navigation = useNavigation(); // React Navigation Hook

  useEffect(() => {
    // Fetch quizzes from the backend
    axios
      .get("http://localhost:5001/api/quizzes")
      .then((response) => {
        setQuizzes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
        setLoading(false);
      });
  }, []);

  const handleQuizSelect = (quizId) => {
    navigation.navigate("QuizDetails", { quizId }); // Navigate to the QuizDetails screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Quizzes</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#F9A826" style={styles.loader} />
      ) : quizzes.length > 0 ? (
        quizzes.map((quiz) => (
          <TouchableOpacity
            key={quiz._id}
            onPress={() => handleQuizSelect(quiz._id)}
            style={styles.quizCard}
          >
            <Text style={styles.quizTitle}>{quiz.title}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No quizzes available</Text>
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
  quizTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
