import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Sample Data
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
    description: "Learn the basics",
  },
  {
    id: "2",
    title: "Advanced React Native",
    description: "Master advanced concepts",
  },
];

export default function CourseDetailScreen({ navigation }) {
  const [question, setQuestion] = useState("");
  const [qna, setQna] = useState([]);
  const [rating, setRating] = useState(0);

  const handleAskQuestion = () => {
    if (question.trim()) {
      setQna([...qna, { id: Date.now().toString(), question, likes: 0 }]);
      setQuestion("");
    } else {
      Alert.alert("Please enter a question.");
    }
  };

  const renderItem = ({ item, section }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("WebView", { link: item.link })}
    >
      <Text style={styles.cardText}>{item.title}</Text>
      {item.description && (
        <Text style={styles.cardDescription}>{item.description}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Course Details</Text>
      </View>

      {/* Courses Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Courses</Text>
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>

      {/* Quizzes Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quizzes</Text>
        <FlatList
          data={quizzes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>

      {/* Exams Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Exams</Text>
        <FlatList
          data={exams}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>

      {/* Ask a Question Section */}
      <View style={styles.askSection}>
        <Text style={styles.sectionTitle}>Ask a Question</Text>
        <TextInput
          style={styles.input}
          placeholder="Ask your question here..."
          value={question}
          onChangeText={setQuestion}
        />
        <TouchableOpacity onPress={handleAskQuestion} style={styles.askButton}>
          <Text style={styles.askButtonText}>Ask Question</Text>
        </TouchableOpacity>
      </View>

      {/* Display Q&A Section */}
      <View style={styles.qnaSection}>
        <Text style={styles.sectionTitle}>Student Questions</Text>
        {qna.length > 0 ? (
          <FlatList
            data={qna}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.qnaCard}>
                <Text style={styles.qnaQuestion}>{item.question}</Text>
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={() => {
                    const updatedQna = qna.map((q) =>
                      q.id === item.id ? { ...q, likes: q.likes + 1 } : q
                    );
                    setQna(updatedQna);
                  }}
                >
                  <Icon name="thumb-up" size={20} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <Text style={styles.emptyText}>No questions asked yet.</Text>
        )}
      </View>

      {/* Rating Section */}
      <View style={styles.ratingSection}>
        <Text style={styles.sectionTitle}>Rate this Course</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    padding: 20,
    backgroundColor: "#6C5B7B", // Soft purple header
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6C5B7B", // Soft purple
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6C5B7B", // Soft purple
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  askSection: {
    marginTop: 20,
    marginHorizontal: 20,
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
    backgroundColor: "#F9A826",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  askButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  qnaSection: {
    marginTop: 20,
    marginHorizontal: 20,
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
    color: "#6C5B7B",
  },
  likeButton: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginVertical: 10,
  },
  ratingSection: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  rating: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
});
