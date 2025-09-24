import React, { useEffect, useState } from 'react';
import api from './api';
import { useAuth } from './AuthContext';

export default function TransactionCategoryList() {
  const { token, user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', type: 'pemasukan' });
  const [message, setMessage] = useState('');

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/transaction-categories');
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
      await api.post('/api/transaction-categories', form);
      setForm({ name: '', type: 'pemasukan' });
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
      await api.delete(`/api/transaction-categories/${id}`);
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
      <h2>Transaction Category Management</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
        <input
          name="name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Category Name"
          required
          style={{ marginRight: 10 }}
        />
        <select
          name="type"
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
          required
          style={{ marginRight: 10 }}
        >
          <option value="pemasukan">Pemasukan</option>
          <option value="pengeluaran">Pengeluaran</option>
        </select>
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
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Type</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{cat.name}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{cat.type}</td>
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

