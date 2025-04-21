import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";

const GPACalculator = () => {
  const [courses, setCourses] = useState([{ name: "", grade: "", credit: "" }]);
  const [gpa, setGpa] = useState(null);

  const handleAddCourse = () => {
    setCourses([...courses, { name: "", grade: "", credit: "" }]);
  };

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index][field] = value;
    setCourses(updatedCourses);
  };

  const handleCalculateGPA = () => {
    let totalCredits = 0;
    let weightedGradePoints = 0;

    courses.forEach((course) => {
      const gradePoints = getGradePoints(course.grade);
      if (gradePoints !== null) {
        totalCredits += parseFloat(course.credit);
        weightedGradePoints += gradePoints * parseFloat(course.credit);
      }
    });

    if (totalCredits > 0) {
      const calculatedGPA = weightedGradePoints / totalCredits;
      setGpa(calculatedGPA.toFixed(2));
    } else {
      setGpa("Invalid input");
    }
  };

  const getGradePoints = (grade) => {
    switch (grade.toUpperCase()) {
      case "A":
        return 4.0;
      case "B":
        return 3.0;
      case "C":
        return 2.0;
      case "D":
        return 1.0;
      case "F":
        return 0.0;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>📊 GPA Calculator</Text>

        {courses.map((course, index) => (
          <View key={index} style={styles.courseInput}>
            <TextInput
              style={styles.input}
              placeholder="Course Name"
              value={course.name}
              onChangeText={(text) => handleCourseChange(index, "name", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Grade (A, B, C, etc.)"
              value={course.grade}
              onChangeText={(text) => handleCourseChange(index, "grade", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Credits"
              value={course.credit}
              keyboardType="numeric"
              onChangeText={(text) => handleCourseChange(index, "credit", text)}
            />
          </View>
        ))}

        <TouchableOpacity
          style={styles.addCourseButton}
          onPress={handleAddCourse}
        >
          <Text style={styles.addCourseButtonText}> Add Another Course</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.calculateButton}
          onPress={handleCalculateGPA}
        >
          <Text style={styles.calculateButtonText}> Calculate GPA</Text>
        </TouchableOpacity>

        {gpa && <Text style={styles.result}>Your GPA is: {gpa}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0EBF8", // Match your app's background
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0EBF8",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4A3F55",
    textAlign: "center",
  },
  courseInput: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    height: 45,
    borderColor: "#D1C4E9",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#FAF8FF",
  },
  result: {
    marginTop: 24,
    fontSize: 22,
    fontWeight: "600",
    color: "#5D3A9B",
    textAlign: "center",
  },
  addCourseButton: {
    backgroundColor: "#957DAD",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    marginVertical: 10,
  },
  addCourseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  calculateButton: {
    backgroundColor: "#6C5B7B",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  calculateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default GPACalculator;
