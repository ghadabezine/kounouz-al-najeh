import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);


  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("❌ No token found in AsyncStorage");
        navigation.replace("Login");
        return;
      }

      console.log("📢 Token retrieved:", token); // ✅ Debug: Ensure token is retrieved

      const response = await fetch("http://192.168.54.241:5001/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error:", errorText); // ✅ Debug: Log full API response
        throw new Error(`HTTP status ${response.status}`);
      }

      const data = await response.json();
      console.log("📢 API Response:", data); // ✅ Debug: Log parsed response

      setUser(data);
    } catch (error) {
      console.error("❌ Fetching Profile Error:", error.message);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        fetchProfile(); // Fetch if not stored
      }
    };
    loadUser();
  }, []);
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login");
  };

  const handleEditProfile = () => {
    if (user) {
      navigation.navigate("EditProfile", { user, setUser }); // ✅ Pass setUser
    } else {
      Alert.alert("Error", "User data is not available.");
    }
  };


  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: user?.profileImage || "https://placekitten.com/200/200" }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>

        <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
          <Icon name="pencil" size={16} color="#fff" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
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
  editButton: {
    backgroundColor: "#F9A826",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  section: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  contactInfo: { fontSize: 16, color: "#333" },
  logoutButton: {
    backgroundColor: "#6C5B7B",
    paddingVertical: 12,
    borderRadius: 10,
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
