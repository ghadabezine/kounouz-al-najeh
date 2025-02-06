import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Logging in with:", email, password);
  };

  // Animated circle motion
  const translateY = new Animated.Value(0);
  Animated.loop(
    Animated.sequence([
      Animated.timing(translateY, {
        toValue: 20,
        duration: 4000,
        useNativeDriver: true, // Ensure you use the native driver
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 4000,
        useNativeDriver: true,
      }),
    ])
  ).start();

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, { transform: [{ translateY }] }]} />

      <Text style={styles.header}>Kounouz Al Najah</Text>
      <Text style={styles.subHeader}>Welcome Back!</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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

      <Text style={styles.registerText}>
        Don't have an account?{" "}
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
    backgroundColor: "#E3F2FD", // Replaced gradient with solid background
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A237E",
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 16,
    color: "#1A237E",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 15,
    color: "#fff",
    marginBottom: 15,
  },
  button: {
    width: "90%",
    backgroundColor: "#01579B",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerText: {
    color: "#fff",
    marginTop: 10,
  },
  link: {
    color: "#D50000",
    fontWeight: "bold",
  },
  circle: {
    width: 150,
    height: 150,
    backgroundColor: "#fff",
    borderRadius: 75,
    position: "absolute",
    top: 80,
    opacity: 0.1,
  },
});

export default Login;
