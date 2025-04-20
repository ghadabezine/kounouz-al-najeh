import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Footer from './components/Footer';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import FileDashboard from './components/FileDashboard';
import QuizForm from './components/QuizForm';
import ChapterQuizzes from './components/ChapterQuizzes';
import Dashboard from "./components/SubjectsDashboard";
import ChapterList from "./components/ChapterList";
import Login from "./components/Login";
import UserModal from './components/UserModal';
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

  return (
    <div className="container">
      {!isAuthenticated ? (
        <Login setIsAuthenticated={status => {
          setIsAuthenticated(status);
          if (status) setActivePage('home');
        }} />
      ) : (
        <>
          <Header 
            setActivePage={setActivePage} 
            setSelectedSubject={setSelectedSubject} 
            onLogout={handleLogout} 
          />
          
          <main>
            {activePage === 'home' && <div className="home"></div>}

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
              />
            )}

            {activePage === 'fileUpload' && selectedChapter && (
              <FileDashboard
                chapter={selectedChapter}
                goBack={() => {
                  setSelectedChapter(null);
                  setActivePage('chapters');
                }}
              />
            )}

{activePage === 'createQuiz' && selectedChapter && (
  <QuizForm
    chapter={selectedChapter}
    goBack={() => {
      setSelectedChapter(null);
      setActivePage('chapters');
    }}
  />
)}

            {activePage === 'viewQuizzes' && selectedChapter && (
              <ChapterQuizzes
                chapter={selectedChapter}
                goBack={() => {
                  setSelectedChapter(null);
                  setActivePage('chapters');
                }}
              />
            )}
          </main>

          <Footer />
          
          {isModalOpen && (
            <UserModal
              user={editingUser}
              onClose={() => setIsModalOpen(false)}
              onSuccess={() => {
                setIsModalOpen(false);
                // fetchUsers();
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
