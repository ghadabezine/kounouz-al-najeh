const Chapter = require('../models/Chapter');
const Subject = require('../models/Subject');

// Get all chapters for a subject
exports.getChaptersBySubject = async (req, res) => {
  try {
    const chapters = await Chapter.find({ subject: req.params.subjectId });
    if (!chapters || chapters.length === 0) {
      return res.status(200).json([]);
    }
    res.json(chapters);
  } catch (error) {
    console.error('Error fetching chapters:', error);
    res.status(500).json({ error: 'Error fetching chapters', details: error.message });
  }
};

// Get a single chapter by ID
exports.getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    res.json(chapter);
  } catch (error) {
    console.error('Error fetching chapter:', error);
    res.status(500).json({ error: 'Error fetching chapter', details: error.message });
  }
};

// Create a new chapter
exports.createChapter = async (req, res) => {
  try {
    const { name, subject } = req.body;

    if (!name || !subject) {
      return res.status(400).json({ error: 'Name and subject are required' });
    }

    // Check if subject exists
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const newChapter = new Chapter({ name, subject });
    const savedChapter = await newChapter.save();

    // Add chapter to subject's chapters array
    subjectExists.chapters.push(savedChapter._id);
    await subjectExists.save();

    res.status(201).json(savedChapter);
  } catch (error) {
    console.error('Error creating chapter:', error);
    res.status(500).json({ error: 'Error creating chapter', details: error.message });
  }
};

// Update a chapter
exports.updateChapter = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    res.json(chapter);
  } catch (error) {
    console.error('Error updating chapter:', error);
    res.status(500).json({ error: 'Error updating chapter', details: error.message });
  }
};

// Delete a chapter
exports.deleteChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    // Remove chapter from subject's chapters array
    await Subject.findByIdAndUpdate(
      chapter.subject,
      { $pull: { chapters: chapter._id } }
    );

    await Chapter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    res.status(500).json({ error: 'Error deleting chapter', details: error.message });
  }
};
