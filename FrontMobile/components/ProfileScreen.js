import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          navigation.replace("Login"); // Redirect to login if no token
          return;
        }

        const response = await fetch(
          "http://your-backend-url/api/auth/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          console.error("Failed to fetch user data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: "https://placekitten.com/200/200" }} // Placeholder
          style={styles.profileImage}
        />
        <Text style={styles.username}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Text style={styles.contactInfo}>Email: {user?.email}</Text>
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Icon name="sign-out" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8E8E8", padding: 20 },
  header: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#6C5B7B",
    padding: 20,
    borderRadius: 10,
  },
  profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  username: { fontSize: 26, fontWeight: "bold", color: "#fff" },
  email: { fontSize: 16, color: "#F9A826", marginBottom: 10 },
  logoutButton: {
    backgroundColor: "#6C5B7B",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
