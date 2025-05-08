import React, { useState, useEffect } from "react";
import axios from "axios";

const UserForm = ({ fetchUsers, editingUser, setEditingUser }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (editingUser) {
      setForm(editingUser); // Populate form when editing
    }
  }, [editingUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingUser) {
      // Update user
      await axios.put(
<<<<<<< HEAD
        `http://localhost:5005/api/users/${editingUser._id}`,
=======
        `http://localhost:5002/api/users/${editingUser._id}`,
>>>>>>> f603a2515574303b1ebbf32af460cfd4a61be625
        form
      );
      setEditingUser(null); // Reset editing mode
    } else {
      // Add new user
<<<<<<< HEAD
      await axios.post("http://localhost:5005/api/users", form);
=======
      await axios.post("http://localhost:5002/api/users", form);
>>>>>>> f603a2515574303b1ebbf32af460cfd4a61be625
    }
    setForm({ firstName: "", lastName: "", email: "", password: "" });
    fetchUsers();
  };

  return (
    <form onSubmit={handleSubmit} className="form">
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
        required
      />
      <button type="submit">{editingUser ? "Update User" : "Add User"}</button>
    </form>
  );
};

export default UserForm;
