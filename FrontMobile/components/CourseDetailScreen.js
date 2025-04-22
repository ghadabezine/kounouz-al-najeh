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
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function CourseDetailScreen({ route, navigation }) {
  const { course } = route.params;
  const [chapters, setChapters] = useState([]);
  const [materials, setMaterials] = useState({});
  const [quizzes, setQuizzes] = useState({});
  const [question, setQuestion] = useState("");
  const [qna, setQna] = useState([]);
  const [rating, setRating] = useState(0);

  const fetchChapters = async () => {
    try {
      const response = await axios.get(
        `http://192.168.100.7:5001/api/chapters/subject/${course._id}`
      );
      setChapters(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch chapters");
    }
  };

  const fetchMaterials = async (chapterId) => {
    try {
      const response = await axios.get(
        `http://192.168.100.7:5001/api/files/${chapterId}/files`
      );
      setMaterials((prev) => ({ ...prev, [chapterId]: response.data }));
    } catch (error) {
      Alert.alert("Error", "Failed to fetch materials");
    }
  };

  const fetchQuizzes = async (chapterId) => {
    try {
      const response = await axios.get(
        `http://192.168.100.7:5001/api/quizzes/${chapterId}/quizzes`
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
    setQna(qna.map((item) =>
      item.id === id ? { ...item, likes: item.likes + 1 } : item
    ));
  };

  const handleDeleteQuestion = (id) => {
    setQna(qna.filter((item) => item.id !== id));
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
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
                </TouchableOpacity>
              </View>

              {/* 📄 Display File Names */}
              {materials[item._id] && materials[item._id].length > 0 && (
                <View style={styles.materialSection}>
                  <Text style={styles.subHeader}>Materials:</Text>
                  {materials[item._id].map((file) => (
                    <TouchableOpacity
                      key={file._id}
                      onPress={() =>
                        Linking.openURL(
                          `http://192.168.100.7:5001/api/files/view/${file._id}`
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
    alignItems: "center",
    flex: 1,
    marginRight: 6,
  },
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
