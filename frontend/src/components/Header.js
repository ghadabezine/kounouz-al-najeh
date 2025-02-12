import React from 'react';
import '../styles/Header.css';
import "./UserList";

const Header = ({ setActivePage }) => {
  return (
    <header>
      <h1>Kounouz Ennajeh</h1>
      <nav>
        <ul>
          <li><a onClick={() => setActivePage('home')}>Home</a></li>
          <li><a onClick={() => setActivePage('users')}>Users</a></li>
          <li><a onClick={() => setActivePage('files')}>files</a></li>

        </ul>
      </nav>
    </header>
  );
};

export default Header;
