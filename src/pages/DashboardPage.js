import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Add the credentials option here
        const response = await fetch('/api/dashboard', {
          credentials: 'include', // <-- THIS IS THE CRITICAL FIX
        });
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data. Please log in again.');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="about-container">
      <div className="about-header">
        <h1>User Dashboard</h1>
        {user && <p className="about-subtitle">Welcome, {user.email}!</p>}
      </div>

      <div className="about-content">
        <section>
          <h2>Recent Activity</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {dashboardData ? (
            <ul>
              {dashboardData.activity.map(item => (
                <li key={item.id} style={{ marginBottom: '10px' }}>
                  {item.action} - {new Date(item.date).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading activity...</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;