import React, { useEffect, useState } from 'react';
import api from './api';

export default function JamaahUstadzProfilesView() {
  const [ustadz, setUstadz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUstadz() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/api/ustadz');
        setUstadz(res.data.data.ustadz);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch ustadz profiles');
      } finally {
        setLoading(false);
      }
    }
    fetchUstadz();
  }, []);

  if (loading) return <div>Loading ustadz profiles...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h3>Ustadz Profiles</h3>
      <ul>
        {ustadz.length === 0 ? <li>No ustadz found.</li> : ustadz.map(u => (
          <li key={u._id} style={{ marginBottom: 10 }}>
            <strong>{u.name}</strong> <br />
            <span>{u.bio}</span> <br />
            <img src={u.photo_url} alt={u.name} style={{ width: 60, height: 60, objectFit: 'cover', marginTop: 5 }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

