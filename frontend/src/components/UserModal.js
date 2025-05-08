import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/UserModal.css";

const UserModal = ({
  editingUser,
  closeModal,
  fetchUsers,
  setEditingUser,
  isDarkMode,
}) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (editingUser) {
      setForm({
        firstName: editingUser.firstName || "",
        lastName: editingUser.lastName || "",
        email: editingUser.email || "",
        password: "", // Always blank for security
      });
    } else {
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      (!editingUser && !form.password)
    ) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      const userData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
      };

      if (!editingUser) {
        userData.password = form.password; // Only for new users
      }

      if (editingUser) {
        await axios.put(
<<<<<<< HEAD
          `http://localhost:5005/api/users/${editingUser._id}`,
=======
          `http://localhost:5002/api/users/${editingUser._id}`,
>>>>>>> f603a2515574303b1ebbf32af460cfd4a61be625
          userData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
<<<<<<< HEAD
        await axios.post("http://localhost:5005/api/users", userData, {
=======
        await axios.post("http://localhost:5002/api/users", userData, {
>>>>>>> f603a2515574303b1ebbf32af460cfd4a61be625
          headers: { "Content-Type": "application/json" },
        });
      }

      if (typeof fetchUsers === "function") fetchUsers();
      if (typeof setEditingUser === "function") setEditingUser(null);
      closeModal();
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
      alert(`Error: ${error.response?.data?.error || "Failed to submit form"}`);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{ color: "black" }}>
          {editingUser ? "Edit User" : "Add User"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required={!editingUser}
            autoComplete="new-password"
          />
          <div className="modal-buttons">
            <button type="submit">{editingUser ? "Update" : "Add"}</button>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
