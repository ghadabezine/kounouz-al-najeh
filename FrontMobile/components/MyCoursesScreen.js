import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

// Sample course data with progress (percentage)
const courses = [
  { id: "1", name: "React Native Basics", progress: 60 },
  { id: "2", name: "Advanced React", progress: 40 },
  { id: "3", name: "JavaScript for Mobile", progress: 80 },
];

export default function MyCoursesScreen({ navigation }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Handle long press event to show options
  const handleLongPress = (course) => {
    setSelectedCourse(course);
    setIsModalVisible(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Render course item with progress bar
  const renderCourse = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => handleLongPress(item)}
      style={styles.courseCard}
    >
      <Text style={styles.courseName}>{item.name}</Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{item.progress}% Completed</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={renderCourse}
      />

      {/* Modal for options */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackground} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Choose an Option</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              navigation.navigate("CourseDetailScreen", {
                courseId: selectedCourse.id,
              });
              closeModal();
            }}
          >
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
            <Text style={styles.modalButtonText}>Generate Exam</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F0F0", // Light gray background for the screen
  },
  courseCard: {
    padding: 20,
    marginVertical: 12,
    backgroundColor: "#6C5B7B", // Soft purple for course card background
    borderRadius: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  courseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF", // White text for course name
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#ddd", // Light gray for progress background
    borderRadius: 5,
    marginVertical: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#6C5B7B", // Soft purple for progress fill
  },
  progressText: {
    fontSize: 14,
    color: "#333",
  },

  // Modal Styles
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark semi-transparent background
  },
  modalContainer: {
    position: "absolute",
    top: "30%",
    left: "10%",
    right: "10%",
    backgroundColor: "#FFFFFF", // White background for modal
    padding: 20,
    borderRadius: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6C5B7B", // Title color matching card background
    textAlign: "center",
  },
  modalButton: {
    paddingVertical: 12,
    marginBottom: 10,
    backgroundColor: "#6C5B7B", // Soft purple for buttons
    borderRadius: 8,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    textAlign: "center",
  },
  cancelButton: {
    paddingVertical: 12,
    marginTop: 10,
    backgroundColor: "#F9A826", // Soft yellow for cancel button
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    textAlign: "center",
  },
});
