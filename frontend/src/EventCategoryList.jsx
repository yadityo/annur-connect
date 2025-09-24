import React, { useEffect, useState } from 'react';
import api from './api';
import { useAuth } from './AuthContext';

export default function EventCategoryList() {
  const { token, user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/event-categories');
      setCategories(res.data.data.categories);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === 'admin') fetchCategories();
    // eslint-disable-next-line
  }, [token, user]);

  // Create category
  const handleCreate = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.post('/api/event-categories', { name });
      setName('');
      setMessage('Category created successfully');
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    }
  };

  // Delete category
  const handleDelete = async id => {
    if (!window.confirm('Delete this category?')) return;
    setError('');
    setMessage('');
    try {
      await api.delete(`/api/event-categories/${id}`);
      setMessage('Category deleted successfully');
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category');
    }
  };

  if (!user || user.role !== 'admin') return null;
  if (loading) return <div>Loading categories...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h2>Event Category Management</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
        <input
          value={name}
          onChange={e => { setName(e.target.value); setError(''); setMessage(''); }}
          placeholder="Category Name"
          required
          style={{ marginRight: 10 }}
        />
        <button type="submit">Create</button>
      </form>
      {message && <div style={{ color: 'green', marginBottom: 10 }}>{message}</div>}
      {categories.length === 0 ? (
        <div>No categories found.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{cat.name}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  <button onClick={() => handleDelete(cat._id)} style={{ color: 'red' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
