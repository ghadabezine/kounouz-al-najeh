import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          fetchProfile();
        }
      } catch (error) {
        console.error("❌ Error loading stored user:", error.message);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("❌ No token found in AsyncStorage");
        navigation.replace("Login");
        return;
      }

      console.log("📢 Token retrieved:", token);

      const response = await fetch(
        "http://192.168.8.44:5002/api/auth/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error:", errorText);
        throw new Error(`HTTP status ${response.status}`);
      }

      const data = await response.json();
      console.log("📢 API Response:", data);

      await AsyncStorage.setItem("user", JSON.stringify(data)); // Store user data
      setUser(data);
    } catch (error) {
      console.error("❌ Fetching Profile Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      navigation.replace("SignInScreen");
    } catch (error) {
      console.error("❌ Logout Error:", error.message);
    }
  };

  const handleGoToMoodle = () => {
    Linking.openURL("https://moodle.youruniversity.edu");
  };

  const handleGoToOutlook = () => {
    Linking.openURL("https://outlook.office.com");
  };

  const handleEditProfile = () => {
    if (user) {
      navigation.navigate("EditProfile", { user, setUser });
    } else {
      Alert.alert("Error", "User data is not available.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6C5B7B" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="user-circle" size={80} color="#F9A826" />
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
        <Text style={styles.sectionTitle}>Profile Information</Text>
        <Text style={styles.contactInfo}>Email: {user?.email}</Text>
        <Text style={styles.contactInfo}>
          Student ID: {user?.studentId || "N/A"}
        </Text>
        <Text style={styles.contactInfo}>
          Major: {user?.major || "Not specified"}
        </Text>
      </View>

      <TouchableOpacity onPress={handleGoToMoodle} style={styles.moodleButton}>
        <Icon name="graduation-cap" size={20} color="#fff" />
        <Text style={styles.buttonText}>Go to Moodle</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleGoToOutlook}
        style={styles.outlookButton}
      >
        <Icon name="envelope" size={20} color="#fff" />
        <Text style={styles.buttonText}>Go to Outlook</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Icon name="sign-out" size={20} color="#fff" />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
  },
  header: {
    alignItems: "center",
    marginBottom: 25,
    backgroundColor: "#6C5B7B",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  username: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: "#F9A826",
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: "#F9A826",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  section: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  contactInfo: {
    fontSize: 16,
    color: "#666",
  },
  moodleButton: {
    backgroundColor: "#0077b6",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  outlookButton: {
    backgroundColor: "#0078D4",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: "#6C5B7B",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
});
