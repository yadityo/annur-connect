import React, { useEffect, useState } from 'react';
import api from './api';
import { useAuth } from './AuthContext';

export default function UsersList() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/api/users');
        setUsers(res.data.data.users);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    }
    if (token && user?.role === 'admin') fetchUsers();
  }, [token, user]);

  if (!user || user.role !== 'admin') return null;
  if (loading) return <div>Loading users...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>All Users</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Full Name</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Email</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{u.fullName}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{u.email}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

