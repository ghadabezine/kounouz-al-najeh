import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Animated,
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
  const progressAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const randomQuote =
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);

    Animated.timing(progressAnim, {
      toValue: progressData.progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* App Name */}
        <Text style={styles.appName}>Kounouz Al Najah</Text>

        {/* Description */}
        <Text style={styles.descriptionText}>
          Explore courses and generate quizzes!
        </Text>

        {/* Greeting */}
        <Text style={styles.greetingText}>
          Good {new Date().getHours() < 12 ? "Morning" : "Afternoon"}!
        </Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>
            Progress in {progressData.course}
          </Text>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {progressData.progress}% completed
          </Text>
        </View>

        {/* Motivational Quote */}
        <Text style={styles.quoteText}>"{quote}"</Text>

        {/* Buttons */}
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

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Text style={styles.sectionTitle}>Upcoming Vacations and Exams</Text>
          <Calendar
            current={"2025-02-01"}
            theme={{
              todayTextColor: "#6C5B7B",
              arrowColor: "#F9A826",
              monthTextColor: "#333",
              textMonthFontWeight: "bold",
              selectedDayBackgroundColor: "#F9A826",
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
  backButton: {
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 10,
    backgroundColor: "#ddd",
    padding: 8,
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6C5B7B",
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6C5B7B",
    textAlign: "center",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginBottom: 10,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F9A826",
    textAlign: "center",
    marginBottom: 15,
  },
  progressContainer: {
    width: "90%",
    alignItems: "center",
    marginVertical: 15,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6C5B7B",
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
    marginTop: 10,
  },
  button: {
    backgroundColor: "#6C5B7B",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
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
