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
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Track selected answers
  const [score, setScore] = useState(null); // Track score

  const generateExam = () => {
    setLoading(true);
    setScore(null); // Reset score when new exam is generated
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

  const handleAnswerSelection = (questionIndex, selectedOption) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: selectedOption,
    }));
  };

  const submitExam = () => {
    let totalScore = 0;
    examQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        totalScore += 1;
      }
    });
    setScore(totalScore);
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

        {loading && <ActivityIndicator size="large" color="#F9A826" />}

        {examQuestions.length > 0 && !loading && (
          <View style={styles.examContainer}>
            <Text style={styles.examTitle}>Generated Exam:</Text>
            {examQuestions.map((q, index) => (
              <View key={index} style={styles.questionContainer}>
                <Text style={styles.question}>{q.question}</Text>
                {q.options.map((option, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.optionButton,
                      selectedAnswers[index] === option &&
                        styles.selectedOption,
                    ]}
                    onPress={() => handleAnswerSelection(index, option)}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
            <TouchableOpacity style={styles.button} onPress={submitExam}>
              <Text style={styles.buttonText}>Submit Exam</Text>
            </TouchableOpacity>
          </View>
        )}

        {score !== null && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              You scored {score} out of {examQuestions.length}
            </Text>
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
    color: "#6C5B7B", // Soft purple
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
    backgroundColor: "#F9A826", // Golden yellow
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
    color: "#6C5B7B", // Soft purple
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
    color: "#333",
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
    fontSize: 16,
    color: "#333",
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
