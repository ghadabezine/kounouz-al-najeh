import { useState, useEffect } from "react";
import axios from "axios";

function FileUpload({ chapter, goBack }) {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [editingFile, setEditingFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");

  // Handle File Selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload File
  const uploadFile = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `http://localhost:5005/api/chapters/${chapter._id}/files`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("File uploaded successfully!");
      fetchFiles();
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  // Fetch Files
  const fetchFiles = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5005/api/chapters/${chapter._id}/files`
      );
      setFiles(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert(
        "Failed to fetch files: " +
          (err.response?.data?.error || "Unknown error")
      );
    }
  };

  // Delete File
  const deleteFile = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await axios.delete(`http://localhost:5005/api/files/${fileId}`);
      alert("File deleted successfully!");
      fetchFiles();
    } catch (err) {
      console.error("Delete error:", err);
      alert(
        "Failed to delete file: " +
          (err.response?.data?.error || "Unknown error")
      );
    }
  };

  // Edit File
  const handleEditFile = (file) => {
    setEditingFile(file);
    setNewFileName(file.filename);
  };

  // Save Edited File
  const saveEditedFile = async () => {
    if (!newFileName.trim()) {
      alert("Please enter a file name");
      return;
    }

    try {
      await axios.put(`http://localhost:5005/api/files/${editingFile._id}`, {
        filename: newFileName,
      });
      alert("File name updated successfully!");
      setEditingFile(null);
      setNewFileName("");
      fetchFiles();
    } catch (err) {
      console.error("Update error:", err);
      alert(
        "Failed to update filename: " +
          (err.response?.data?.error || "Unknown error")
      );
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [chapter._id]);

  return (
    <div className="file-upload-container">
      <div className="header">
        <button onClick={goBack} className="back-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Chapters
        </button>
        <h1>Files for {chapter.name}</h1>
      </div>

      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadFile} className="action-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload File
        </button>
      </div>

      <div className="files-list">
        <h2>Uploaded Files</h2>
        {files.length > 0 ? (
          <div className="files-grid">
            {files.map((file) => (
              <div key={file._id} className="file-card">
                <div className="file-info">
                  <a
                    href={`http://localhost:5005/api/files/${file._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.filename}
                  </a>
                </div>
                <div className="file-actions">
                  <button
                    onClick={() => handleEditFile(file)}
                    className="icon-button edit"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteFile(file._id)}
                    className="icon-button delete"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>

      {editingFile && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit File Name</h2>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Enter new file name"
              autoFocus
            />
            <div className="modal-actions">
              <button onClick={saveEditedFile} className="action-button">
                Save
              </button>
              <button
                onClick={() => {
                  setEditingFile(null);
                  setNewFileName("");
                }}
                className="action-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
