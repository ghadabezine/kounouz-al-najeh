import React, { useEffect, useState } from "react";
import axios from "axios";
import './FileDashboard.css';

const FileDashboard = ({ subject, goBack }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [editingFile, setEditingFile] = useState(null);
  const [newFilename, setNewFilename] = useState("");

  useEffect(() => {
    if (subject) fetchFiles();
  }, [subject]);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/files/subject/${subject._id}`);
      setFiles(res.data);
    } catch (err) {
      console.error("❌ Error fetching files:", err);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("❌ Please select a file.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subjectId", subject._id);

    try {
      const res = await axios.post("http://localhost:5001/api/files/upload", formData);
      if (res.status === 201) {
        setMessage("✅ File uploaded successfully!");
        setFile(null);
        fetchFiles(); // Refresh files after upload
      } else {
        setMessage("❌ Upload failed.");
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      setMessage("❌ Upload error.");
    }
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(`http://localhost:5001/api/files/${filename}`);
      alert("✅ File deleted!");
      fetchFiles();
    } catch (err) {
      console.error("❌ Error deleting file:", err);
    }
  };

  const handleEdit = (file) => {
    setEditingFile(file._id);
    setNewFilename(file.filename);
  };

  const handleUpdateFilename = async () => {
    if (!newFilename.trim()) {
      alert("❌ Filename cannot be empty.");
      return;
    }

    try {
      await axios.patch(`http://localhost:5001/api/files/${editingFile}`, { newFilename });
      alert("✅ Filename updated!");
      setEditingFile(null);
      fetchFiles();
    } catch (err) {
      console.error("❌ Error updating filename:", err);
      alert("❌ Failed to update filename.");
    }
  };

  return (
    <div className="upload-container">
      <h2 className="title">{subject.name}</h2>

      <form onSubmit={handleUpload} className="form">
        <input type="file" onChange={handleFileChange} className="input-file" />
        <div className="button-group">
          <button type="submit" className="button">Upload</button>
          <button type="button" onClick={goBack} className="button-secondary">Back</button>
        </div>
      </form>

      {message && <p className="message">{message}</p>}

      <h3>Existing Files:</h3>
      {files.length > 0 ? (
        <ul className="file-list">
          {files.map((file) => (
            <li key={file._id} className="file-item">
              {editingFile === file._id ? (
                <>
                  <input
                    type="text"
                    value={newFilename}
                    onChange={(e) => setNewFilename(e.target.value)}
                  />
                  <div className="button-container">
                    <button className="save-btn" onClick={handleUpdateFilename}>Save</button>
                    <button className="cancel-btn" onClick={() => setEditingFile(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <a
                    href={`http://localhost:5001/api/files/${file._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.filename}
                  </a>
                  <div className="button-container">
                    <button className="edit-btn" onClick={() => handleEdit(file)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(file.filename)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No files uploaded for this subject.</p>
      )}
    </div>
  );
};

export default FileDashboard;
