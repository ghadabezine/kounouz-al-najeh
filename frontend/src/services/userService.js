import React, { useEffect, useState } from "react";
import axios from "axios";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import "./App.css";

const App = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // Track the user being edited

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
<<<<<<< HEAD
    const response = await axios.get("http://localhost:5005/api/users");
=======
    const response = await axios.get("http://localhost:5002/api/users");
>>>>>>> f603a2515574303b1ebbf32af460cfd4a61be625
    setUsers(response.data);
  };

  const handleDelete = async (id) => {
<<<<<<< HEAD
    await axios.delete(`http://localhost:5005/api/users/${id}`);
=======
    await axios.delete(`http://localhost:5002/api/users/${id}`);
>>>>>>> f603a2515574303b1ebbf32af460cfd4a61be625
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditingUser(user); // Set the user to be edited in the form
  };

  return (
    <div className="container">
      <h1>User Management</h1>
      <UserForm
        fetchUsers={fetchUsers}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
      />
      <UserList
        users={users}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    </div>
  );
};

export default App;
