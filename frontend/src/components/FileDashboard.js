import React, { useEffect, useState } from "react";
import axios from "axios";

const FileDashboard = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch files
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

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Upload File
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post("http://localhost:5000/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully!");
      setSelectedFile(null);
      fetchFiles();
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Upload failed");
    }
  };

  // Delete File
  const handleDelete = async (filename) => {
    try {
      await axios.delete(`http://localhost:5000/api/files/${filename}`);
      alert("File deleted!");
      fetchFiles();
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  return (
    <div>
      <h2>Upload File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      <h2>Uploaded Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file._id}>
            <a href={`http://localhost:5000/api/files/${file.filename}`} target="_blank" rel="noopener noreferrer">
              {file.filename}
            </a>
            <button onClick={() => handleDelete(file.filename)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileDashboard;
