import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator, // Importing ActivityIndicator for loading spinner
} from "react-native";
import axios from "axios";

const Register = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // State to manage loading

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return Alert.alert("Error", "Please fill in all fields");
    }

    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords don't match");
    }

    setLoading(true); // Start loading when the user submits the form

    try {
      const response = await axios.post(
        "http://192.168.124.147:5002/api/auth/register",
        { firstName, lastName, email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      Alert.alert(
        "Success",
        response.data.message || "Registration successful"
      );
      navigation.navigate("Login");
    } catch (error) {
      console.error(
        "❌ Registration Error:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false); // Stop loading after the request finishes
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>Register</Text>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {/* Show loading spinner if the request is processing */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#F9A826"
            style={styles.loader}
          />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Login")}
          >
            Sign In
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E3F2FD" },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6C5B7B", // Soft Purple
    textAlign: "center",
  },
  input: {
    width: "90%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 12,
    color: "#333", // Dark text for inputs
  },
  button: {
    width: "90%",
    backgroundColor: "#F9A826", // Golden Yellow
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  footerText: { marginTop: 15, color: "#6C5B7B", textAlign: "center" },
  link: { color: "#01579B", fontWeight: "bold" },
  loader: {
    marginVertical: 20,
  },
});

export default Register;
