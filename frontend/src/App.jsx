import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Register from './Register';
import UserProfile from './UserProfile';
import UsersList from './UsersList';
import UstadzList from './UstadzList';
import EventCategoryList from './EventCategoryList';
import EventList from './EventList';
import TransactionCategoryList from './TransactionCategoryList';
import TransactionList from './TransactionList';
import JamaahDashboard from './JamaahDashboard';
import './App.css';

function MainApp() {
  const { token, logout, user } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [adminView, setAdminView] = useState('profile');

  if (!token) {
    return (
      <div style={{ maxWidth: 400, margin: '40px auto' }}>
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setShowLogin(true)} disabled={showLogin}>Login</button>
          <button onClick={() => setShowLogin(false)} disabled={!showLogin} style={{ marginLeft: 10 }}>Register</button>
        </div>
        {showLogin ? <Login onLogin={() => window.location.reload()} /> : <Register onRegister={() => window.location.reload()} />}
      </div>
    );
  }

  // Admin dashboard navigation
  if (user && user.role === 'admin') {
    return (
      <div style={{ maxWidth: 600, margin: '40px auto', textAlign: 'center' }}>
        <h2>Admin Dashboard</h2>
        <button onClick={logout}>Logout</button>
        <div style={{ margin: '20px 0' }}>
          <button onClick={() => setAdminView('profile')} disabled={adminView === 'profile'}>Profile</button>
          <button onClick={() => setAdminView('users')} disabled={adminView === 'users'} style={{ marginLeft: 10 }}>User Management</button>
          <button onClick={() => setAdminView('ustadz')} disabled={adminView === 'ustadz'} style={{ marginLeft: 10 }}>Ustadz Management</button>
          <button onClick={() => setAdminView('eventCategories')} disabled={adminView === 'eventCategories'} style={{ marginLeft: 10 }}>Event Category Management</button>
          <button onClick={() => setAdminView('events')} disabled={adminView === 'events'} style={{ marginLeft: 10 }}>Event Management</button>
          <button onClick={() => setAdminView('transactionCategories')} disabled={adminView === 'transactionCategories'} style={{ marginLeft: 10 }}>Transaction Category Management</button>
          <button onClick={() => setAdminView('transactions')} disabled={adminView === 'transactions'} style={{ marginLeft: 10 }}>Transaction Management</button>
        </div>
        {adminView === 'profile' ? <UserProfile />
          : adminView === 'users' ? <UsersList />
          : adminView === 'ustadz' ? <UstadzList />
          : adminView === 'eventCategories' ? <EventCategoryList />
          : adminView === 'events' ? <EventList />
          : adminView === 'transactionCategories' ? <TransactionCategoryList />
          : <TransactionList />}
      </div>
    );
  }

  // Jamaah or other user view
  if (user && user.role === 'jamaah') {
    return (
      <JamaahDashboard />
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', textAlign: 'center' }}>
      <h2>Welcome! You are logged in.</h2>
      <button onClick={logout}>Logout</button>
      <UserProfile />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
