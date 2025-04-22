import React from "react";
import "../styles/UserList.css";

const UserList = ({ users, handleDelete, handleEdit, isDarkMode }) => {
  return (
    <div className="dashboard-grid">
      {users.map((user) => (
        <div key={user._id} className="content-card">
          <div className="card-icons">
            <button className="icon-button edit" onClick={() => handleEdit(user)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button className="icon-button delete" onClick={() => handleDelete(user._id)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <h2>{user.firstName} {user.lastName}</h2>
          <p className="user-email">{user.email}</p>
          
          <div className="user-meta">
            <div className="user-meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              User
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
