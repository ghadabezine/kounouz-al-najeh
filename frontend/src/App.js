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
import Login from "./components/Login";
import './styles/App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [activePage, setActivePage] = useState('login'); // ✅ Start with the login page
  const [quizId, setQuizId] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5001/api/subjects")
      .then((res) => res.json())
      .then((data) => setSubjects(data))
      .catch((err) => console.error("❌ Error fetching subjects:", err));
  }, []);

  useEffect(() => {
    if (activePage === 'users') {
      fetchUsers();
    }
  }, [activePage]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  return (
    <div className="container">
      {isAuthenticated && <Header setActivePage={setActivePage} setSelectedSubject={setSelectedSubject} />}

      <main>
        {!isAuthenticated ? (
          <Login
            setIsAuthenticated={(status) => {
              setIsAuthenticated(status);
              if (status) setActivePage('home'); // ✅ Navigate to home after login
            }}
          />
        ) : (
          <>
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
                <UserForm fetchUsers={fetchUsers} editingUser={editingUser} setEditingUser={setEditingUser} />
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
                />
              ) : (
                <FileUpload subject={selectedSubject} goBack={() => setSelectedSubject(null)} />
              )
            )}

            {activePage === 'createQuiz' && selectedSubject && (
              <QuizForm subject={selectedSubject} goBack={() => setActivePage('subjects')} />
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
          </>
        )}
      </main>

      {isAuthenticated && <Footer />}
    </div>
  );
};

export default App;
