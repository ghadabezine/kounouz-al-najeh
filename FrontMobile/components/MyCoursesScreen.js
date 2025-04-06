import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MyCoursesScreen({ navigation }) {
  const [myCourses, setMyCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  /** ✅ Load saved courses */
  const loadCourses = async () => {
    try {
      const storedCourses = await AsyncStorage.getItem("myCourses");
      setMyCourses(storedCourses ? JSON.parse(storedCourses) : []);
    } catch (error) {
      console.error("❌ Error loading courses:", error);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  /** ✅ Open modal with selected course */
  const openModal = (course) => {
    setSelectedCourse(course);
    setModalVisible(true);
  };

  /** ✅ Close modal */
  const closeModal = () => {
    setSelectedCourse(null);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Courses</Text>

      {myCourses.length === 0 ? (
        <Text style={styles.noCourses}>No courses added yet.</Text>
      ) : (
        <FlatList
          data={myCourses}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.courseItem}
<<<<<<< HEAD
              onPress={() => openModal(item)}
=======
              onPress={() => navigation.navigate("GenerateQuizScreen", { subjectId: item._id })}
>>>>>>> 3f1b52810b524eb5ce1b801302da17103bb40edf
            >
              <Text style={styles.courseName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* ✅ Modal for Course Options */}
      {modalVisible && selectedCourse && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{selectedCourse.name}</Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  closeModal();
                  navigation.navigate("CourseDetailScreen", {
                    course: selectedCourse,
                  });
                }}
              >
                <Text style={styles.modalButtonText}>Show Full Course</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  closeModal();
                  navigation.navigate("QuizScreen", {
                    course: selectedCourse,
                  });
                }}
              >
                <Text style={styles.modalButtonText}>Generate Quiz</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  closeModal();
                  navigation.navigate("ExamScreen", {
                    course: selectedCourse,
                  });
                }}
              >
                <Text style={styles.modalButtonText}>Generate Exam</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: "#f5f5f5" },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginVertical: 20,
    textAlign: "center",
  },
  noCourses: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#777",
  },
  courseItem: {
    padding: 18,
    marginBottom: 12,
    backgroundColor: "#6C5B7B",
    borderRadius: 12,
  },
  courseName: { fontSize: 20, fontWeight: "600", color: "#fff" },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6C5B7B",
    marginBottom: 12,
  },
  modalButton: {
    paddingVertical: 14,
    backgroundColor: "#F9A826",
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginVertical: 5,
  },
  modalButtonText: { fontSize: 16, color: "#fff", fontWeight: "600" },
  closeButton: {
    paddingVertical: 14,
    marginTop: 12,
    backgroundColor: "#ccc",
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: { fontSize: 16, fontWeight: "600", color: "#333" },
});
