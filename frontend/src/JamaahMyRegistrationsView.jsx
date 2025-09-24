import React, { useEffect, useState } from 'react';
import api from './api';

export default function JamaahMyRegistrationsView() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchRegistrations() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/api/registrations/my');
        setRegistrations(res.data.data.registrations);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch registrations');
      } finally {
        setLoading(false);
      }
    }
    fetchRegistrations();
  }, [message]);

  const handleCancel = async (eventId) => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await api.delete(`/api/registrations/${eventId}`);
      setMessage('Registration cancelled successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel registration');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h3>My Event Registrations</h3>
      {message && <div style={{ color: 'green', marginBottom: 10 }}>{message}</div>}
      <ul>
        {registrations.length === 0 ? <li>No registrations found.</li> : registrations.map(reg => (
          <li key={reg._id} style={{ marginBottom: 10 }}>
            <strong>{reg.event?.title}</strong> ({reg.event?.startTime ? new Date(reg.event.startTime).toLocaleString() : ''})
            <button style={{ marginLeft: 10 }} onClick={() => handleCancel(reg.event._id)}>Cancel Registration</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

