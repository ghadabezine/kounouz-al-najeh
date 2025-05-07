import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
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

// Page transition component
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

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
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Navigation helper function
  const navigateTo = (page, subject = null, chapter = null) => {
    setActivePage(page);
    setSelectedSubject(subject);
    setSelectedChapter(chapter);
  };

  // Back navigation helper function
  const goBack = () => {
    switch (activePage) {
      case 'chapters':
        navigateTo('subjects');
        break;
      case 'fileUpload':
      case 'createQuiz':
      case 'viewQuizzes':
        navigateTo('chapters', selectedSubject);
        break;
      default:
        navigateTo('home');
    }
  };

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

  // Add this function to filter users
  const filteredUsers = users.filter(user => {
    const searchTerm = userSearchTerm.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    
    return fullName.includes(searchTerm) || email.includes(searchTerm);
  });

  return (
    <div className={`container ${isDarkMode ? 'dark-mode' : ''}`}>
      {!isAuthenticated ? (
        <PageTransition>
          <Login setIsAuthenticated={status => {
            setIsAuthenticated(status);
            if (status) navigateTo('home');
          }} />
        </PageTransition>
      ) : (
        <>
          <Header 
            activePage={activePage} 
            setActivePage={navigateTo} 
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            selectedChapter={selectedChapter}
            setSelectedChapter={setSelectedChapter}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            onLogout={handleLogout}
          />
          <main>
            <AnimatePresence mode="wait">
              {activePage === 'home' && (
                <PageTransition key="home">
                  <div className="home">
                    <Statistics isDarkMode={isDarkMode} setActivePage={navigateTo} />
                  </div>
                </PageTransition>
              )}

              {activePage === 'subjects' && !selectedSubject && (
                <PageTransition key="subjects">
                  <Dashboard
                    subjects={subjects}
                    onViewChapters={subject => navigateTo('chapters', subject)}
                    onDeleteSubject={handleDeleteSubject}
                    onAddSubject={handleAddSubject}
                    onEditSubject={handleEditSubject}
                    isDarkMode={isDarkMode}
                  />
                </PageTransition>
              )}

              {activePage === 'chapters' && selectedSubject && !selectedChapter && (
                <PageTransition key="chapters">
                  <ChapterList
                    subject={selectedSubject}
                    goBack={goBack}
                    onFileUpload={chapter => navigateTo('fileUpload', selectedSubject, chapter)}
                    onCreateQuiz={chapter => navigateTo('createQuiz', selectedSubject, chapter)}
                    onViewQuizzes={chapter => navigateTo('viewQuizzes', selectedSubject, chapter)}
                    isDarkMode={isDarkMode}
                  />
                </PageTransition>
              )}

              {activePage === 'fileUpload' && selectedChapter && (
                <PageTransition key="fileUpload">
                  <FileDashboard
                    chapter={selectedChapter}
                    goBack={goBack}
                    isDarkMode={isDarkMode}
                  />
                </PageTransition>
              )}

              {activePage === 'createQuiz' && selectedChapter && (
                <PageTransition key="createQuiz">
                  <QuizForm
                    chapter={selectedChapter}
                    goBack={goBack}
                    isDarkMode={isDarkMode}
                  />
                </PageTransition>
              )}

              {activePage === 'users' && (
                <PageTransition key="users">
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
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
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
                      users={filteredUsers} 
                      handleDelete={handleDelete} 
                      handleEdit={handleEdit}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                </PageTransition>
              )}

              {activePage === 'viewQuizzes' && selectedChapter && (
                <PageTransition key="viewQuizzes">
                  <ViewQuizzes
                    chapter={selectedChapter}
                    goBack={goBack}
                    isDarkMode={isDarkMode}
                  />
                </PageTransition>
              )}
            </AnimatePresence>
          </main>
          {isModalOpen && (
            <UserModal
              editingUser={editingUser}
              closeModal={closeModal}
              fetchUsers={fetchUsers}
              setEditingUser={setEditingUser}
              isDarkMode={isDarkMode}
            />
          )}

          <Footer isDarkMode={isDarkMode} />
        </>
      )}
    </div>
  );
};

export default App;

