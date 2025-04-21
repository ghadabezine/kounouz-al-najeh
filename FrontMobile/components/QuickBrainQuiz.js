import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

const quizData = [
  {
    question: "Which number comes next in the sequence: 2, 4, 8, 16, ?",
    options: ["18", "24", "32", "20"],
    answer: "32",
  },
  {
    question: "What is the capital of France?",
    options: ["Rome", "Paris", "Madrid", "Berlin"],
    answer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Jupiter", "Mars", "Venus"],
    answer: "Mars",
  },
];

export default function QuickBrainQuiz({ navigation }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(10);
  const progress = useRef(new Animated.Value(0)); // For progress bar

  const handleSelect = useCallback(
    (option) => {
      setSelected(option);
      if (option === quizData[currentQ].answer)
        setScore((prevScore) => prevScore + 1);
      Animated.timing(progress.current, {
        toValue: (currentQ + 1) / quizData.length,
        duration: 500,
        useNativeDriver: false,
      }).start();
      setTimeout(() => handleNext(), 500);
    },
    [currentQ]
  );

  const handleNext = useCallback(() => {
    if (currentQ + 1 < quizData.length) {
      setCurrentQ((prevQ) => prevQ + 1);
      setSelected(null);
      setTime(10);
    } else {
      navigation.navigate("QuizResult", { score });
    }
  }, [currentQ, score, navigation]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (time > 0) setTime((prevTime) => prevTime - 1);
      else handleNext();
    }, 1000);
    return () => clearInterval(timer);
  }, [time, handleNext]);

  return (
    <View style={styles.container}>
      {/* Timer */}
      <Text style={styles.timer}>⏰ {time}s</Text>

      {/* Progress Bar */}
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: progress.current.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />

      {/* Question */}
      <Text style={styles.question}>{quizData[currentQ].question}</Text>

      {/* Answer Options */}
      {quizData[currentQ].options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.option,
            selected === option && { backgroundColor: "#4CAF50" }, // Correct answer
            selected && selected !== option && { backgroundColor: "#F44336" }, // Incorrect answer
          ]}
          onPress={() => handleSelect(option)}
          disabled={!!selected}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D5E8D4",
    padding: 20,
    justifyContent: "center",
  },
  timer: {
    fontSize: 30,
    textAlign: "right",
    marginBottom: 20,
    color: "#FF5733",
  },
  progressBar: {
    height: 10,
    backgroundColor: "#FF5733",
    borderRadius: 5,
    marginBottom: 30,
  },
  question: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 30,
    color: "#2E4053",
  },
  option: {
    backgroundColor: "#5D6D7E",
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: { color: "#fff", fontSize: 18, textAlign: "center" },
});
