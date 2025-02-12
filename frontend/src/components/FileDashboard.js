import React, { useEffect, useState } from "react";
import axios from "axios";
import './FileDashboard.css';  

const FileDashboard = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingFile, setEditingFile] = useState(null); 
  const [newFilename, setNewFilename] = useState(""); 

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/files");
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post("http://localhost:5000/api/files/upload", formData);
      alert("File uploaded successfully!");
      setSelectedFile(null);
      fetchFiles();
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Upload failed");
    }
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(`http://localhost:5000/api/files/${filename}`);
      alert("File deleted!");
      fetchFiles();
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  const handleEdit = (file) => {
    setEditingFile(file.filename);
    setNewFilename(file.filename);
  };

  const handleUpdateFilename = async () => {
    if (!newFilename.trim()) {
      alert("Filename cannot be empty.");
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/api/files/${editingFile}`, { newFilename });
      alert("Filename updated!");
      setEditingFile(null);
      fetchFiles();
    } catch (err) {
      console.error("Error updating filename:", err);
      alert("Failed to update filename");
    }
  };

  return (
    <div >
      <h2>Upload File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      <h2>Uploaded Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file._id} className="file-item">
            {editingFile === file.filename ? (
              <>
                <input type="text" value={newFilename} onChange={(e) => setNewFilename(e.target.value)} />
                <button onClick={handleUpdateFilename}>Save</button>
                <button onClick={() => setEditingFile(null)}>Cancel</button>
              </>
            ) : (
              <>
                <a href={`http://localhost:5000/api/files/${file.filename}`} target="_blank">{file.filename}</a>
                <div className="button-container">
                <button class="edit-btn" onClick={() => handleEdit(file)}>Edit</button>
                <button onClick={() => handleDelete(file.filename)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileDashboard;
