// frontend/src/components/UserForm.js
import React, { useState } from "react";
import axios from "axios";

const UserForm = ({ fetchUsers }) => {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/users", form);
    fetchUsers();
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
      <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Add User</button>
    </form>
  );
};

export default UserForm;