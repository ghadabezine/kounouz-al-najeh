import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { Calendar } from "react-native-calendars";

// Get screen dimensions
const { width } = Dimensions.get("window");

const progressData = {
  course: "React Native Basics",
  progress: 65,
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning! ☀️";
    if (hour < 18) return "Good Afternoon! 🌤️";
    return "Good Evening! 🌙";
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Profile & Greeting */}
        <View style={styles.headerContainer}>
          <Image
            source={require("../assets/profile.jpg")}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
            <Text style={styles.appName}>Welcome to Kounouz Al Najah</Text>
          </View>
        </View>

        <Text style={styles.descriptionText}>
          Explore courses and generate quizzes!
        </Text>

        {/* Progress Bar */}
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

        {/* Quote of the Day */}
        <Text style={styles.quoteText}>"{quote}"</Text>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("CourseList")}
          >
            <Text style={styles.buttonText}>📚 Explore Courses</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.buttonText}>👤 My Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("UpcomingEvents")}
          >
            <Text style={styles.buttonText}>📅 Upcoming Events</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Text style={styles.buttonText}>🔔 Notifications</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Text style={styles.sectionTitle}>📆 Upcoming Vacations & Exams</Text>
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
    backgroundColor: "#F7F7F7",
  },
  scrollViewContent: {
    alignItems: "center",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  appName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6C5B7B",
  },
  greetingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F9A826",
  },
  descriptionText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  progressContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 20,
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
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6C5B7B",
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
    backgroundColor: "#6C5B7B",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
    width: width * 0.85,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    elevation: 5,
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
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
});
