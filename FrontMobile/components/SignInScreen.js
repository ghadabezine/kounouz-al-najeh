import React, { useState } from "react";
import axios from "axios";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const handleLogin = async () => {
  try {
    const response = await fetch("http://your-backend-url/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      await AsyncStorage.setItem("token", data.token);
      navigation.replace("ProfileScreen"); // Redirect to Profile after login
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("❌ Login error:", error);
  }
};

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Please enter both email and password");
    }

    try {
      const { data } = await axios.post(
        "http://192.168.100.97:5000/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      Alert.alert("Success", data.message || "Logged in successfully");
      console.log("Received Token:", data.token);
      navigation.navigate("HomeScreen");
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Login failed");
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/logoname.png")} // Path to your logo
          style={styles.logo}
        />
      </View>

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
        <Text
          style={styles.link}
          onPress={() => navigation.navigate("Register")}
        >
          Register
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#E3F2FD",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6C5B7B",
  },
  input: {
    width: "90%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  button: {
    width: "90%",
    backgroundColor: "#F9A826",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  footerText: { marginTop: 15, color: "#6C5B7B" },
  link: { color: "#01579B", fontWeight: "bold" },
  logoContainer: {
    width: "100%",
    height: "30%", // Adjust the height for the logo at the top
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20, // Add some space between logo and the form
  },
  logo: {
    width: "100%", // Increase the width of the logo
    height: "170%", // Increase the height proportionally
    resizeMode: "contain", // Ensures the logo scales proportionally
  },
});

export default Login;
