import React, { useState } from 'react';
import EventsView from './JamaahEventsView';
import MyRegistrationsView from './JamaahMyRegistrationsView';
import JamaahUstadzProfilesView from './JamaahUstadzProfilesView';
import TransactionsView from './JamaahTransactionsView';

export default function JamaahDashboard() {
  const [view, setView] = useState('events');

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h2>Jamaah Dashboard</h2>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setView('events')} disabled={view === 'events'}>Events</button>
        <button onClick={() => setView('myRegistrations')} disabled={view === 'myRegistrations'} style={{ marginLeft: 10 }}>My Registrations</button>
        <button onClick={() => setView('ustadz')} disabled={view === 'ustadz'} style={{ marginLeft: 10 }}>Ustadz Profiles</button>
        <button onClick={() => setView('transactions')} disabled={view === 'transactions'} style={{ marginLeft: 10 }}>Transactions</button>
      </div>
      {view === 'events' && <EventsView />}
      {view === 'myRegistrations' && <MyRegistrationsView />}
      {/* Show ustadz profiles for jamaah */}
      {view === 'ustadz' && <JamaahUstadzProfilesView />}
      {view === 'transactions' && <TransactionsView />}
    </div>
  );
}
