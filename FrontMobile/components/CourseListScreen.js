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
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
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
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#007bff",
    textAlign: "center",
  },
  courseItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  courseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
    color: "#222",
  },
  addButton: {
    padding: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    marginTop: 15,
    width: "100%",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    padding: 12,
    marginTop: 10,
    backgroundColor: "#ccc",
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
