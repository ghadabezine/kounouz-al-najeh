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

export default function GenerateQuizScreen({ route, navigation }) {
  const { chapterId, quiz: passedQuiz } = route.params;

  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (passedQuiz) {
        setQuiz(passedQuiz);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://192.168.100.7:5002/generate-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chapterId }),
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
  }, [chapterId]);

  const handleOptionSelect = (option) => {
    if (selectedOption) return;

    const letter = option.split(".")[0].trim();
    const isCorrect = letter === quiz[currentIndex].answer;

    const updatedQuiz = [...quiz];
    updatedQuiz[currentIndex].userAnswer = letter;

    setQuiz(updatedQuiz);
    if (isCorrect) setScore(score + 1);
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      navigation.navigate("QuizResultScreen", {
        quiz,
        score,
      });
    }
  };

  const currentQuestion = quiz[currentIndex];

  const getOptionStyle = (opt) => {
    const selected = selectedOption === opt;
    const letter = opt.split(".")[0].trim();
    const isCorrect = letter === currentQuestion.answer;

    if (!selectedOption) {
      return selected ? [styles.option, styles.selectedOption] : styles.option;
    }

    if (selected && isCorrect) return [styles.option, styles.correctAnswer];
    if (selected && !isCorrect) return [styles.option, styles.wrongAnswer];
    if (!selected && isCorrect) return [styles.option, styles.correctAnswer];

    return styles.option;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6C5B7B" />
      ) : currentQuestion ? (
        <>
          <Text style={styles.question}>
            {currentIndex + 1}. {currentQuestion.question}
          </Text>

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
            <Text style={styles.nextButtonText}>
              {currentIndex === quiz.length - 1 ? "Finish" : "Next"}
            </Text>
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
  selectedOption: {
    backgroundColor: "#D1C4E9", // 🟣 Purple
    borderColor: "#673AB7",
  },
  correctAnswer: {
    backgroundColor: "#C8E6C9", // ✅ Green
    borderColor: "#4CAF50",
  },
  wrongAnswer: {
    backgroundColor: "#FFCDD2", // ❌ Red
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
