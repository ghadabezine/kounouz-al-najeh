import React from 'react';
import '../styles/Header.css';

const Header = ({ setActivePage }) => {
  return (
    <header>
      <h1>Kounouz</h1>
      <nav>
        <ul>
          <li><a href="#" onClick={() => setActivePage('home')}>Home</a></li>
          <li><a href="#" onClick={() => setActivePage('users')}>Users</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
