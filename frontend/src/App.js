
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from './components/Header';
import Footer from './components/Footer';
import UserSection from './components/UserSection';
import HomeSection from './components/HomeSection';
import UserModal from './components/UserModal';
import './styles/App.css';
import FileDashboard from './components/FileDashboard'; // Import FileDashboard


const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const openModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="container">

      <Header setActivePage={setActivePage} />

      <main>

        {activePage === 'home' ? <HomeSection /> : <UserSection openModal={openModal} />}
      </main>
      <Footer />
      {isModalOpen && <UserModal editingUser={editingUser} closeModal={() => setIsModalOpen(false)} />}

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
