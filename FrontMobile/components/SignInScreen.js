import React, { useState } from "react";
import axios from "axios";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Please enter both email and password");
    }

    try {
      const { data } = await axios.post(
        "http://192.168.100.97:5000/api/auth/login", // ✅ Correct POST endpoint
        { email, password }, // ✅ Send credentials in POST body
        { headers: { "Content-Type": "application/json" } }
      );

      Alert.alert("Success", data.message || "Logged in successfully");
      console.log("Received Token:", data.token);
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Login failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don’t have an account?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
          Register
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#E3F2FD" },
  header: { fontSize: 26, fontWeight: "bold", marginBottom: 20, color: "#1A237E" },
  input: { width: "90%", height: 50, backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 15, marginBottom: 12 },
  button: { width: "90%", backgroundColor: "#01579B", paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  footerText: { marginTop: 15, color: "#1A237E" },
  link: { color: "#D50000", fontWeight: "bold" },
});

export default Login;
