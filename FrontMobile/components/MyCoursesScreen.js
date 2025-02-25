import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";

// Sample course data with progress (percentage)
const courses = [
  { id: "1", name: "React Native Basics", progress: 60 },
  { id: "2", name: "Advanced React", progress: 40 },
  { id: "3", name: "JavaScript for Mobile", progress: 80 },
];

export default function MyCoursesScreen({ navigation }) {
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Handle long press event to show options
  const handleLongPress = (course) => {
    setSelectedCourse(course);
    Alert.alert(
      "Choose an Option",
      "",
      [
        {
          text: "View Course",
          onPress: () =>
            navigation.navigate("CourseDetailScreen", { courseId: course.id }),
        },
        {
          text: "Generate Quiz",
          onPress: () =>
            navigation.navigate("QuizScreen", { courseId: course.id }),
        },
        {
          text: "Generate Exam",
          onPress: () =>
            navigation.navigate("ExamScreen", { courseId: course.id }),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  courseCard: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    elevation: 2,
  },
  courseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginVertical: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#007bff",
  },
  progressText: {
    fontSize: 14,
    color: "#333",
  },
});
