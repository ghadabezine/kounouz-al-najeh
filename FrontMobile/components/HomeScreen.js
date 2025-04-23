import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";

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
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>

        <Text style={styles.header}>🎓 Welcome back, Student!</Text>

        <Card icon="lightbulb-on-outline" title="Quote of the Day" color="#355C7D">
          <Text style={styles.cardText}>{randomQuote}</Text>
        </Card>

        <Card icon="trending-up" title="Your Progress Tracker" color="#6C5B7B">
          <Text style={styles.cardText}>You're 65% through your current term courses.</Text>
        </Card>

        <Card icon="calendar-check" title="Attendance Overview" color="#355C7D">
          <Text style={styles.cardText}>Average attendance: 88%. Keep it up!</Text>
        </Card>

        <Card icon="timeline-clock" title="Term Timeline" color="#F67280">
          <Text style={styles.cardText}>Week 11 of 12 • Midterms Done • 1 Weeks to Finals</Text>
        </Card>

        <Card icon="gamepad-variant" title="Daily Challenge" color="#F8B195">
          <Text style={styles.cardText}>🧠 Solve 3 case-based MCQs before 10PM!</Text>
          <TouchableOpacity
            style={styles.challengeBtn}
            onPress={() => navigation.navigate("QuickBrainQuiz")}
          >
            <Text style={{ color: "#fff" }}>Start Challenge</Text>
          </TouchableOpacity>
        </Card>

        <Card icon="calculator-variant" title="GPA Calculator" color="#6C5B7B">
          <TouchableOpacity onPress={() => navigation.navigate("GPACalculator")}>
            <Text style={styles.link}>Tap to calculate your GPA →</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>

      <ChatBot />
    </SafeAreaView>
  );
};

const Card = ({ icon, title, children, color }) => (
  <View style={[styles.card, { borderLeftColor: color }]}> 
    <View style={styles.cardHeader}>
      <MaterialCommunityIcons name={icon} size={24} color={color} />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <View>{children}</View>
  </View>
);

const ChatBot = () => {
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "👋 Hi! I'm your assistant. Ask me anything." },
  ]);
  const [loading, setLoading] = useState(false);
  const [showTip, setShowTip] = useState(true);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://192.168.100.7:5002/chat", {
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
    <TouchableWithoutFeedback
      onPress={() => {
        setShowTip(false);
        Keyboard.dismiss();
      }}
    >
      <>
        {showTip && (
          <View style={styles.chatTip}>
            <MaterialIcons name="smart-toy" size={24} color="#6C5B7B" />
            <Text style={styles.chatTipText}>Need help?</Text>
            <TouchableOpacity onPress={() => setShowTip(false)}>
              <Text style={styles.chatTipClose}>✖</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.chatIcon}
          onPress={() => setVisible(true)}
        >
          <Feather name="message-circle" size={24} color="#fff" />
        </TouchableOpacity>

        <Modal visible={visible} transparent animationType="slide">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.chatModal}
          >
            <View style={styles.chatBox}>
              <ScrollView style={{ flex: 1 }}>
                {messages.map((msg, i) => (
                  <Text
                    key={i}
                    style={{
                      padding: 8,
                      marginVertical: 4,
                      backgroundColor: msg.role === "user" ? "#DCF8C6" : "#EEE",
                      alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                      borderRadius: 8,
                      maxWidth: "80%",
                    }}
                  >
                    {msg.text}
                  </Text>
                ))}
                {loading && <ActivityIndicator size="small" color="#6C5B7B" />}
              </ScrollView>

              <View style={styles.chatInputRow}>
                <TextInput
                  value={input}
                  onChangeText={setInput}
                  placeholder="Ask me anything..."
                  style={styles.chatInput}
                />
                <TouchableOpacity onPress={sendMessage}>
                  <Feather name="send" size={20} color="#6C5B7B" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setVisible(false)}>
                  <Text style={{ color: "red", marginLeft: 10 }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </>
    </TouchableWithoutFeedback>
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
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#F67280",
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    color: "#333",
  },
  cardText: {
    fontSize: 16,
    color: "#333",
  },
  link: {
    color: "#007bff",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  challengeBtn: {
    marginTop: 10,
    backgroundColor: "#F67280",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  chatIcon: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#6C5B7B",
    padding: 14,
    borderRadius: 30,
    elevation: 5,
    zIndex: 999,
  },
  chatTip: {
    position: "absolute",
    bottom: 85,
    right: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 999,
    elevation: 3,
  },
  chatTipText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 5,
  },
  chatTipClose: {
    marginLeft: 10,
    fontSize: 16,
    color: "#999",
    fontWeight: "bold",
  },
  chatModal: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  chatBox: {
    backgroundColor: "#fff",
    height: "60%",
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  chatInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
  },
});

export default HomeScreen;