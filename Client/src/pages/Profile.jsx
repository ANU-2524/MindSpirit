import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { token } = useContext(AuthContext);
  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [editing, setEditing] = useState(false);

  // TODO: Fetch user info from backend and handle avatar upload

  const handleEdit = () => setEditing(true);
  const handleSave = () => {
    // TODO: Save profile changes to backend
    setEditing(false);
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="avatar-section">
        <img src={avatar || '/default-avatar.png'} alt="Avatar" className="avatar" />
        {editing && <input type="file" onChange={e => setAvatar(URL.createObjectURL(e.target.files[0]))} />}
      </div>
      <div className="profile-info">
        <label>Username:</label>
        {editing ? (
          <input value={username} onChange={e => setUsername(e.target.value)} />
        ) : (
          <span>{username}</span>
        )}
      </div>
      <div className="profile-info">
        <label>Email:</label>
        {editing ? (
          <input value={email} onChange={e => setEmail(e.target.value)} />
        ) : (
          <span>{email}</span>
        )}
      </div>
      <div className="profile-actions">
        {editing ? (
          <button onClick={handleSave}>Save</button>
        ) : (
          <button onClick={handleEdit}>Edit Profile</button>
        )}
      </div>
    </div>
  );
};

export default Profile;
