import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function QuizResult({ route, navigation }) {
  const { score } = route.params;
  const XP = score * 10;

  const getMessage = () => {
    if (score === 3) return "🔥 Genius! You crushed it!";
    if (score === 2) return "🎯 Nice! You're sharp!";
    return "🙌 Good try! Come back tomorrow!";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score}/3</Text>
      <Text style={styles.message}>{getMessage()}</Text>
      <Text style={styles.xp}>🏆 XP Gained: {XP}</Text>

      <TouchableOpacity
        onPress={() => navigation.replace("HomeScreen")}
        style={styles.btn}
      >
        <Text style={styles.btnText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF0F5",
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: 250, height: 250 },
  score: { fontSize: 26, fontWeight: "bold", marginTop: 20 },
  message: { fontSize: 22, marginVertical: 10 },
  xp: { fontSize: 20, color: "#F67280", marginBottom: 30 },
  btn: {
    backgroundColor: "#355C7D",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  btnText: { color: "#fff", fontSize: 18 },
});
