import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";

const progressData = {
  course: "React Native Basics",
  progress: 65, // Percentage progress
};

const motivationalQuotes = [
  "The only way to do great work is to love what you do.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "Don't watch the clock; do what it does. Keep going.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Your limitation—it’s only your imagination.",
];

export default function HomeScreen({ navigation }) {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const randomQuote =
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);
  }, []);

  const markedDates = {
    "2025-02-20": {
      selected: true,
      marked: true,
      selectedColor: "blue",
    },
    "2025-02-25": {
      selected: true,
      marked: true,
      selectedColor: "red",
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.welcomeText}>Welcome to the App</Text>
        <Text style={styles.descriptionText}>
          Explore courses and generate AI quizzes!
        </Text>

        <Text style={styles.greetingText}>
          Good {new Date().getHours() < 12 ? "Morning" : "Afternoon"}!
        </Text>

        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>
            Progress in {progressData.course}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressData.progress}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {progressData.progress}% completed
          </Text>
        </View>

        <Text style={styles.quoteText}>"{quote}"</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("CourseList")}
          >
            <Text style={styles.buttonText}>Explore Courses</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.buttonText}>My Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("UpcomingEvents")}
          >
            <Text style={styles.buttonText}>Upcoming Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Text style={styles.buttonText}>Notifications</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.calendarContainer}>
          <Text style={styles.sectionTitle}>Upcoming Vacations and Exams</Text>
          <Calendar
            current={"2025-02-01"}
            markedDates={markedDates}
            theme={{
              todayTextColor: "#007bff",
              arrowColor: "#007bff",
              monthTextColor: "#333",
              textMonthFontWeight: "bold",
              selectedDayBackgroundColor: "#007bff",
              selectedDayTextColor: "#fff",
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  scrollViewContent: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 50,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 20,
  },
  descriptionText: {
    color: "#777",
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 10,
  },
  progressContainer: {
    width: "100%",
    marginVertical: 20,
    alignItems: "center",
  },
  progressTitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  progressText: {
    marginTop: 5,
    fontSize: 14,
    color: "#333",
  },
  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#333",
    textAlign: "center",
    marginVertical: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  calendarContainer: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
  },
});
