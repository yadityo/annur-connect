import React, { useEffect, useState } from 'react';
import api from './api';
import { useAuth } from './AuthContext';

export default function EventList() {
  const { token, user } = useAuth();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ustadzList, setUstadzList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    locationName: '',
    locationAddress: '',
    ustadz: '',
    category: ''
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch events, categories, ustadz
  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [eventRes, catRes, ustadzRes] = await Promise.all([
        api.get('/api/events'),
        api.get('/api/event-categories'),
        api.get('/api/ustadz')
      ]);
      setEvents(eventRes.data.data.events);
      setCategories(catRes.data.data.categories);
      setUstadzList(ustadzRes.data.data.ustadz);
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

  // Create event
  const handleCreate = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.post('/api/events', form);
      setForm({
        title: '', description: '', startTime: '', endTime: '', locationName: '', locationAddress: '', ustadz: '', category: ''
      });
      setMessage('Event created successfully');
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    }
  };

  // Edit event
  const handleEdit = event => {
    setEditId(event._id);
    setForm({
      title: event.title,
      description: event.description,
      startTime: event.startTime ? event.startTime.slice(0, 16) : '',
      endTime: event.endTime ? event.endTime.slice(0, 16) : '',
      locationName: event.locationName,
      locationAddress: event.locationAddress,
      ustadz: event.ustadz?._id || event.ustadz,
      category: event.category?._id || event.category
    });
    setMessage('');
    setError('');
  };

  // Update event
  const handleUpdate = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.put(`/api/events/${editId}`, form);
      setEditId(null);
      setForm({
        title: '', description: '', startTime: '', endTime: '', locationName: '', locationAddress: '', ustadz: '', category: ''
      });
      setMessage('Event updated successfully');
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event');
    }
  };

  // Delete event
  const handleDelete = async id => {
    if (!window.confirm('Delete this event?')) return;
    setError('');
    setMessage('');
    try {
      await api.delete(`/api/events/${id}`);
      setMessage('Event deleted successfully');
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
    }
  };

  if (!user || user.role !== 'admin') return null;
  if (loading) return <div>Loading events...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h2>Event Management</h2>
      <form onSubmit={editId ? handleUpdate : handleCreate} style={{ marginBottom: 20, textAlign: 'left' }}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required style={{ marginRight: 10 }} />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" required style={{ marginRight: 10 }} />
        <input name="startTime" type="datetime-local" value={form.startTime} onChange={handleChange} required style={{ marginRight: 10 }} />
        <input name="endTime" type="datetime-local" value={form.endTime} onChange={handleChange} required style={{ marginRight: 10 }} />
        <input name="locationName" value={form.locationName} onChange={handleChange} placeholder="Location Name" style={{ marginRight: 10 }} />
        <input name="locationAddress" value={form.locationAddress} onChange={handleChange} placeholder="Location Address" style={{ marginRight: 10 }} />
        <select name="ustadz" value={form.ustadz} onChange={handleChange} required style={{ marginRight: 10 }}>
          <option value="">Select Ustadz</option>
          {ustadzList.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>
        <select name="category" value={form.category} onChange={handleChange} required style={{ marginRight: 10 }}>
          <option value="">Select Category</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <button type="submit">{editId ? 'Update' : 'Create'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ title: '', description: '', startTime: '', endTime: '', locationName: '', locationAddress: '', ustadz: '', category: '' }); }}>Cancel</button>}
      </form>
      {message && <div style={{ color: 'green', marginBottom: 10 }}>{message}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Title</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Description</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Start</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>End</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Location</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Ustadz</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Category</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(ev => (
            <tr key={ev._id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{ev.title}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{ev.description}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{ev.startTime ? new Date(ev.startTime).toLocaleString() : ''}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{ev.endTime ? new Date(ev.endTime).toLocaleString() : ''}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{ev.locationName}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{ev.ustadz?.name || ''}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{ev.category?.name || ''}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <button onClick={() => handleEdit(ev)} style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => handleDelete(ev._id)} style={{ color: 'red' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

