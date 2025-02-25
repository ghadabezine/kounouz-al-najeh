import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Pressable, Linking } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // For icons

export default function ProfileScreen({ navigation }) {
  const openMoodleAccount = () => {
    Linking.openURL("https://moodle.example.com"); // Replace with actual Moodle URL
  };

  const openOutlookAccount = () => {
    Linking.openURL("https://outlook.office.com"); // Replace with actual Outlook URL
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://placekitten.com/200/200" }} // Placeholder image
          style={styles.profileImage}
        />
        <Text style={styles.username}>John Doe</Text>
        <Text style={styles.email}>johndoe@example.com</Text>
        <TouchableOpacity style={styles.changePicButton}>
          <Text style={styles.changePicText}>Change Profile Picture</Text>
        </TouchableOpacity>
      </View>

      {/* Bio Section */}
      <View style={styles.bioSection}>
        <Text style={styles.bioTitle}>About Me</Text>
        <Text style={styles.bioContent}>
          A passionate developer with an interest in React Native and mobile
          development. Always eager to learn and grow with the latest
          technologies.
        </Text>
      </View>

      {/* Courses Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Courses</Text>
        <TouchableOpacity style={styles.courseButton}>
          <Text style={styles.courseText}>Course 1: React Native Basics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.courseButton}>
          <Text style={styles.courseText}>Course 2: Advanced React Native</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.courseButton}>
          <Text style={styles.courseText}>Course 3: JavaScript for React Native</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Text style={styles.contactInfo}>Phone: +123 456 7890</Text>
        <Text style={styles.contactInfo}>Address: 123 Main St, City</Text>
        <Text style={styles.contactInfo}>Email: johndoe@example.com</Text>
      </View>
      

      {/* External Links Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>External Accounts</Text>
        
        {/* Moodle Link */}
        <Pressable onPress={openMoodleAccount} style={styles.linkButton}>
          <Text style={styles.linkText}>Go to Moodle</Text>
        </Pressable>

        {/* Outlook Link */}
        <Pressable onPress={openOutlookAccount} style={styles.linkButton}>
          <Text style={styles.linkText}>Go to Outlook</Text>
        </Pressable>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={() => navigation.replace("Login")}
        style={styles.logoutButton}
      >
        <Icon name="sign-out" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  username: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 16,
    color: "#777",
    marginBottom: 10,
  },
  changePicButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  changePicText: {
    color: "#fff",
    fontSize: 14,
  },
  bioSection: {
    marginBottom: 30,
  },
  bioTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  bioContent: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  courseButton: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  courseText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  contactInfo: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  linkButton: {
    backgroundColor: "#0078D4", // Outlook blue
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  linkText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#FF6347", // Tomato red
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

