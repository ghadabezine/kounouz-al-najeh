import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function QuizResultScreen({ route }) {
  const { score, quizData } = route.params; // Get score from the route params
  const navigation = useNavigation();

  // Navigate to home screen after viewing results
  const navigateToHome = () => {
    navigation.navigate("Home"); // Ensure this points to your home screen route
  };

  return (
    <View style={styles.container}>
      {/* Header with Trophy Image */}
      <View style={styles.header}>
        <Text style={styles.title}>🎉 Congratulations! 🎉</Text>
        <Image
          source={require("../assets/Trophy.png")} // Ensure this is a PNG image
          style={styles.trophyImage}
        />
      </View>

      {/* Score Display */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Your score is:</Text>
        <Text style={styles.score}>
          {score} / {quizData.length}
        </Text>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.homeButton} onPress={navigateToHome}>
          <Text style={styles.homeButtonText}>Go Back Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFEB3B", // Bright background for fun
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FF6347", // Vibrant text color
    marginBottom: 20,
    textAlign: "center",
  },
  trophyImage: {
    width: 300, // Increased size for the trophy image
    height: 300, // Adjust as needed for a larger size
    borderRadius: 10,
    marginBottom: 20,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  scoreText: {
    fontSize: 22,
    color: "#2E7D32", // Green color for the label
    marginBottom: 10,
  },
  score: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#4CAF50", // Fun green color for score
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  homeButton: {
    backgroundColor: "#FF6347", // Fun orange color for button
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  homeButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
