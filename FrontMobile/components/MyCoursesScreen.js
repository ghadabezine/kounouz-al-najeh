import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MyCoursesScreen({ navigation }) {
  const [myCourses, setMyCourses] = useState([]);

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
              onPress={() => navigation.navigate("GenerateQuizScreen", { subjectId: item._id })}
            >
              <Text style={styles.courseName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: "#f5f5f5" },
  header: { fontSize: 28, fontWeight: "700", marginVertical: 20, textAlign: "center" },
  noCourses: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#777" },
  courseItem: {
    padding: 18,
    marginBottom: 12,
    backgroundColor: "#6C5B7B",
    borderRadius: 12,
  },
  courseName: { fontSize: 20, fontWeight: "600", color: "#fff" },
});
