import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";

export default function GenerateQuizScreen({ route }) {
  const { subjectId } = route.params;

  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch("http://192.168.54.241:5001/api/quizzes/generate-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subjectId }),
        });

        if (!response.ok) throw new Error("Failed to generate quiz.");
        const data = await response.json();
        if (!data.quiz || !Array.isArray(data.quiz) || data.quiz.length === 0) {
          throw new Error("No questions received.");
        }
        setQuiz(data.quiz);
      } catch (error) {
        console.error("❌ Error fetching quiz:", error);
        Alert.alert("Error", error.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [subjectId]);

  const handleNext = () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      Alert.alert("🎉 Quiz Complete", "You've completed the quiz!");
    }
  };

  const handleOptionSelect = (option) => {
    if (!selectedOption) setSelectedOption(option);
  };

  const currentQuestion = quiz[currentIndex];

  const getOptionText = (opt) => {
    // Extracts just "mode" from "D. mode"
    return opt.split(". ")[1]?.trim();
  };

  const getOptionStyle = (opt) => {
    const actualText = getOptionText(opt);
    const isCorrect = actualText === currentQuestion.answer;
    const isSelected = opt === selectedOption;

    if (!selectedOption) return styles.option;
    if (isCorrect) return [styles.option, styles.correctAnswer];
    if (isSelected && !isCorrect) return [styles.option, styles.wrongAnswer];

    return styles.option;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6C5B7B" />
      ) : currentQuestion ? (
        <>
          <Text style={styles.question}>{currentQuestion.question}</Text>

          {currentQuestion.options.map((opt, index) => (
            <TouchableOpacity
              key={index}
              style={getOptionStyle(opt)}
              onPress={() => handleOptionSelect(opt)}
              disabled={selectedOption !== null}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.errorText}>No questions available.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  question: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "600",
    color: "#333",
  },
  option: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  correctAnswer: {
    backgroundColor: "#C8E6C9", // light green
    borderColor: "#4CAF50",
  },
  wrongAnswer: {
    backgroundColor: "#FFCDD2", // light red
    borderColor: "#F44336",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: "#6C5B7B",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    color: "red",
  },
});
``