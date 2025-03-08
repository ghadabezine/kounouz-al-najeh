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
import Login from "./components/Login";
import './styles/App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [activePage, setActivePage] = useState('login'); // Start with login page
  const [quizId, setQuizId] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication

  // Fetch subjects when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchSubjects();
    }
  }, [isAuthenticated]);
  const handleEditSubject = async (id, name) => {
    try {
        const response = await axios.put(`http://localhost:5001/api/subjects/${id}`, { name });
        fetchSubjects(); // Refetch subjects to update the UI
        return response.data;
    } catch (err) {
        console.error("❌ Error updating subject:", err);
    }
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
  };

  // Handle adding a new subject
  const handleAddSubject = async (name) => {
    try {
      const response = await axios.post("http://localhost:5001/api/subjects", { name });
      fetchSubjects(); // Refetch subjects to update the UI
      return response.data;
    } catch (err) {
      console.error("❌ Error adding subject:", err);
    }
  };

  // Handle deleting a subject
  const handleDeleteSubject = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/subjects/${id}`);
      fetchSubjects(); // Refetch subjects to update the UI
    } catch (err) {
      console.error("❌ Error deleting subject:", err);
    }
  };

  return (
    <div className="container">
      {/* Show Login Page if not authenticated */}
      {!isAuthenticated ? (
        <Login
          setIsAuthenticated={(status) => {
            setIsAuthenticated(status);
            if (status) setActivePage('home'); // Navigate to home on successful login
          }}
        />
      ) : (
        <>
          {/* Show header only after authentication */}
          <Header setActivePage={setActivePage} setSelectedSubject={setSelectedSubject} />

          <main>
            {activePage === 'home' && (
              <div className="home">
                <h2>Welcome to Kounouz Ennajeh</h2>
                <h3>Explore our platform and discover amazing features.</h3>
              </div>
            )}

            {activePage === 'files' && <FileDashboard />}

            {activePage === 'users' && (
              <div>
                <h1 className="user-management">User Management</h1>
                <UserForm
                  fetchUsers={fetchUsers}
                  editingUser={editingUser}
                  setEditingUser={setEditingUser}
                />
                <UserList
                  users={users}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                />
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
                  onDeleteSubject={handleDeleteSubject} // Pass delete function
                  onAddSubject={handleAddSubject} // Pass add function
                  onEditSubject={handleEditSubject} 
                />
              ) : (
                <FileUpload subject={selectedSubject} goBack={() => setSelectedSubject(null)} />
              )
            )}

            {activePage === 'createQuiz' && selectedSubject && (
              <QuizForm subject={selectedSubject} goBack={() => {
                setSelectedSubject(null); // Clear the selected subject
                setActivePage('subjects'); // Navigate back to the Subjects Dashboard
            }} />
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

            {activePage === 'viewQuizzes' && selectedSubject && (
              <ViewQuizzes subject={selectedSubject}   goBack={() => {
                setSelectedSubject(null); // Clear the selected subject
                setActivePage('subjects'); // Navigate back to the Subjects Dashboard
            }} />
            )}
          </main>

          <Footer />
        </>
      )}
    </div>
  );
};

export default App;