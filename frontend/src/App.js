import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Footer from './components/Footer';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import FileDashboard from './components/FileDashboard';
import QuizForm from './components/QuizForm';
import TakeQuiz from './components/TakeQuiz';
import Dashboard from "./components/SubjectsDashboard";
import FileUpload from "./components/FileDashboard";
import ViewQuizzes from "./components/ViewQuizzes";
import ChapterList from "./components/ChapterList";
import Login from "./components/Login";
import UserModal from './components/UserModal';
import './styles/App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [activePage, setActivePage] = useState('login');
  const [quizId, setQuizId] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      setActivePage('home');
    }
  }, []);

  // Fetch subjects when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchSubjects();
    }
  }, [isAuthenticated]);

  // Fetch users when the active page is 'users' and authenticated
  useEffect(() => {
    if (activePage === 'users' && isAuthenticated) {
      fetchUsers();
    }
  }, [activePage, isAuthenticated]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setActivePage('login');
  };

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/users');
      setUsers(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      }
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

  // Fetch subjects from the backend
  const fetchSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/subjects");
      setSubjects(response.data);
    } catch (err) {
      console.error("❌ Error fetching subjects:", err);
    }
  };

  // Handle adding a new subject
  const handleAddSubject = async (name) => {
    try {
      const response = await axios.post("http://localhost:5001/api/subjects", { name });
      fetchSubjects();
      return response.data;
    } catch (err) {
      console.error("❌ Error adding subject:", err);
    }
  };

  // Handle deleting a subject
  const handleDeleteSubject = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      console.error("❌ Error deleting subject:", err);
    }
  };

  // Handle editing a subject
  const handleEditSubject = async (id, name) => {
    try {
      const response = await axios.put(`http://localhost:5001/api/subjects/${id}`, { name });
      fetchSubjects();
      return response.data;
    } catch (err) {
      console.error("❌ Error updating subject:", err);
    }
  };

  return (
    <div className="container">
      {/* Show Login Page if not authenticated */}
      {!isAuthenticated ? (
        <Login
          setIsAuthenticated={(status) => {
            setIsAuthenticated(status);
            if (status) setActivePage('home');
          }}
        />
      ) : (
        <>
          {/* Show header only after authentication */}
          <Header setActivePage={setActivePage} setSelectedSubject={setSelectedSubject} onLogout={handleLogout} />

          <main>
            {activePage === 'home' && <div className="home"></div>}

            {activePage === 'files' && <FileDashboard />}

            {activePage === 'users' && (
              <div>
                <h1 className="user-management">User Management</h1>
                <button onClick={openModal}>Add User</button>
                <UserList users={users} handleDelete={handleDelete} handleEdit={handleEdit} />
              </div>
            )}

            {activePage === 'subjects' && (
              !selectedSubject ? (
                <Dashboard
                  subjects={subjects}
                  onFileUpload={(subject) => {
                    setSelectedSubject(subject);
                    setActivePage('fileUpload');
                  }}
                  onCreateQuiz={(subject) => {
                    setSelectedSubject(subject);
                    setActivePage('createQuiz');
                  }}
                  onViewQuizzes={(subject) => {
                    setSelectedSubject(subject);
                    setActivePage('viewQuizzes');
                  }}
                  onViewChapters={(subject) => {
                    setSelectedSubject(subject);
                    setActivePage('chapters');
                  }}
                  onDeleteSubject={handleDeleteSubject}
                  onAddSubject={handleAddSubject}
                  onEditSubject={handleEditSubject}
                />
              ) : (
                <FileUpload subject={selectedSubject} goBack={() => setSelectedSubject(null)} />
              )
            )}

            {activePage === 'createQuiz' && selectedSubject && (
              <QuizForm subject={selectedSubject} goBack={() => {
                setSelectedSubject(null);
                setActivePage('subjects');
              }} />
            )}

            {activePage === 'viewQuizzes' && selectedSubject && (
              <ViewQuizzes
                subject={selectedSubject}
                goBack={() => {
                  setSelectedSubject(null);
                  setActivePage('subjects');
                }}
              />
            )}

            {activePage === 'chapters' && selectedSubject && (
              <ChapterList
                subject={selectedSubject}
                goBack={() => {
                  setSelectedSubject(null);
                  setActivePage('subjects');
                }}
              />
            )}

            {activePage === 'fileUpload' && selectedSubject && (
              <FileUpload
                subject={selectedSubject}
                goBack={() => {
                  setSelectedSubject(null);
                  setActivePage('subjects');
                }}
              />
            )}

            {activePage === 'takeQuiz' && (
              <div>
                <h1>Take a Quiz</h1>
                <input
                  type="text"
                  value={quizId}
                  onChange={(e) => setQuizId(e.target.value)}
                  placeholder="Enter Quiz ID"
                  className="quiz-id-input"
                />
                {quizId && <TakeQuiz quizId={quizId} />}
              </div>
            )}
          </main>

          <Footer />

          {isModalOpen && (
            <UserModal
              user={editingUser}
              onClose={closeModal}
              onSuccess={() => {
                closeModal();
                fetchUsers();
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;