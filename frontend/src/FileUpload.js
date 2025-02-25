import { useState, useEffect } from "react";
import axios from "axios";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

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
      await axios.post("http://localhost:5001/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully!");
      fetchFiles(); // Refresh file list
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  // Fetch Files
  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5001/files");
      setFiles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete File
  const deleteFile = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/file/${id}`);
      alert("File deleted!");
      fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h2>Upload File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload</button>

      <h2>Uploaded Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file._id}>
            <a href={`http://localhost:5001/file/${file.filename}`} target="_blank" rel="noopener noreferrer">
              {file.filename}
            </a>
            <button onClick={() => deleteFile(file._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileUpload;
