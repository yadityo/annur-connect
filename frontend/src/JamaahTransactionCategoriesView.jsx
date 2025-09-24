import React, { useEffect, useState } from 'react';
import api from './api';

export default function JamaahTransactionCategoriesView() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/api/transaction-categories');
        setCategories(res.data.data.categories);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch transaction categories');
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) return <div>Loading transaction categories...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h3>Transaction Categories</h3>
      <ul>
        {categories.length === 0 ? <li>No categories found.</li> : categories.map(cat => (
          <li key={cat._id} style={{ marginBottom: 10 }}>
            <strong>{cat.name}</strong> ({cat.type})
          </li>
        ))}
      </ul>
    </div>
  );
}

