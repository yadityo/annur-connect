import React, { useEffect, useState } from 'react';
import api from './api';

export default function JamaahTransactionsView() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/api/transactions');
        setTransactions(res.data.data.transactions);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h3>Transactions</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Description</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Amount</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Category</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Proof</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr><td colSpan={5}>No transactions found.</td></tr>
          ) : transactions.map(tr => (
            <tr key={tr._id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{tr.date ? new Date(tr.date).toLocaleDateString() : ''}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{tr.description}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{tr.amount}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{tr.category?.name} ({tr.category?.type})</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {tr.proof_url ? <a href={tr.proof_url} target="_blank" rel="noopener noreferrer">View</a> : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

