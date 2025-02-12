
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Footer from './components/Footer';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import './styles/App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // Track the user being edited
  const [activePage, setActivePage] = useState('home'); // Track the active page

  useEffect(() => {
    if (activePage === 'users') {
      fetchUsers();
    }
  }, [activePage]);

  const fetchUsers = async () => {
    const response = await axios.get("http://localhost:5000/api/users");
    setUsers(response.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/users/${id}`);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditingUser(user); // Set the user to be edited in the form
  };

  return (
    <div className="container">
      <Header setActivePage={setActivePage} />
      <main>
        {activePage === 'home' && (
          <div>
            <h2>Welcome to Koumouz</h2>
            <p>Explore our platform and discover amazing features.</p>
          </div>
        )}

        {activePage === 'users' && (
          <div>
            <h1 className="user-management">User Management</h1>
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
        )}
      </main>
      <Footer />

    </div>
  );
};

export default App;
