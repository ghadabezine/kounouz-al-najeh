import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from './components/Header';
import Footer from './components/Footer';
import UserSection from './components/UserSection';
import HomeSection from './components/HomeSection';
import UserModal from './components/UserModal';
import UserForm from './components/UserForm'; // Import UserForm
import UserList from './components/UserList'; // Import UserList
import './styles/App.css';
import FileDashboard from './components/FileDashboard'; // Import FileDashboard

const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:5000/api/users');
    setUsers(response.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/users/${id}`);
    fetchUsers();
  };

  const handleEdit = (user) => {
    openModal(user);
  };

  const openModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  useEffect(() => {
    if (activePage === 'users') {
      fetchUsers();
    }
  }, [activePage]);

  return (
    <div className="container">
      <Header setActivePage={setActivePage} />

      <main>
        {activePage === 'home' ? <HomeSection /> : <UserSection openModal={openModal} />}

        {activePage === 'home' && (
          <div>
            <h2>Welcome to Kounouz Ennajeh</h2>
            <h3>Explore our platform and discover amazing features.</h3>
          </div>
        )}

        {activePage === 'files' && <FileDashboard />}

        {activePage === 'users' && (
          <div>
            <h1 className="user-management">User Management</h1>
            <button onClick={() => openModal()}>Add User</button>
            <UserList
              users={users}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          </div>
        )}
      </main>

      {isModalOpen && (
        <UserModal closeModal={closeModal}>
          <UserForm
            fetchUsers={fetchUsers}
            editingUser={editingUser}
            setEditingUser={setEditingUser}
            closeModal={closeModal}
          />
        </UserModal>
      )}

      <Footer />
    </div>
  );
};

export default App;