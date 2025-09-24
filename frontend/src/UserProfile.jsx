import React, { useEffect, useState } from 'react';
import api from './api';
import { useAuth } from './AuthContext';

export default function UserProfile() {
  const { user, setUser, token } = useAuth();
  const [deviceToken, setDeviceToken] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/api/users/me');
        setUser(res.data.data.user);
        setDeviceToken(res.data.data.user.device_token || '');
      } catch (err) {
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchProfile();
  }, [token, setUser]);

  const handleDeviceTokenUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.patch('/api/users/me/device-token', { token: deviceToken });
      setMessage('Device token updated successfully');
    } catch (err) {
      setError('Failed to update device token');
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!user) return null;

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h2>User Profile</h2>
      <div><strong>Full Name:</strong> {user.fullName}</div>
      <div><strong>Email:</strong> {user.email}</div>
      <div><strong>Role:</strong> {user.role}</div>
      <form onSubmit={handleDeviceTokenUpdate} style={{ marginTop: 20 }}>
        <label>Device Token:</label>
        <input
          type="text"
          value={deviceToken}
          onChange={e => setDeviceToken(e.target.value)}
          style={{ width: '100%' }}
        />
        <button type="submit" style={{ marginTop: 10 }}>Update Device Token</button>
      </form>
      {message && <div style={{ color: 'green', marginTop: 10 }}>{message}</div>}
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </div>
  );
}

