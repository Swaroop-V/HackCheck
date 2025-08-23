import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // <-- ADD THIS LINE

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {        
        const response = await fetch('/api/dashboard', {
          credentials: 'include', 
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
        <h1>Dashboard</h1>
        {user && <p className="about-subtitle">Welcome, {user.username}!</p>}
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

        <div className="about-cta">
          <h3>Ready to secure your accounts?</h3>
          <p>Check your most-used passwords now and take the first step towards better protection.</p>
          <Link to="/check" className="btn-primary btn-large">
            Check a Password Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;