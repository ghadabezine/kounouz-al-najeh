import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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

  useEffect(() => {
    const timer = setInterval(() => {
      if (time > 0) setTime(time - 1);
      else handleNext();
    }, 1000);
    return () => clearInterval(timer);
  }, [time]);

  const handleSelect = (option) => {
    setSelected(option);
    if (option === quizData[currentQ].answer) setScore(score + 1);
    setTimeout(() => handleNext(), 500);
  };

  const handleNext = () => {
    if (currentQ + 1 < quizData.length) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setTime(10);
    } else {
      navigation.navigate('QuizResult', { score });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>⏰ {time}s</Text>
      <Text style={styles.question}>{quizData[currentQ].question}</Text>
      {quizData[currentQ].options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.option,
            selected === option && { backgroundColor: "#F67280" },
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
  container: { flex: 1, backgroundColor: "#FDEBD0", padding: 20, justifyContent: 'center' },
  timer: { fontSize: 22, textAlign: "right", marginBottom: 20 },
  question: { fontSize: 22, fontWeight: "600", marginBottom: 30 },
  option: {
    backgroundColor: "#355C7D",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  optionText: { color: "#fff", fontSize: 18 },
});
