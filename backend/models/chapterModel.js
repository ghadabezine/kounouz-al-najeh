const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  // Add other chapter-specific fields here if needed
});

module.exports = mongoose.model('Chapter', chapterSchema);
