<<<<<<< HEAD
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function QuizResultScreen({ route }) {
  const { score, quizData } = route.params; // Get score from the route params
  const navigation = useNavigation();

  // Navigate to home screen after viewing results
  const navigateToHome = () => {
    navigation.navigate("Home"); // Ensure this points to your home screen route
  };

  return (
    <View style={styles.container}>
      {/* Header with Trophy Image */}
      <View style={styles.header}>
        <Text style={styles.title}>🎉 Congratulations! 🎉</Text>
        <Image
          source={require("../assets/Trophy.png")} // Ensure this is a PNG image
          style={styles.trophyImage}
        />
      </View>

      {/* Score Display */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Your score is:</Text>
        <Text style={styles.score}>
          {score} / {quizData.length}
        </Text>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.homeButton} onPress={navigateToHome}>
          <Text style={styles.homeButtonText}>Go Back Home</Text>
        </TouchableOpacity>
      </View>
    </View>
=======
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // or another icon set like FontAwesome

// Sample data
const quizzes = [
  { id: "1", title: "React Native Quiz #1" },
  { id: "2", title: "React Native Quiz #2" },
];
const exams = [
  { id: "1", title: "React Native Final Exam" },
  { id: "2", title: "React Native Midterm Exam" },
];
const courses = [
  {
    id: "1",
    title: "React Native for Beginners",
    description:
      "Learn the fundamentals of React Native and start building mobile apps.",
    pdfLink: "https://example.com/course1.pdf",
  },
  {
    id: "2",
    title: "Advanced React Native",
    description:
      "Dive deep into React Native and master complex mobile development techniques.",
    pdfLink: "https://example.com/course2.pdf",
  },
];

export default function CourseDetailScreen() {
  const [question, setQuestion] = useState("");
  const [qna, setQna] = useState([]);
  const [rating, setRating] = useState(0);
  const [timer, setTimer] = useState(60); // Initialize timer to 60 seconds

  // Handle question submission
  const handleAskQuestion = () => {
    if (question) {
      setQna([...qna, { id: qna.length + 1, question, answers: [], likes: 0 }]);
      setQuestion("");
    } else {
      Alert.alert("Please enter a question.");
    }
  };

  // Handle rating
  const handleRating = (rate) => setRating(rate);

  // Handle question deletion
  const handleDeleteQuestion = (id) => {
    setQna(qna.filter((item) => item.id !== id));
  };

  // Handle reply to a question
  const handleReplyToQuestion = (id, reply) => {
    const updatedQna = qna.map((item) =>
      item.id === id ? { ...item, answers: [...item.answers, reply] } : item
    );
    setQna(updatedQna);
  };

  // Handle liking a question
  const handleLikeQuestion = (id) => {
    const updatedQna = qna.map((item) =>
      item.id === id ? { ...item, likes: item.likes + 1 } : item
    );
    setQna(updatedQna);
  };

  // Timer countdown logic
  useEffect(() => {
    // Only start the timer if it's greater than 0
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      // Cleanup interval on component unmount or when the timer reaches 0
      return () => clearInterval(interval);
    } else {
      // Handle timer expiry, e.g., submit quiz or exam
      Alert.alert("Time's up!", "Your time is over.");
    }
  }, [timer]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Course Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Courses</Text>
          <FlatList
            data={courses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardText}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
                <TouchableOpacity
                  onPress={() => alert("Course PDF link: " + item.pdfLink)}
                  style={styles.askButton}
                >
                  <Text style={styles.askButtonText}>View Course PDF</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        {/* Quizzes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quizzes</Text>
          <FlatList
            data={quizzes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardText}>{item.title}</Text>
              </View>
            )}
          />
        </View>

        {/* Exams Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exams</Text>
          <FlatList
            data={exams}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardText}>{item.title}</Text>
              </View>
            )}
          />
        </View>

        {/* Timer Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time Remaining</Text>
          <Text style={styles.timer}>{timer}s</Text>
        </View>

        {/* Q&A Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ask a Question</Text>
          <TextInput
            style={styles.input}
            placeholder="Ask your question here..."
            value={question}
            onChangeText={setQuestion}
          />
          <TouchableOpacity
            onPress={handleAskQuestion}
            style={styles.askButton}
          >
            <Text style={styles.askButtonText}>Ask Question</Text>
          </TouchableOpacity>
        </View>

        {/* Display Q&A */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Questions</Text>
          <FlatList
            data={qna}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.qnaCard}>
                <Text style={styles.qnaQuestion}>{item.question}</Text>
                <FlatList
                  data={item.answers}
                  keyExtractor={(answer, index) => index.toString()}
                  renderItem={({ item }) => (
                    <Text style={styles.qnaAnswer}>{item}</Text>
                  )}
                />
                <View style={styles.qnaActions}>
                  <TouchableOpacity
                    onPress={() => handleLikeQuestion(item.id)}
                    style={styles.qnaActionButton}
                  >
                    <Icon name="thumb-up" size={20} color="#4CAF50" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteQuestion(item.id)}
                    style={styles.qnaActionButton}
                  >
                    <Icon name="delete" size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>

        {/* Course Rating Section */}
        <View style={styles.ratingContainer}>
          <Text style={styles.sectionTitle}>Rate this Course</Text>
          <View style={styles.rating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                <Icon
                  name={star <= rating ? "star" : "star-outline"}
                  size={30}
                  color="#FFD700"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
>>>>>>> f603a2515574303b1ebbf32af460cfd4a61be625
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {
    flex: 1,
    backgroundColor: "#FFEB3B", // Bright background for fun
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FF6347", // Vibrant text color
    marginBottom: 20,
    textAlign: "center",
  },
  trophyImage: {
    width: 300, // Increased size for the trophy image
    height: 300, // Adjust as needed for a larger size
    borderRadius: 10,
    marginBottom: 20,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  scoreText: {
    fontSize: 22,
    color: "#2E7D32", // Green color for the label
    marginBottom: 10,
  },
  score: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#4CAF50", // Fun green color for score
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  homeButton: {
    backgroundColor: "#FF6347", // Fun orange color for button
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  homeButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
=======
  safeArea: {
    flex: 1,
    backgroundColor: "#F0EBF8", // Match your app's background
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6C5B7B", // Soft purple
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6C5B7B", // Soft purple
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
    marginVertical: 5,
  },
  timer: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F9A826", // Golden Yellow
    textAlign: "center",
    marginVertical: 10,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  askButton: {
    backgroundColor: "#F9A826", // Golden Yellow
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  askButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  qnaCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  qnaQuestion: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#6C5B7B", // Soft purple
  },
  qnaAnswer: {
    fontSize: 14,
    color: "#555",
    marginLeft: 10,
    marginTop: 5,
  },
  qnaActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  qnaActionButton: {
    padding: 5,
  },
  ratingContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  rating: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

>>>>>>> f603a2515574303b1ebbf32af460cfd4a61be625
