import React, { useState, useEffect } from "react";
import axios from "axios";
import UserList from "./UserList";
import React, { useState, useEffect } from "react";
import axios from "axios";
import UserList from "./UserList";

const UserSection = ({ openModal }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await axios.get("http://localhost:5005/api/users");
    setUsers(data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5005/api/users/${id}`);
    fetchUsers();
  };

  return (
    <section>
      <h1 className="user-management">User Management</h1>
      <button className="add-user-btn" onClick={() => openModal()}>
        Add User
      </button>
      <UserList
        users={users}
        handleDelete={handleDelete}
        handleEdit={openModal}
      />
      <button className="add-user-btn" onClick={() => openModal()}>
        Add User
      </button>
      <UserList
        users={users}
        handleDelete={handleDelete}
        handleEdit={openModal}
      />
    </section>
  );
};

export default UserSection;
