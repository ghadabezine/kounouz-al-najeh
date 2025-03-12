import React from "react";
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
import Icon from "react-native-vector-icons/FontAwesome"; // For icons

export default function ProfileScreen({ navigation }) {
  const openMoodleAccount = () => {
    Linking.openURL("https://moodle.medtech.tn"); // Replace with actual Moodle URL
  };

  const openOutlookAccount = () => {
    Linking.openURL("https://outlook.office.com"); // Replace with actual Outlook URL
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: "FrontMobile/assets/Snapseed.jpg" }} // Placeholder image
          style={styles.profileImage}
        />
        <Text style={styles.username}>Mahdi Ksila</Text>
        <Text style={styles.email}>Mahdi.Ksila@Medtech.tn</Text>
        <TouchableOpacity style={styles.changePicButton}>
          <Text style={styles.changePicText}>Change Profile Picture</Text>
        </TouchableOpacity>
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
          <Text style={styles.courseText}>
            Course 3: JavaScript for React Native
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Text style={styles.contactInfo}>Phone: +216 23 564 345</Text>
        <Text style={styles.contactInfo}>Address: LAC 2 , recidence urile</Text>
        <Text style={styles.contactInfo}>Email:Mahdi.ksila@medtech.tn</Text>
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
    backgroundColor: "#E8E8E8", // Background matching HomeScreen
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#6C5B7B", // Soft purple background for header
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
    color: "#fff", // White for username to contrast with the soft purple
  },
  email: {
    fontSize: 16,
    color: "#F9A826", // Golden yellow for email
    marginBottom: 10,
  },
  changePicButton: {
    backgroundColor: "#F9A826", // Golden yellow for button
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
    color: "#6C5B7B", // Soft purple for section title
    marginBottom: 10,
  },
  bioContent: {
    fontSize: 16,
    color: "#333", // Standard text color
    lineHeight: 24,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6C5B7B", // Soft purple for section titles
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
    color: "#6C5B7B", // Soft purple for course names
    fontWeight: "bold",
  },
  contactInfo: {
    fontSize: 16,
    color: "#333", // Standard text color for contact info
    marginBottom: 10,
  },
  linkButton: {
    backgroundColor: "#F9A826", // Golden yellow for link buttons
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  linkText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#6C5B7B", // Soft purple for logout button
    paddingVertical: 12,
    paddingHorizontal: 20,
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
