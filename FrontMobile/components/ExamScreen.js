import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";

export default function ExamScreen() {
  const [loading, setLoading] = useState(false);
  const [examQuestions, setExamQuestions] = useState([]);
  const [numQuestions, setNumQuestions] = useState("");

  const generateExam = () => {
    setLoading(true);
    setTimeout(() => {
      const generatedQuestions = Array.from(
        { length: parseInt(numQuestions) || 5 },
        (_, index) => ({
          question: `Question ${
            index + 1
          }: What is something important about the course?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A",
        })
      );
      setExamQuestions(generatedQuestions);
      setLoading(false);
    }, 2000); // Simulating exam generation
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>Generate Exam</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter number of questions"
          keyboardType="numeric"
          value={numQuestions}
          onChangeText={setNumQuestions}
        />

        <TouchableOpacity style={styles.button} onPress={generateExam}>
          <Text style={styles.buttonText}>Generate Exam</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        {examQuestions.length > 0 && !loading && (
          <View style={styles.examContainer}>
            <Text style={styles.examTitle}>Generated Exam:</Text>
            {examQuestions.map((q, index) => (
              <View key={index} style={styles.questionContainer}>
                <Text style={styles.question}>{q.question}</Text>
                {q.options.map((option, idx) => (
                  <TouchableOpacity key={idx} style={styles.optionButton}>
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  examContainer: {
    marginTop: 20,
  },
  examTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  questionContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});
