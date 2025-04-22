import React from 'react';
import '../styles/Header.css';

const Header = ({ 
    activePage, 
    setActivePage, 
    selectedSubject, 
    setSelectedSubject, 
    selectedChapter, 
    setSelectedChapter,
    isDarkMode,
    toggleDarkMode,
    onLogout 
}) => {
    const handleBack = () => {
        if (activePage === 'quizzes') {
            setSelectedChapter(null);
            setActivePage('chapters');
        } else if (activePage === 'chapters') {
            setSelectedSubject(null);
            setActivePage('subjects');
        } else {
            setActivePage('home');
        }
    };

    return (
        <header className="header">
            <div className="header-left">
                <h1 className="header-title">Kounouz Al Najeh</h1>
                {activePage !== 'home' && (
                    <button className="back-button" onClick={handleBack}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Back
                    </button>
                )}
            </div>
            <nav>
                <ul>
                    <li>
                        <a 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); setActivePage('home'); }}
                            className={activePage === 'home' ? 'active' : ''}
                        >
                            Home
                        </a>
                    </li>
                    <li>
                        <a 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); setActivePage('subjects'); }}
                            className={activePage === 'subjects' ? 'active' : ''}
                        >
                            Subjects
                        </a>
                    </li>
                    <li>
                        <a 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); setActivePage('users'); }}
                            className={activePage === 'users' ? 'active' : ''}
                        >
                            Users
                        </a>
                    </li>
                    <li>
                        <a 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); setActivePage('statistics'); }}
                            className={activePage === 'statistics' ? 'active' : ''}
                        >
                            Statistics
                        </a>
                    </li>
                </ul>
            </nav>
            <div className="header-right">
                <button className="dark-mode-toggle" onClick={toggleDarkMode}>
                    {isDarkMode ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5"/>
                            <line x1="12" y1="1" x2="12" y2="3"/>
                            <line x1="12" y1="21" x2="12" y2="23"/>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                            <line x1="1" y1="12" x2="3" y2="12"/>
                            <line x1="21" y1="12" x2="23" y2="12"/>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                    )}
                </button>
                <div className="profile-section">
                    <div className="profile-picture">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                    </div>
                    <button className="logout-button" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;