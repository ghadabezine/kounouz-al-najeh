import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import UserSection from './components/UserSection';
import HomeSection from './components/HomeSection';
import UserModal from './components/UserModal';
import './styles/App.css';

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
    </div>
  );
};

export default App;
