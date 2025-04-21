import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// Array of quotes
const quotes = [
  `"Success is the sum of small efforts, repeated day in and day out." – R. Collier`,
  `"The only way to do great work is to love what you do." – Steve Jobs`,
  `"It always seems impossible until it's done." – Nelson Mandela`,
  `"Your time is limited, don't waste it living someone else's life." – Steve Jobs`,
  `"Don't watch the clock; do what it does. Keep going." – Sam Levenson`,
  `"Believe you can and you're halfway there." – Theodore Roosevelt`,
  `"The future belongs to those who believe in the beauty of their dreams." – Eleanor Roosevelt`,
  `"The only limit to our realization of tomorrow is our doubts of today." – Franklin D. Roosevelt`,
  `"Act as if what you do makes a difference. It does." – William James`,
  `"Success is not final, failure is not fatal: It is the courage to continue that counts." – Winston Churchill`,
];
const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>

        <Text style={styles.header}>🎓 Welcome back, Student!</Text>
        {/* Quote Wall */}
        <Card
          icon="lightbulb-on-outline"
          title="Quote of the Day"
          color="#355C7D"
        >
          <Text style={styles.cardText}>{randomQuote}</Text>
        </Card>

        {/* Progress Tracker */}
        <Card icon="trending-up" title="Your Progress Tracker" color="#6C5B7B">
          <Text style={styles.cardText}>
            You're 65% through your current term courses.
          </Text>
        </Card>

        {/* Attendance Overview */}
        <Card icon="calendar-check" title="Attendance Overview" color="#355C7D">
          <Text style={styles.cardText}>
            Average attendance: 88%. Keep it up!
          </Text>
        </Card>

        {/* Term Timeline */}
        <Card icon="timeline-clock" title="Term Timeline" color="#F67280">
          <Text style={styles.cardText}>
            Week 11 of 12 • Midterms Done • 1 Weeks to Finals
          </Text>
        </Card>

        {/* Daily Challenge */}
        <Card icon="gamepad-variant" title="Daily Challenge" color="#F8B195">
          <Text style={styles.cardText}>
            🧠 Solve 3 case-based MCQs before 10PM!
          </Text>
          <TouchableOpacity
            style={styles.challengeBtn}
            onPress={() => navigation.navigate("QuickBrainQuiz")}
          >
            <Text style={{ color: "#fff" }}>Start Challenge</Text>
          </TouchableOpacity>
        </Card>

        {/* GPA Calculator */}
        <Card icon="calculator-variant" title="GPA Calculator" color="#6C5B7B">
          <TouchableOpacity
            onPress={() => navigation.navigate("GPACalculator")}
          >
            <Text style={styles.link}>Tap to calculate your GPA →</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const Card = ({ icon, title, children, color }) => (
  <View style={[styles.card, { borderLeftColor: color }]}>
    <View style={styles.cardHeader}>
      <MaterialCommunityIcons name={icon} size={24} color={color} />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <View>{children}</View>
  </View>
);

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
    padding: 16,
    backgroundColor: "#f4f4f8",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#F67280",
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    color: "#333",
  },
  cardText: {
    fontSize: 16,
    color: "#333",
  },
  link: {
    color: "#007bff",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  challengeBtn: {
    marginTop: 10,
    backgroundColor: "#F67280",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
