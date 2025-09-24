import React, { useEffect, useState } from 'react';
import api from './api';
import { useAuth } from './AuthContext';

export default function UstadzList() {
  const { token, user } = useAuth();
  const [ustadz, setUstadz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', bio: '', photo_url: '' });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch ustadz list
  useEffect(() => {
    async function fetchUstadz() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/api/ustadz');
        setUstadz(res.data.data.ustadz);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch ustadz');
      } finally {
        setLoading(false);
      }
    }
    if (token && user?.role === 'admin') fetchUstadz();
  }, [token, user, message]);

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create ustadz
  const handleCreate = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.post('/api/ustadz', form);
      setForm({ name: '', bio: '', photo_url: '' });
      setMessage('Ustadz created successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ustadz');
    }
  };

  // Edit ustadz
  const handleEdit = ustadzItem => {
    setEditId(ustadzItem._id);
    setForm({ name: ustadzItem.name, bio: ustadzItem.bio, photo_url: ustadzItem.photo_url });
    setMessage('');
    setError('');
  };

  // Update ustadz
  const handleUpdate = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.put(`/api/ustadz/${editId}`, form);
      setEditId(null);
      setForm({ name: '', bio: '', photo_url: '' });
      setMessage('Ustadz updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update ustadz');
    }
  };

  // Delete ustadz
  const handleDelete = async id => {
    if (!window.confirm('Delete this ustadz?')) return;
    setError('');
    setMessage('');
    try {
      await api.delete(`/api/ustadz/${id}`);
      setMessage('Ustadz deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete ustadz');
    }
  };

  if (!user || user.role !== 'admin') return null;
  if (loading) return <div>Loading ustadz...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>Ustadz Management</h2>
      <form onSubmit={editId ? handleUpdate : handleCreate} style={{ marginBottom: 20 }}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required style={{ marginRight: 10 }} />
        <input name="bio" value={form.bio} onChange={handleChange} placeholder="Bio" style={{ marginRight: 10 }} />
        <input name="photo_url" value={form.photo_url} onChange={handleChange} placeholder="Photo URL" style={{ marginRight: 10 }} />
        <button type="submit">{editId ? 'Update' : 'Create'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: '', bio: '', photo_url: '' }); }}>Cancel</button>}
      </form>
      {message && <div style={{ color: 'green', marginBottom: 10 }}>{message}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Bio</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Photo</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ustadz.map(u => (
            <tr key={u._id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{u.name}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{u.bio}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <img src={u.photo_url} alt={u.name} style={{ width: 40, height: 40, objectFit: 'cover' }} />
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <button onClick={() => handleEdit(u)} style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => handleDelete(u._id)} style={{ color: 'red' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

