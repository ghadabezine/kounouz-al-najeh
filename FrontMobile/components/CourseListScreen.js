import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function CourseListScreen() {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigation = useNavigation();

  const courses = [
    {
      id: 1,
      name: "Introduction to React Native",
      professor: "John Doe",
      courseMaterial: "React Native Docs, Expo Documentation",
      gradeLevel: "Intermediate",
    },
    {
      id: 2,
      name: "Advanced JavaScript",
      professor: "Jane Smith",
      courseMaterial: "JavaScript: The Good Parts, MDN Docs",
      gradeLevel: "Advanced",
    },
    // Add more courses here
  ];

  const handlePress = (course) => {
    setSelectedCourse(course);
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setSelectedCourse(null);
  };

  const handleAddToMyCourses = () => {
    console.log(`Added ${selectedCourse.name} to My Courses`);
    navigation.navigate("MyCoursesScreen");
    closeMenu();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Explore Courses</Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseItem}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.courseName}>{item.name}</Text>
            <Text style={styles.courseDetails}>
              {item.professor} - {item.gradeLevel}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.flatListContent}
      />

      {/* Modal for Course Details */}
      {isMenuVisible && selectedCourse && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isMenuVisible}
          onRequestClose={closeMenu}
        >
          <View style={styles.modalBackground}>
            <View style={styles.menuContainer}>
              <Text style={styles.modalTitle}>{selectedCourse.name}</Text>
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Professor:</Text>{" "}
                {selectedCourse.professor}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Material:</Text>{" "}
                {selectedCourse.courseMaterial}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Grade Level:</Text>{" "}
                {selectedCourse.gradeLevel}
              </Text>

              {/* Add to My Courses Button */}
              <TouchableOpacity
                onPress={handleAddToMyCourses}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>Add to My Courses</Text>
              </TouchableOpacity>

              {/* Close Menu Button */}
              <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
                <Text style={styles.menuText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginVertical: 20,
    color: "#6C5B7B", // Soft purple
    textAlign: "center",
  },
  courseItem: {
    padding: 18,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  courseName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  courseDetails: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menuContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6C5B7B", // Soft purple
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
    color: "#222",
  },
  addButton: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    backgroundColor: "#F9A826", // Golden yellow
    borderRadius: 8,
    marginTop: 18,
    width: "100%",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  closeButton: {
    paddingVertical: 14,
    marginTop: 12,
    backgroundColor: "#ccc",
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
