import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // For icons

// Sample course data with progress (percentage)
const courses = [
  { id: "1", name: "React Native Basics", progress: 60 },
  { id: "2", name: "Advanced React", progress: 40 },
  { id: "3", name: "JavaScript for Mobile", progress: 80 },
];

export default function MyCoursesScreen({ navigation }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Open Modal with Course Options
  const openModal = (course) => {
    setSelectedCourse(course);
    setIsModalVisible(true);
  };

  // Close the Modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Render course item
  const renderCourse = ({ item }) => (
    <View style={styles.courseCard}>
      <Text style={styles.courseName}>{item.name}</Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{item.progress}% Completed</Text>

      {/* Open Modal Button */}
      <TouchableOpacity
        style={styles.optionsButton}
        onPress={() => openModal(item)}
      >
        <Text style={styles.optionsButtonText}>Options</Text>
        <FontAwesome name="ellipsis-h" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={renderCourse}
      />

      {/* Modal for Options */}
      {selectedCourse && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{selectedCourse.name}</Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  navigation.navigate("CourseDetailScreen", {
                    courseId: selectedCourse.id,
                  });
                  closeModal();
                }}
              >
                <FontAwesome name="book" size={18} color="#fff" />
                <Text style={styles.modalButtonText}>View Course</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  navigation.navigate("QuizScreen", {
                    courseId: selectedCourse.id,
                  });
                  closeModal();
                }}
              >
                <FontAwesome name="question-circle" size={18} color="#fff" />
                <Text style={styles.modalButtonText}>Generate Quiz</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  navigation.navigate("ExamScreen", {
                    courseId: selectedCourse.id,
                  });
                  closeModal();
                }}
              >
                <FontAwesome name="pencil" size={18} color="#fff" />
                <Text style={styles.modalButtonText}>Generate Exam</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <FontAwesome name="times" size={18} color="#fff" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F0F0", // Light gray background
  },
  courseCard: {
    padding: 20,
    marginVertical: 12,
    backgroundColor: "#6C5B7B", // Soft purple background
    borderRadius: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  courseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginVertical: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#F9A826", // Golden yellow
  },
  progressText: {
    fontSize: 14,
    color: "#fff",
  },
  optionsButton: {
    marginTop: 12,
    backgroundColor: "#F9A826",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  optionsButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },

  // Modal Styles
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    elevation: 8,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6C5B7B",
    textAlign: "center",
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    marginBottom: 10,
    backgroundColor: "#6C5B7B",
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    marginTop: 10,
    backgroundColor: "#F9A826",
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
});
