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
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

export default function CourseListScreen() {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const slideAnim = new Animated.Value(300);
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
  ];

  const handlePress = (course) => {
    setSelectedCourse(course);
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
      setSelectedCourse(null);
    });
  };

  const handleAddToMyCourses = () => {
    console.log(`Added ${selectedCourse.name} to My Courses`);
    navigation.navigate("MyCoursesScreen");
    closeMenu();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Return Button */}

      <Text style={styles.header}>Explore Courses</Text>
      <TouchableOpacity
        style={styles.returnButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
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

      {/* Pop-up Modal */}
      {isMenuVisible && selectedCourse && (
        <Modal transparent={true} visible={isMenuVisible} animationType="fade">
          <View style={styles.modalBackground}>
            <Animated.View
              style={[
                styles.menuContainer,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <TouchableOpacity style={styles.closeIcon} onPress={closeMenu}>
                <Ionicons name="close-circle" size={28} color="#F9A826" />
              </TouchableOpacity>

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
            </Animated.View>
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
  returnButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#6C5B7B",
    padding: 8,
    borderRadius: 8,
    zIndex: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginVertical: 40,
    color: "#6C5B7B", // Soft purple
    textAlign: "center",
  },
  courseItem: {
    padding: 20,
    marginBottom: 14,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    borderLeftWidth: 6,
    borderLeftColor: "#F9A826", // Golden Yellow Accent
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  menuContainer: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  closeIcon: {
    position: "absolute",
    top: 12,
    right: 12,
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
});
