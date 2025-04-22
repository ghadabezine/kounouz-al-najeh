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

  /** ✅ Navigate to Course Details */
  const handleCoursePress = (course) => {
    navigation.navigate("CourseDetailScreen", { course });
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
              onPress={() => handleCoursePress(item)}
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
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
});
