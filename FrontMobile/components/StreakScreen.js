import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STREAK_DAYS = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];

const StreakScreen = () => {
  const navigation = useNavigation();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch("http://172.20.10.7:5001/api/users/get-streak", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch streak");

        const data = await res.json();
        setStreak(data.streak || 0);
      } catch (err) {
        console.error("❌ Streak fetch error:", err);
        Alert.alert("Error", "Failed to load streak.");
      }
    };

    fetchStreak();
  }, []);

  return (
    <LinearGradient colors={["#F78C1F", "#F45D01", "#2C2C2C"]} style={styles.safeArea}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.topTitle}>Streak</Text>
            <TouchableOpacity>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.tabBar}>
            <Text style={styles.activeTab}>PERSONAL</Text>
          </View>

          <View style={styles.streakSection}>
            <Text style={styles.label}>STREAK SOCIETY</Text>

            <View style={styles.streakDisplay}>
              <Image source={require("../assets/flameBox.png")} style={styles.streakFlameLarge} />
              <View style={styles.streakNumberBox}>
                <Text style={styles.streakCount}>{streak}</Text>
                <Text style={styles.streakText}>day streak!</Text>
              </View>
            </View>

            <View style={styles.rewardBox}>
              <Text style={styles.rewardText}>
                🎁 You’ve earned a new Streak Society reward!
              </Text>
              <TouchableOpacity>
                <Text style={styles.link}>SEE REWARD</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.calendarHeader}>
            <Text style={styles.month}>February 2025</Text>
            <Text style={styles.good}>GOOD</Text>
          </View>

          <View style={styles.metrics}>
            <Text style={styles.metric}>✅ {streak} Days practiced</Text>
            <Text style={styles.metric}>🎈 0 Freezes used</Text>
          </View>

          <View style={styles.calendarContainer}>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, i) => (
              <Text key={i} style={styles.weekdayText}>
                {day}
              </Text>
            ))}

            {Array.from({ length: 42 }).map((_, index) => {
              const dayNum = index - 4;
              const isActive = dayNum > 0 && dayNum <= 29;
              const isStreak = STREAK_DAYS.includes(dayNum);

              return (
                <View
                  key={index}
                  style={[
                    styles.dayCell,
                    isActive
                      ? isStreak
                        ? styles.streakDay
                        : styles.activeDay
                      : styles.inactiveDay,
                  ]}
                >
                  <Text style={styles.dayText}>{isActive ? dayNum : ""}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    alignItems: "center",
  },
  topTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  tabBar: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    paddingBottom: 10,
    borderBottomColor: "#fff",
    borderBottomWidth: 2,
  },
  activeTab: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
  },
  streakSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  label: {
    backgroundColor: "#FAD02C",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  streakDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  streakFlameLarge: {
    width: 200,
    height: 300,
    resizeMode: "contain",
  },
  streakNumberBox: {
    marginLeft: 20,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  streakCount: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
  streakText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginTop: 4,
  },
  rewardBox: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 10,
    marginTop: 12,
    marginHorizontal: 24,
  },
  rewardText: { color: "#fff", marginBottom: 8 },
  link: { color: "#00BFFF", fontWeight: "bold" },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginTop: 20,
  },
  month: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  good: {
    backgroundColor: "#FAD02C",
    paddingHorizontal: 8,
    borderRadius: 6,
    color: "#000",
  },
  metrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginTop: 10,
  },
  metric: { color: "#fff", fontWeight: "500" },
  calendarContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  weekdayText: {
    width: "14.2857%",
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  dayCell: {
    width: "14.2857%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
    borderRadius: 20,
  },
  dayText: {
    color: "#333",
    fontWeight: "600",
  },
  inactiveDay: {
    backgroundColor: "#999",
  },
  activeDay: { backgroundColor: "#d18b13" },
  streakDay: { backgroundColor: "#fc4c00" },
});

export default StreakScreen;
