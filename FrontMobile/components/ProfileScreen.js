import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Linking,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ProfileScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedImage = await AsyncStorage.getItem("profileImage");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          fetchProfile();
        }

        if (storedImage) {
          setImage(storedImage);
        }
      } catch (error) {
        console.error("Error loading data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      saveImageLocally(imageUri);
    }
  };

  const saveImageLocally = async (uri) => {
    try {
      setUploading(true);
      const filename = uri.split("/").pop();
      const localUri = FileSystem.documentDirectory + filename;

      await FileSystem.copyAsync({
        from: uri,
        to: localUri,
      });

      await AsyncStorage.setItem("profileImage", localUri);
      setImage(localUri);
      setUploading(false);
    } catch (error) {
      console.error("Error saving image:", error);
      setUploading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return navigation.replace("Login");

<<<<<<< HEAD
      const res = await fetch("http://192.168.1.56:5005/api/auth/profile", {
=======
      const res = await fetch("http://192.168.1.56:5002/api/auth/profile", {
>>>>>>> f603a2515574303b1ebbf32af460cfd4a61be625
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);

      const data = await res.json();
      await AsyncStorage.setItem("user", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.error("Fetch profile error:", error.message);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["token", "user", "profileImage"]);
    navigation.replace("SignInScreen");
  };

  const handleEditProfile = () => {
    if (user) navigation.navigate("EditProfile", { user, setUser });
    else Alert.alert("Error", "User data not available.");
  };

  const openLink = (url) => Linking.openURL(url);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6C5B7B" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            {uploading ? (
              <ActivityIndicator size="large" color="#6C5B7B" />
            ) : (
              <Image
                source={
                  image
                    ? { uri: image }
                    : require("../assets/default-avatar.png")
                }
                style={styles.avatar}
              />
            )}
            <Text style={styles.editText}>Tap to change photo</Text>
          </TouchableOpacity>

          <View style={styles.info}>
            <Text style={styles.nameText}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.email}>{user?.email}</Text>
            <Text style={styles.detail}>
              Student ID: {user?.studentId || "N/A"}
            </Text>
            <Text style={styles.detail}>Major: {user?.major || "N/A"}</Text>
          </View>

          <TouchableOpacity
            onPress={handleEditProfile}
            style={styles.editProfileButton}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={() => openLink("https://moodle.youruniversity.edu")}
            style={styles.moodleButton}
          >
            <Icon name="graduation-cap" size={20} color="#fff" />
            <Text style={styles.buttonText}>Go to Moodle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openLink("https://outlook.office.com")}
            style={styles.outlookButton}
          >
            <Icon name="envelope" size={20} color="#fff" />
            <Text style={styles.buttonText}>Go to Outlook</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Icon name="sign-out" size={20} color="#fff" />
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0EBF8",
  },
  container: {
    padding: 24,
    alignItems: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "#6C5B7B",
  },
  editText: {
    marginTop: 8,
    color: "#F9A826",
    fontSize: 14,
    fontWeight: "600",
  },
  info: {
    marginTop: 20,
    alignItems: "center",
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6C5B7B",
  },
  email: {
    fontSize: 16,
    color: "#444",
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    color: "#666",
  },
  editProfileButton: {
    marginTop: 20,
    backgroundColor: "#6C5B7B",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  editProfileText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonsContainer: {
    width: "100%",
  },
  moodleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6C5B7B",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    justifyContent: "center",
  },
  outlookButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9A826",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    justifyContent: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E74C3C",
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
});
