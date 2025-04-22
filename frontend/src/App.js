import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Footer from './components/Footer';
import QuizForm from './components/QuizForm';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import FileDashboard from './components/FileDashboard';
import ViewQuizzes from './components/ViewQuizzes';
import Dashboard from "./components/SubjectsDashboard";
import ChapterList from "./components/ChapterList";
import Login from "./components/Login";
import UserModal from './components/UserModal';
import Statistics from './components/Statistics';
import './styles/App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [activePage, setActivePage] = useState('login');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch users when the active page is 'users' and authenticated
  useEffect(() => {
    if (activePage === 'users' && isAuthenticated) {
      fetchUsers();
    }
  }, [activePage, isAuthenticated]);

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Handle deleting a user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Handle editing a user
  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  // Open modal for adding a new user
  const openModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      setActivePage('home');
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchSubjects();
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setActivePage('login');
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/subjects");
      setSubjects(response.data);
    } catch (err) {
      console.error("❌ Error fetching subjects:", err);
    }
  };
  const handleAddSubject = async (name) => {
    try {
      const response = await axios.post("http://localhost:5001/api/subjects", { name });
      setSubjects(prev => [...prev, response.data]);
    } catch (err) {
      console.error("❌ Error adding subject:", err);
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/subjects/${id}`);
      setSubjects(prev => prev.filter(subject => subject._id !== id));
    } catch (err) {
      console.error("❌ Error deleting subject:", err);
    }
  };

  const handleEditSubject = async (id, name) => {
    try {
      const response = await axios.put(`http://localhost:5001/api/subjects/${id}`, { name });
      setSubjects(prev => prev.map(subject => 
        subject._id === id ? response.data : subject
      ));
    } catch (err) {
      console.error("❌ Error editing subject:", err);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <div className={`container ${isDarkMode ? 'dark-mode' : ''}`}>
      {!isAuthenticated ? (
        <Login setIsAuthenticated={status => {
          setIsAuthenticated(status);
          if (status) setActivePage('home');
        }} />
      ) : (
        <>
          <Header 
            activePage={activePage} 
            setActivePage={setActivePage} 
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            selectedChapter={selectedChapter}
            setSelectedChapter={setSelectedChapter}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            onLogout={handleLogout}
          />
          <main>
            {activePage === 'home' && (
              <div className="home">
                <Statistics isDarkMode={isDarkMode} />
              </div>
            )}

            {activePage === 'subjects' && !selectedSubject && (
              <Dashboard
                subjects={subjects}
                onViewChapters={subject => {
                  setSelectedSubject(subject);
                  setActivePage('chapters');
                }}
                onDeleteSubject={handleDeleteSubject}
                onAddSubject={handleAddSubject}
                onEditSubject={handleEditSubject}
                isDarkMode={isDarkMode}
              />
            )}

            {activePage === 'chapters' && selectedSubject && !selectedChapter && (
              <ChapterList
                subject={selectedSubject}
                goBack={() => {
                  setSelectedSubject(null);
                  setActivePage('subjects');
                }}
                onFileUpload={chapter => {
                  setSelectedChapter(chapter);
                  setActivePage('fileUpload');
                }}
                onCreateQuiz={chapter => {
                  setSelectedChapter(chapter);
                  setActivePage('createQuiz');
                }}
                onViewQuizzes={chapter => {
                  setSelectedChapter(chapter);
                  setActivePage('viewQuizzes');
                }}
                isDarkMode={isDarkMode}
              />
            )}

            {activePage === 'fileUpload' && selectedChapter && (
              <FileDashboard
                chapter={selectedChapter}
                goBack={() => {
                  setSelectedChapter(null);
                  setActivePage('chapters');
                }}
                isDarkMode={isDarkMode}
              />
            )}

            {activePage === 'createQuiz' && selectedChapter && (
              <QuizForm
                chapter={selectedChapter}
                goBack={() => {
                  setSelectedChapter(null);
                  setActivePage('chapters');
                }}
                isDarkMode={isDarkMode}
              />
            )}

            {activePage === 'users' && (
              <div>
                <div className="dashboard-header">
                  <h1 className="dashboard-title">User Management</h1>
                  <button className="action-button" onClick={openModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Add New User
                  </button>
                </div>

                <div className="search-bar">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search users..."
                    onChange={(e) => {/* Add search functionality */}}
                  />
                </div>

                <div className="stats-container">
                  <div className="stat-card">
                    <h3>{users.length}</h3>
                    <p>Total Users</p>
                  </div>
                  <div className="stat-card">
                    <h3>{users.filter(user => user.isActive).length}</h3>
                    <p>Active Users</p>
                  </div>
                </div>

                <UserList 
                  users={users} 
                  handleDelete={handleDelete} 
                  handleEdit={handleEdit}
                  isDarkMode={isDarkMode}
                />
              </div>
            )}

            {activePage === 'viewQuizzes' && selectedChapter && (
              <ViewQuizzes
                chapter={selectedChapter}
                goBack={() => {
                  setSelectedChapter(null);
                  setActivePage('chapters');
                }}
                isDarkMode={isDarkMode}
              />
            )}
          </main>
          {isModalOpen && (
            <UserModal closeModal={closeModal} isDarkMode={isDarkMode}>
              <UserForm 
                fetchUsers={fetchUsers} 
                editingUser={editingUser} 
                setEditingUser={setEditingUser} 
                closeModal={closeModal}
                isDarkMode={isDarkMode}
              />
            </UserModal>
          )}

          <Footer isDarkMode={isDarkMode} />
        </>
      )}
    </div>
  );
};

export default App;

