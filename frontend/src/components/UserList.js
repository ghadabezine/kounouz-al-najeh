import React from "react";
import "../App.css";

const UserList = ({ users, handleDelete, handleEdit }) => {
  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={user._id}>
            <td>{index + 1}</td>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>{user.email}</td>
            <td>
              <button className="edit-btn" onClick={() => handleEdit(user)}>Edit</button>
            </td>
            <td>
              <button className="delete-btn" onClick={() => handleDelete(user._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserList;
