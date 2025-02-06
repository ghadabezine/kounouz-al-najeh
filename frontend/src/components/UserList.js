// frontend/src/components/UserList.js
import React from "react";

const UserList = ({ users, handleDelete }) => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user._id}>
          {user.firstName} {user.lastName} - {user.email}
          <button onClick={() => handleDelete(user._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default UserList;