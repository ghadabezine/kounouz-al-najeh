import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔥 Flame Streak Icon with navigation
const StreakIcon = ({ navigation }) => {
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          console.warn("⚠️ No token found in AsyncStorage");
          return;
        }

        const response = await fetch(
          "http://192.168.1.56:5005/api/users/get-streak",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const text = await response.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          console.error("❌ Response is not valid JSON:", text);
          return;
        }

        if (response.ok) {
          setStreakCount(data.streak);
        } else {
          console.error(
            "❌ Failed to fetch streak:",
            data.error || response.status
          );
        }
      } catch (err) {
        console.error("❌ Error fetching streak:", err);
      }
    };

    fetchStreak();
  }, []);

  return (
    <TouchableOpacity
      style={styles.streakContainer}
      onPress={() => navigation.navigate("Streak")}
    >
      <Image
        source={require("../assets/flameBox.png")}
        style={styles.streakIcon}
      />
      <Text style={styles.streakText}>{streakCount}</Text>
    </TouchableOpacity>
  );
};

// 📚 Quotes
const quotes = [
  `"Success is the sum of small efforts, repeated day in and day out." – R. Collier`,
  `"The only way to do great work is to love what you do." – Steve Jobs`,
  `"It always seems impossible until it's done." – Nelson Mandela`,
  `"Your time is limited, don't waste it living someone else's life." – Steve Jobs`,
  `"Don't watch the clock; do what it does. Keep going." – Sam Levenson`,
  `"Believe you can and you're halfway there." – Theodore Roosevelt`,
  `"The future belongs to those who believe in the beauty of their dreams." – Eleanor Roosevelt`,
  `"The only limit to our realization of tomorrow is our doubts of today." – Franklin D. Roosevelt`,
  `"Act as if what you do makes a difference. It does." – William James`,
  `"Success is not final, failure is not fatal: It is the courage to continue that counts." – Winston Churchill`,
];
const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState("Student");
  const [isChatVisible, setIsChatVisible] = useState(false);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://192.168.1.56:5005/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok && data.firstName) {
          const fullName = `${data.firstName} ${data.lastName || ""}`.trim();
          setUserName(fullName);
        }
      } catch (err) {
        console.warn("Could not load user name:", err.message);
      }
    };

    fetchUserName();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={28} color="#000" />
          </TouchableOpacity>
          <StreakIcon navigation={navigation} />
        </View>

        {/* Personalized Welcome */}
        <Text style={styles.header}>🎓 Welcome back, {userName}!</Text>

        {/* Quote of the Day */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>"{randomQuote}"</Text>
        </View>

        {/* Section Grid */}
        <Text style={styles.subHeader}>Choose a Section</Text>
        <View style={styles.zigzagGrid}>
          <Section
            icon="book-open-page-variant"
            title="All Courses"
            subtitle="Browse materials"
            onPress={() => navigation.navigate("All Courses")}
            color="#84b6f4"
            alignRight={false}
          />
          <Section
            icon="note-text"
            title="Notes"
            subtitle="Your saved notes"
            onPress={() => navigation.navigate("Note")}
            color="#81c784"
            alignRight={true}
          />
          <Section
            icon="calculator-variant"
            title="GPA Calculator"
            subtitle="Track grades"
            onPress={() => navigation.navigate("GPACalculator")}
            color="#ffd54f"
            alignRight={false}
          />
          <Section
            icon="gamepad-variant"
            title="Daily Game"
            subtitle="Train your brain"
            onPress={() => navigation.navigate("QuickBrainQuiz")}
            color="#e57373"
            alignRight={true}
          />
        </View>
      </ScrollView>

      {/* Chatbot Button */}
      <TouchableOpacity
        style={styles.chatBotIcon}
        onPress={() => setIsChatVisible(!isChatVisible)} // toggle chatbot visibility
      >
        <MaterialCommunityIcons name="message" size={30} color="#fff" />
      </TouchableOpacity>

      {isChatVisible && <ChatBot setIsChatVisible={setIsChatVisible} />}
    </SafeAreaView>
  );
};

// ✅ Section Component (no animation)
const Section = ({ icon, title, subtitle, onPress, color, alignRight }) => {
  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          styles.zigzagCard,
          { backgroundColor: color },
          alignRight ? styles.alignRight : styles.alignLeft,
        ]}
      >
        <MaterialCommunityIcons name={icon} size={40} color="#fff" />
        <View style={styles.cardTextContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </Pressable>
  );
};

// ChatBot Component
const ChatBot = ({ setIsChatVisible }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "👋 Hi! I'm your assistant. Ask me anything." },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://192.168.1.56:5002/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });
      const data = await response.json();
      const reply = data.reply || "Sorry, I couldn't understand that.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.chatBotContainer}
    >
      <View style={styles.chatBotHeader}>
        <Text style={styles.chatBotHeaderText}>Chatbot</Text>
        <TouchableOpacity onPress={() => setIsChatVisible(false)}>
          <Ionicons name="close-circle" size={30} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.message,
              msg.role === "user"
                ? styles.userMessage
                : styles.assistantMessage,
            ]}
          >
            <Text>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask me something..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0EBF8",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333",
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  streakIcon: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  streakText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#F67280",
  },
  quoteContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#ffab91", // Light orange color (unchanged)
    borderRadius: 15,
    width: "85%",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    background:
      "linear-gradient(to right, rgba(255, 126, 95, 0.2), rgba(254, 180, 123, 0.2))", // Applying opacity for fade effect
  },
  quoteText: {
    fontSize: 20,
    color: "#fff",
    fontStyle: "italic",
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 1.2, // Adding spacing for style
  },

  subHeader: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  zigzagGrid: {
    gap: 16,
    marginTop: 10,
  },
  zigzagCard: {
    width: "85%",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  alignLeft: {
    alignSelf: "flex-start",
  },
  alignRight: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  cardTextContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#fff",
    opacity: 0.85,
  },
  // Chatbot icon at bottom
  chatBotIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#6C5B7B",
    borderRadius: 30,
    padding: 15,
    elevation: 10,
  },
  chatBotContainer: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 5,
    maxHeight: 350,
    minHeight: 150,
  },
  chatBotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatBotHeaderText: {
    fontSize: 18,
    fontWeight: "600",
  },
  messagesContainer: {
    flexGrow: 1,
    marginBottom: 10,
  },
  message: {
    marginBottom: 10,
    padding: 8,
    borderRadius: 12,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#84b6f4",
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f5f5f5",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  textInput: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#6C5B7B",
    borderRadius: 50,
    padding: 12,
  },
});

export default HomeScreen;
