import React from 'react';
import '../styles/Header.css';

const Header = ({ setActivePage, setSelectedSubject }) => {
  const handleSubjectsClick = () => {
    setSelectedSubject(null);       // ✅ Deselect any previously selected subject
    setActivePage('subjects');      // ✅ Navigate to Subjects Dashboard
  };

  return (
    <header>
      <h1>Kounouz Ennajeh</h1>
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
