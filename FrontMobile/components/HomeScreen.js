import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
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
      selectedColor: "#6C5B7B", // Soft purple color for first date
    },
    "2025-02-25": {
      selected: true,
      marked: true,
      selectedColor: "#F9A826", // Golden yellow color for second date
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.appName}>Kounouz Al Najah</Text>
        </View>
        <Text style={styles.descriptionText}>
          Explore courses and generate quizzes!
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

        {/* New Feature: Random Achievement */}
        <View style={styles.achievementContainer}>
          <Text style={styles.achievementText}>🎉 Achievement Unlocked!</Text>
          <Text style={styles.achievementDetail}>
            Completed 50% of your first React Native course.
          </Text>
        </View>

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
              todayTextColor: "#6C5B7B", // Soft purple for today text
              arrowColor: "#F9A826", // Golden yellow for arrows
              monthTextColor: "#333",
              textMonthFontWeight: "bold",
              selectedDayBackgroundColor: "#F9A826", // Golden yellow for selected day background
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
    backgroundColor: "#E8E8E8",
  },
  scrollViewContent: {
    alignItems: "center",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "center",
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 15,
    borderRadius: 10,
  },
  appName: {
    fontSize: 30,
    fontWeight: "600",
    color: "#6C5B7B", // Soft purple for the app name
    textShadowColor: "#f5f5f5",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  descriptionText: {
    color: "#777",
    marginBottom: 20,
    textAlign: "center",
  },
  greetingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F9A826", // Golden yellow greeting color
    marginBottom: 20,
    letterSpacing: 2,
    textAlign: "center",
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
    marginBottom: 5,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6C5B7B", // Soft purple for progress fill
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
  achievementContainer: {
    marginVertical: 30,
    padding: 20,
    backgroundColor: "#F9A826", // Golden yellow background for achievement box
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#6C5B7B", // Soft purple border
    width: "90%",
    alignItems: "center",
  },
  achievementText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  achievementDetail: {
    fontSize: 14,
    color: "#fff",
    marginTop: 10,
    fontStyle: "italic",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#6C5B7B", // Soft purple for buttons
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 12,
    width: "80%",
    elevation: 6, // Shadow for depth
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
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
