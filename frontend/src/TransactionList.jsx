    import React, { useEffect, useState, useRef } from 'react';
import api from './api';
import { useAuth } from './AuthContext';

export default function TransactionList() {
  const { token, user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    date: '',
    description: '',
    amount: '',
    category: ''
  });
  const [message, setMessage] = useState('');
  const fileInputRef = useRef();

  // Fetch transactions and categories
  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [transRes, catRes] = await Promise.all([
        api.get('/api/transactions'),
        api.get('/api/transaction-categories')
      ]);
      setTransactions(transRes.data.data.transactions);
      setCategories(catRes.data.data.categories);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === 'admin') fetchAll();
    // eslint-disable-next-line
  }, [token, user, message]);

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create transaction
  const handleCreate = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('date', form.date);
      formData.append('description', form.description);
      formData.append('amount', form.amount);
      formData.append('category', form.category);
      if (fileInputRef.current.files[0]) {
        formData.append('proofImage', fileInputRef.current.files[0]);
      }
      await api.post('/api/transactions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm({ date: '', description: '', amount: '', category: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      setMessage('Transaction created successfully');
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create transaction');
    }
  };

  // Delete transaction
  const handleDelete = async id => {
    if (!window.confirm('Delete this transaction?')) return;
    setError('');
    setMessage('');
    try {
      await api.delete(`/api/transactions/${id}`);
      setMessage('Transaction deleted successfully');
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete transaction');
    }
  };

  if (!user || user.role !== 'admin') return null;
  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h2>Transaction Management</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: 20, textAlign: 'left' }}>
        <input name="date" type="date" value={form.date} onChange={handleChange} required style={{ marginRight: 10 }} />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" required style={{ marginRight: 10 }} />
        <input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Amount" required style={{ marginRight: 10 }} />
        <select name="category" value={form.category} onChange={handleChange} required style={{ marginRight: 10 }}>
          <option value="">Select Category</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name} ({c.type})</option>)}
        </select>
        <input name="proofImage" type="file" ref={fileInputRef} accept="image/*" style={{ marginRight: 10 }} />
        <button type="submit">Create</button>
      </form>
      {message && <div style={{ color: 'green', marginBottom: 10 }}>{message}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Description</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Amount</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Category</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Proof</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tr => (
            <tr key={tr._id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{tr.date ? new Date(tr.date).toLocaleDateString() : ''}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{tr.description}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{tr.amount}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{tr.category?.name} ({tr.category?.type})</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {tr.proof_url ? <a href={tr.proof_url} target="_blank" rel="noopener noreferrer">View</a> : '—'}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <button onClick={() => handleDelete(tr._id)} style={{ color: 'red' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

