import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function CourseListScreen() {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  /** ✅ Fetch courses from the database */
  const fetchCourses = async () => {
    try {
      const response = await fetch("http://192.168.54.241:5001/api/subjects"); // Replace with your actual API
      if (!response.ok) throw new Error("Failed to fetch courses");

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
      Alert.alert("Error", "Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  /** ✅ Save selected course to AsyncStorage */
  const handleAddToMyCourses = async () => {
    try {
      const existingCourses = await AsyncStorage.getItem("myCourses");
      const myCourses = existingCourses ? JSON.parse(existingCourses) : [];

      if (myCourses.some((course) => course._id === selectedCourse._id)) {
        Alert.alert("Already Added", "This course is already in My Courses.");
      } else {
        myCourses.push(selectedCourse);
        await AsyncStorage.setItem("myCourses", JSON.stringify(myCourses));
        Alert.alert("Success", `${selectedCourse.name} added to My Courses!`);
        navigation.navigate("MyCoursesScreen");
      }
    } catch (error) {
      console.error("❌ Error saving course:", error);
      Alert.alert("Error", "Failed to add course.");
    } finally {
      setMenuVisible(false);
      setSelectedCourse(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Explore Courses</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6C5B7B" style={styles.loader} />
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.courseItem} onPress={() => {
              setSelectedCourse(item);
              setMenuVisible(true);
            }}>
              <Text style={styles.courseName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* ✅ Modal for Course Details */}
      {isMenuVisible && selectedCourse && (
        <Modal transparent={true} animationType="fade" visible={isMenuVisible} onRequestClose={() => setMenuVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.menuContainer}>
              <Text style={styles.modalTitle}>{selectedCourse.name}</Text>

              <TouchableOpacity onPress={handleAddToMyCourses} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add to My Courses</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.closeButton}>
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
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: "#f5f5f5" },
  header: { fontSize: 28, fontWeight: "700", marginVertical: 20, color: "#6C5B7B", textAlign: "center" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  courseItem: {
    padding: 18,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  courseName: { fontSize: 20, fontWeight: "600", color: "#333" },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  menuContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalTitle: { fontSize: 24, fontWeight: "700", color: "#6C5B7B", marginBottom: 12 },
  addButton: {
    paddingVertical: 14,
    backgroundColor: "#F9A826",
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  addButtonText: { fontSize: 16, color: "#fff", fontWeight: "600" },
  closeButton: { paddingVertical: 14, marginTop: 12, backgroundColor: "#ccc", borderRadius: 8, width: "100%", alignItems: "center" },
  menuText: { fontSize: 16, fontWeight: "600", color: "#333" },
});
