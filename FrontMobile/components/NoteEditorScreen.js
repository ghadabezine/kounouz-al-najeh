import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const NoteEditorScreen = ({ route, navigation }) => {
  const existingNote = route.params?.note;
  const [title, setTitle] = useState(existingNote?.title || "");
  const [content, setContent] = useState(existingNote?.content || "");

  const saveNote = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const method = existingNote ? "PUT" : "POST";
      const url = existingNote
        ? `http://172.20.10.7:5001/api/notes/${existingNote._id}`
        : `http://172.20.10.7:5001/api/notes`;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error("Failed to save note");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const deleteNote = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(
        `http://172.20.10.7:5001/api/notes/${existingNote._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to delete note");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.scrollContainer}>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.titleInput}
        />
        <TextInput
          placeholder="Write your note here..."
          value={content}
          onChangeText={setContent}
          multiline
          style={styles.contentInput}
        />
        <View style={{ marginTop: 20 }}>
          <Button
            title={existingNote ? "Update Note" : "Create Note"}
            onPress={saveNote}
            color="#F67280"
          />
        </View>
        {existingNote && (
          <View style={{ marginTop: 10 }}>
            <Button title="Delete Note" onPress={deleteNote} color="#999" />
          </View>
        )}
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
  },
  titleInput: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    color: "#333",
  },
  contentInput: {
    fontSize: 16,
    height: 200,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    textAlignVertical: "top",
  },
});

export default NoteEditorScreen;
