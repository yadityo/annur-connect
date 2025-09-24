import React, { useEffect, useState } from 'react';
import api from './api';

export default function JamaahEventCategoriesView() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/api/event-categories');
        setCategories(res.data.data.categories);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch event categories');
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) return <div>Loading event categories...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h3>Event Categories</h3>
      <ul>
        {categories.length === 0 ? <li>No categories found.</li> : categories.map(cat => (
          <li key={cat._id} style={{ marginBottom: 10 }}>
            <strong>{cat.name}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

