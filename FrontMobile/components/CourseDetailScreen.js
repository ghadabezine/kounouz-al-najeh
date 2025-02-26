import React, { useState } from "react";
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
import { WebView } from "react-native-webview"; // Correct import for WebView
import Icon from "react-native-vector-icons/MaterialIcons"; // or another icon set like FontAwesome

// Sample data
const quizzes = [
  { id: "1", title: "React Native Quiz #1", link: "https://example.com/quiz1" },
  { id: "2", title: "React Native Quiz #2", link: "https://example.com/quiz2" },
];
const exams = [
  {
    id: "1",
    title: "React Native Final Exam",
    link: "https://example.com/exam1",
  },
  {
    id: "2",
    title: "React Native Midterm Exam",
    link: "https://example.com/exam2",
  },
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

export default function CourseDetailScreen({ navigation }) {
  const [question, setQuestion] = useState("");
  const [qna, setQna] = useState([]);
  const [rating, setRating] = useState(0);
  const [showVideo, setShowVideo] = useState(false); // State to control video display

  const handleAskQuestion = () => {
    if (question) {
      setQna([...qna, { id: qna.length + 1, question, answers: [], likes: 0 }]);
      setQuestion("");
    } else {
      Alert.alert("Please enter a question.");
    }
  };

  const handleRating = (rate) => setRating(rate);

  const handleDeleteQuestion = (id) => {
    setQna(qna.filter((item) => item.id !== id));
  };

  const handleReplyToQuestion = (id, reply) => {
    const updatedQna = qna.map((item) =>
      item.id === id ? { ...item, answers: [...item.answers, reply] } : item
    );
    setQna(updatedQna);
  };

  const handleLikeQuestion = (id) => {
    const updatedQna = qna.map((item) =>
      item.id === id ? { ...item, likes: item.likes + 1 } : item
    );
    setQna(updatedQna);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Courses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Courses</Text>
          <FlatList
            data={courses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardText}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
                <TouchableOpacity
                  onPress={() => setShowVideo(true)} // Set showVideo to true when clicked
                  style={styles.askButton}
                >
                  <Text style={styles.askButtonText}>View Course PDF</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        {/* Old Quizzes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Old Quizzes</Text>
          <FlatList
            data={quizzes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={
                  () => navigation.navigate("WebView", { link: item.link }) // Correct navigation to WebView
                }
                style={styles.card}
              >
                <Text style={styles.cardText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Past Exams */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Exams</Text>
          <FlatList
            data={exams}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={
                  () => navigation.navigate("WebView", { link: item.link }) // Correct navigation to WebView
                }
                style={styles.card}
              >
                <Text style={styles.cardText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
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

        {/* Course Rating */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#f9f9f9",
  },
  scrollContainer: {
    paddingBottom: 20,
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
