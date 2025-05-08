import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
  Linking,
} from "react-native";
<<<<<<< HEAD
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function CourseDetailScreen({ route, navigation }) {
  const { course } = route.params;
  const [chapters, setChapters] = useState([]);
  const [materials, setMaterials] = useState({});
  const [quizzes, setQuizzes] = useState({});
=======
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
>>>>>>> f603a2515574303b1ebbf32af460cfd4a61be625
  const [question, setQuestion] = useState("");
  const [qna, setQna] = useState([]);
  const [rating, setRating] = useState(0);

  const fetchChapters = async () => {
    try {
      const response = await axios.get(
        `http://192.168.1.56:5005/api/chapters/subject/${course._id}`
      );
      setChapters(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch chapters");
    }
  };

  const fetchMaterials = async (chapterId) => {
    try {
      const response = await axios.get(
        `http://192.168.1.56:5005/api/files/${chapterId}/files`
      );
      setMaterials((prev) => ({ ...prev, [chapterId]: response.data }));
    } catch (error) {
      Alert.alert("Error", "Failed to fetch materials");
    }
  };

  const fetchQuizzes = async (chapterId) => {
    try {
      const response = await axios.get(
        `http://192.168.1.56:5002/api/quizzes/${chapterId}/quizzes`
      );
      setQuizzes((prev) => ({ ...prev, [chapterId]: response.data }));
    } catch (error) {
      Alert.alert("Error", "Failed to fetch quizzes");
    }
  };

  const handleAskQuestion = () => {
    if (!question.trim()) {
      Alert.alert("Please enter a question.");
      return;
    }
    setQna([...qna, { id: qna.length + 1, question, answers: [], likes: 0 }]);
    setQuestion("");
  };

  const handleLikeQuestion = (id) => {
    setQna(
      qna.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
  };

  const handleDeleteQuestion = (id) => {
    setQna(qna.filter((item) => item.id !== id));
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
<<<<<<< HEAD
      <View style={styles.container}>
        <Text style={styles.header}>{course.name} - Chapters</Text>
        <FlatList
          data={chapters}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cardButton}
                  onPress={() => fetchMaterials(item._id)}
                >
                  <Text style={styles.cardButtonText}>View Materials</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cardButton}
                  onPress={() =>
                    navigation.navigate("QuizScreen", { chapterId: item._id })
                  }
                >
                  <Text style={styles.cardButtonText}>Generate Quiz</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cardButton}
                  onPress={() => fetchQuizzes(item._id)}
                >
                  <Text style={styles.cardButtonText}>View Quizzes</Text>
=======
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
>>>>>>> f603a2515574303b1ebbf32af460cfd4a61be625
                </TouchableOpacity>
              </View>

<<<<<<< HEAD
              {/* 📄 Display File Names */}
              {materials[item._id] && materials[item._id].length > 0 && (
                <View style={styles.materialSection}>
                  <Text style={styles.subHeader}>Materials:</Text>
                  {materials[item._id].map((file) => (
                    <TouchableOpacity
                      key={file._id}
                      onPress={() =>
                        Linking.openURL(
                          `http://192.168.1.56:5005/api/files/view/${file._id}`
                        )
                      }
                    >
                      <Text style={styles.materialItem}>{file.filename}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* 🧠 Display Quizzes */}
              {quizzes[item._id] && quizzes[item._id].length > 0 && (
                <View style={styles.materialSection}>
                  <Text style={styles.subHeader}>Quizzes:</Text>
                  {quizzes[item._id].map((quiz) => (
                    <Text key={quiz._id} style={styles.materialItem}>
                      {quiz.title || "Untitled Quiz"}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}
        />
      </View>

      {/* ❓ Q&A Section */}
      <View style={styles.container}>
        <Text style={styles.header}>Ask a Question</Text>
        <TextInput
          style={styles.input}
          placeholder="Your question here"
          value={question}
          onChangeText={setQuestion}
        />
        <TouchableOpacity style={styles.cardButton} onPress={handleAskQuestion}>
          <Text style={styles.cardButtonText}>Ask</Text>
        </TouchableOpacity>
      </View>

      {/* 🧾 Q&A List */}
      <View style={styles.container}>
        <Text style={styles.header}>Student Q&A</Text>
        {qna.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.question}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => handleLikeQuestion(item.id)}
                style={styles.qnaButton}
              >
                <Icon name="thumb-up" size={20} color="#4CAF50" />
                <Text>{item.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteQuestion(item.id)}
                style={styles.qnaButton}
              >
                <Icon name="delete" size={20} color="#F44336" />
              </TouchableOpacity>
            </View>
=======
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
>>>>>>> f603a2515574303b1ebbf32af460cfd4a61be625
          </View>
        ))}
      </View>

      {/* ⭐ Rating Section */}
      <View style={styles.container}>
        <Text style={styles.header}>Rate This Course</Text>
        <View style={styles.rating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Icon
                name={star <= rating ? "star" : "star-outline"}
                size={30}
                color="#FFD700"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  safeArea: { flex: 1, backgroundColor: "#F0EBF8" },
  container: { padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  cardButton: {
    backgroundColor: "#5A72A0",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
=======
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
>>>>>>> f603a2515574303b1ebbf32af460cfd4a61be625
    alignItems: "center",
    flex: 1,
    marginRight: 6,
  },
<<<<<<< HEAD
  cardButtonText: { color: "#fff", fontWeight: "600" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  materialSection: {
    marginTop: 10,
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 8,
  },
  subHeader: {
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 16,
  },
  materialItem: {
    fontSize: 14,
    marginBottom: 6,
    color: "#1E3E62",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 44,
    marginBottom: 10,
  },
  qnaButton: {
=======
  qnaActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  qnaActionButton: {
    padding: 5,
  },
  rating: {
>>>>>>> f603a2515574303b1ebbf32af460cfd4a61be625
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  rating: { flexDirection: "row", justifyContent: "center", marginTop: 10 },
});
