import React, { useEffect, useState } from 'react';
import api from './api';
import { useAuth } from './AuthContext';

export default function JamaahEventsView() {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Fetch events
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/api/events');
        setEvents(res.data.data.events);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Fetch event details
  const handleSelectEvent = async (id) => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await api.get(`/api/events/${id}`);
      setSelectedEvent(res.data.data.event);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  };

  // Register for event
  const handleRegister = async (eventId) => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await api.post(`/api/registrations/${eventId}`);
      setMessage('Registered for event successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register for event');
    } finally {
      setLoading(false);
    }
  };

  // Cancel registration
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
      <h3>Events</h3>
      {message && <div style={{ color: 'green', marginBottom: 10 }}>{message}</div>}
      <ul>
        {events.map(ev => (
          <li key={ev._id} style={{ marginBottom: 10 }}>
            <strong>{ev.title}</strong> ({ev.startTime ? new Date(ev.startTime).toLocaleString() : ''})
            <button style={{ marginLeft: 10 }} onClick={() => handleSelectEvent(ev._id)}>Details</button>
          </li>
        ))}
      </ul>
      {selectedEvent && (
        <div style={{ border: '1px solid #ccc', padding: 20, marginTop: 20 }}>
          <h4>{selectedEvent.title}</h4>
          <div><strong>Description:</strong> {selectedEvent.description}</div>
          <div><strong>Start:</strong> {selectedEvent.startTime ? new Date(selectedEvent.startTime).toLocaleString() : ''}</div>
          <div><strong>End:</strong> {selectedEvent.endTime ? new Date(selectedEvent.endTime).toLocaleString() : ''}</div>
          <div><strong>Location:</strong> {selectedEvent.locationName} - {selectedEvent.locationAddress}</div>
          <div><strong>Ustadz:</strong> {selectedEvent.ustadz?.name}</div>
          <div><strong>Category:</strong> {selectedEvent.category?.name}</div>
          <button style={{ marginTop: 10 }} onClick={() => handleRegister(selectedEvent._id)}>Register</button>
          <button style={{ marginLeft: 10 }} onClick={() => handleCancel(selectedEvent._id)}>Cancel Registration</button>
          <button style={{ marginLeft: 10 }} onClick={() => setSelectedEvent(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

