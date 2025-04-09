import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProfileScreen = ({ navigation, route }) => {
  const { user, setUser } = route.params; // ✅ Get setUser from params
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch("http://192.168.54.241:5001/api/auth/updateProfile", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updatedUser = { firstName, lastName, email };

      // ✅ Store updated user data in AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      // ✅ Immediately update ProfileScreen
      setUser(updatedUser);

      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="First Name" />
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Last Name" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />

      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#F9A826",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default EditProfileScreen;
