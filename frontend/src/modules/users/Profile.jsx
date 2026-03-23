import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from './useAuth.js';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setIsSaving(true);

    try {
      await updateProfile(form);
      setMessage('Profile updated successfully.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="page-shell">
      <div className="page-card page-card-profile">
        <div className="page-header">
          <div>
            <span className="eyebrow">Account Center</span>
            <h1>My profile</h1>
            <p>Manage your personal details and current account access.</p>
          </div>
          <button className="secondary-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div className="profile-overview">
          <div className="profile-identity">
            <div className="profile-avatar">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div>
              <h2>
                {user?.firstName} {user?.lastName}
              </h2>
              <p>{user?.email}</p>
            </div>
          </div>
          <div className="profile-meta-grid">
            <div className="meta-card">
              <span>Role</span>
              <strong>{user?.role || '-'}</strong>
            </div>
            <div className="meta-card">
              <span>Status</span>
              <strong>{user?.status || '-'}</strong>
            </div>
            <div className="meta-card">
              <span>Last login</span>
              <strong>{user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'First access'}</strong>
            </div>
          </div>
        </div>
        {message ? <div className="alert success">{message}</div> : null}
        {error ? <div className="alert error">{error}</div> : null}
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="grid-2">
            <label>
              First name
              <input name="firstName" value={form.firstName} onChange={handleChange} required />
            </label>
            <label>
              Last name
              <input name="lastName" value={form.lastName} onChange={handleChange} required />
            </label>
          </div>
          <label>
            Email
            <input value={user?.email || ''} disabled />
          </label>
          <div className="grid-2">
            <label>
              Role
              <input value={user?.role || ''} disabled />
            </label>
            <label>
              Status
              <input value={user?.status || ''} disabled />
            </label>
          </div>
          <button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
