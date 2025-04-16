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
import Icon from "react-native-vector-icons/MaterialIcons";

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Course Section */}
        <View style={styles.container}>
          <Text style={styles.header}>Courses</Text>
          <FlatList
            data={courses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
                <Text style={styles.cardText}>{item.description}</Text>
                <TouchableOpacity
                  onPress={() => alert("Course PDF link: " + item.pdfLink)}
                  style={styles.challengeBtn}
                >
                  <Text style={styles.cardText}>View Course PDF</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        {/* Quizzes Section */}
        <View style={styles.container}>
          <Text style={styles.header}>Quizzes</Text>
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
        <View style={styles.container}>
          <Text style={styles.header}>Exams</Text>
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

        {/* Q&A Section */}
        <View style={styles.container}>
          <Text style={styles.header}>Ask a Question</Text>
          <TextInput
            style={styles.input}
            placeholder="Ask your question here..."
            value={question}
            onChangeText={setQuestion}
          />
          <TouchableOpacity
            onPress={handleAskQuestion}
            style={styles.challengeBtn}
          >
            <Text style={styles.cardText}>Ask Question</Text>
          </TouchableOpacity>
        </View>

        {/* Display Q&A */}
        <View style={styles.container}>
          <Text style={styles.header}>Student Questions</Text>
          <FlatList
            data={qna}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.question}</Text>
                <FlatList
                  data={item.answers}
                  keyExtractor={(answer, index) => index.toString()}
                  renderItem={({ item }) => (
                    <Text style={styles.cardText}>{item}</Text>
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
        <View style={styles.container}>
          <Text style={styles.header}>Rate this Course</Text>
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
  safeArea: {
    flex: 1,
    backgroundColor: "#F0EBF8", // Match your app's background
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  container: {
    padding: 16,
    backgroundColor: "#f4f4f8",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#D4C9BE",
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    color: "#333",
  },
  cardText: {
    fontSize: 16,
    color: "#fff",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  challengeBtn: {
    marginTop: 10,
    backgroundColor: "#5A72A0", // Updated to match the color palette
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  qnaActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  qnaActionButton: {
    padding: 5,
  },
  rating: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
