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
      question: "What’s the strongest shape?",
      options: ["Circle", "Triangle", "Square", "Pentagon"],
      answer: "Triangle",
    },
    {
      question: "Which of the following is NOT a type of engineering?",
      options: ["Mechanical Engineering", "Aerospace Engineering", "Chemical Engineering", "Creative Engineering"],
      answer: "Creative Engineering",
    },

    {
      question: "What does the acronym 'CAD' stand for in engineering?",
      options: ["Computer-Aided Design", "Computer-Aided Development", "Centralized Automated Design", "Computerized Algorithmic Design"],
      answer: "Computer-Aided Design",
    },
];

export default function QuickBrainQuiz({ navigation }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(1);
  const [time, setTime] = useState(10);
  const progress = useRef(new Animated.Value(0)); // For progress bar
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);

  // Handle answer selection
  const handleSelect = useCallback(
    (option) => {
      setSelected(option);
      const isCorrect = option === quizData[currentQ].answer;
      if (isCorrect) {
        setScore((prevScore) => prevScore + 1); // Update the score correctly
      }
      setAnsweredQuestions((prev) => [
        ...prev,
        { question: quizData[currentQ], userAnswer: option, isCorrect },
      ]);

      // Animate progress bar
      Animated.timing(progress.current, {
        toValue: (currentQ + 1) / quizData.length,
        duration: 500,
        useNativeDriver: false,
      }).start();
      setTimeout(() => handleNext(), 1000);
    },
    [currentQ]
  );

  const handleNext = useCallback(() => {
    if (currentQ + 1 < quizData.length) {
      setCurrentQ((prevQ) => prevQ + 1);
      setSelected(null);
      setTime(10);
    } else {
      setQuizFinished(true);
      // Pass the correct score and other data to the result screen
      navigation.navigate("QuizResult", { score, quizData, answeredQuestions });
    }
  }, [currentQ, score, navigation, answeredQuestions]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (time > 0 && !quizFinished) setTime((prevTime) => prevTime - 1);
      else if (!quizFinished) handleNext();
    }, 1000);
    return () => clearInterval(timer);
  }, [time, handleNext, quizFinished]);

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
            selected === option && {
              backgroundColor:
                option === quizData[currentQ].answer ? "#4CAF50" : "#F44336",
            }, // Green for correct, Red for wrong
          ]}
          onPress={() => handleSelect(option)}
          disabled={!!selected} // Disable after selection
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
    backgroundColor: "#FFEB3B", // Bright background for fun
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
    textAlign: "center",
  },
  option: {
    backgroundColor: "#5D6D7E",
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    transition: "background-color 0.3s ease",
  },
  optionText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});
