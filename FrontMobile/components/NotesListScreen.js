import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const NotesListScreen = () => {
  const [notes, setNotes] = useState([]);
  const navigation = useNavigation();

  const fetchNotes = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch("http://172.20.10.7:5001/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Error fetching notes:", err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchNotes);
    return unsubscribe;
  }, [navigation]);

  const renderNote = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("NoteEditor", { note: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.scrollContainer}>
        <TouchableOpacity
          style={styles.challengeBtn}
          onPress={() => navigation.navigate("NoteEditor")}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>+ Add Note</Text>
        </TouchableOpacity>
        <FlatList
          data={notes}
          renderItem={renderNote}
          keyExtractor={(item) => item._id}
        />
      </View>
    </SafeAreaView>
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
  challengeBtn: {
    marginBottom: 20,
    backgroundColor: "#F67280",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default NotesListScreen;
