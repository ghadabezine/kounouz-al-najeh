import React from 'react';
import '../styles/Footer.css';
import logo from '../assets/logo.jpg';

const Footer = ({ isDarkMode }) => {
  return (
    <footer className={isDarkMode ? 'dark-mode' : ''}>
      <div className="footer-content">
        <div className="footer-brand">
          <img src={logo} alt="Kounouz Al Najeh Logo" className="footer-logo" />
          <div className="footer-text">
            <h3>Kounouz Al Najeh</h3>
            <p>Empowering Education</p>
          </div>
        </div>
        <div className="footer-info">
          <p>&copy; {new Date().getFullYear()} Kounouz Al Najeh. All rights reserved.</p>
          <p>MedTech</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
