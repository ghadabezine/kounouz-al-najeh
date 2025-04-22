import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function QuizResultScreen({ route }) {
  const { quiz, score } = route.params;
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Quiz Results</Text>

      {quiz.map((q, idx) => (
        <View key={idx} style={styles.block}>
          <Text style={styles.question}>
            {idx + 1}. {q.question}
          </Text>

          {q.options.map((opt, i) => {
            const letter = opt.split(".")[0].trim();
            const isCorrect = letter === q.answer;
            const isUserWrong = q.userAnswer === letter && !isCorrect;

            return (
              <Text
                key={i}
                style={[
                  styles.option,
                  isCorrect && styles.correct,
                  isUserWrong && styles.wrong,
                ]}
              >
                {opt}
              </Text>
            );
          })}
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.scoreText}>
          Final Score: {score} / {quiz.length}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.navigate("GenerateQuizScreen", { quiz })}
        >
          <Text style={styles.retryText}>Reattempt Quiz</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  block: {
    marginBottom: 25,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  option: {
    fontSize: 15,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "#eee",
    marginBottom: 6,
  },
  correct: {
    backgroundColor: "#C8E6C9", // ✅ Green
    color: "#2E7D32",
    fontWeight: "bold",
  },
  wrong: {
    backgroundColor: "#FFCDD2", // ❌ Red
    color: "#C62828",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6C5B7B",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#6C5B7B",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
