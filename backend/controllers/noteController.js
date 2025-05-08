const Note = require("../models/Note");

exports.createNote = async (req, res) => {
  const { title, content } = req.body;

  try {
    // Create a new note
    const newNote = new Note({
      title,
      content,
      userId: req.user.id, // The user ID from the protected middleware
    });

    await newNote.save(); // Save the note to the database
    res.status(201).json(newNote); // Respond with the created note
  } catch (err) {
    console.error("Error creating note:", err.message);
    res.status(400).json({ error: err.message }); // Handle any errors
  }
};
