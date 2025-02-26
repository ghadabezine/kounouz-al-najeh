import React from 'react';
import logo from '../assets/logo.jpg'; // Import the logo
import '../styles/Header.css';

const Header = ({ setActivePage, setSelectedSubject }) => {
  const handleSubjectsClick = () => {
    setSelectedSubject(null); // Deselect any previously selected subject
    setActivePage('subjects'); // Navigate to Subjects Dashboard
  };

  return (
    <header>
      <div className="header-title">
        <img src={logo} alt="Kounouz Ennajeh Logo" className="header-logo" />
        <h1>Kounouz Ennajeh</h1>
      </div>
      <nav>
        <ul>
          <li><a onClick={() => setActivePage('home')}>Home</a></li>
          <li><a onClick={() => setActivePage('users')}>Users</a></li>
          <li><a onClick={handleSubjectsClick}>Subjects</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;