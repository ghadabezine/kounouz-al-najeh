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

  /** ✅ Edit course details */
  const editCourse = () => {
    // Navigate to EditCourseScreen with the selected course
    closeModal();
    navigation.navigate("EditCourseScreen", { course: selectedCourse });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.header}>My Courses</Text>

      {myCourses.length === 0 ? (
        <Text style={styles.noCourses}>No courses added yet.</Text>
      ) : (
        <FlatList
          data={myCourses}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => openModal(item)}
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
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
  safeArea: {
    flex: 1,
    backgroundColor: "#F0EBF8",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 10,
    borderLeftColor: "#123458",
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    color: "#333",
  },
  noCourses: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
    color: "#999",
    fontStyle: "italic",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "88%",
    maxWidth: 420,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6C5B7B",
    marginBottom: 18,
    textAlign: "center",
  },
  modalButton: {
    width: "100%",
    backgroundColor: "#c7efff",
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1E3E62",
  },
  closeButton: {
    width: "100%",
    backgroundColor: "#E0E0E0",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
});
