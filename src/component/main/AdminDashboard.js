import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './AdminDashboard.css';

// Register the necessary components for Chart.js, including the Filler plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState({ total: 0, active: 0, inactive: 0 });
  
  // State to hold the combined chart configuration (data and options)
  const [chartConfig, setChartConfig] = useState(null);

  useEffect(() => {
    const fetchAndProcessUsers = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('https://localhost:7166/api/Auth/users', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        // Translated error messages
        if (response.status === 401) throw new Error('Session expired. Please log in again!');
        if (!response.ok) throw new Error('Failed to fetch user data.');
        
        const users = await response.json();

        // CRITICAL DEBUGGING STEP: Log the raw data from the API
        console.log('ACTUAL DATA FROM API:', users);

        // 1. Calculate data for the summary cards (logic remains the same)
        const totalUsers = users.length;
        const activeUsers = users.filter(user => user.isActive).length;
        const inactiveUsers = totalUsers - activeUsers;
        setSummaryData({ total: totalUsers, active: activeUsers, inactive: inactiveUsers });

        if (users.length === 0) {
          setChartConfig(null); // No data, so no config
          setLoading(false);
          return;
        }

        // --- LOGIC FOR CUMULATIVE TOTALS ---

        // 2. Count NEW users per month
        const newUsersPerMonth = users.reduce((acc, user) => {
          const month = new Date(user.createdAt).toISOString().slice(0, 7); // Format: "YYYY-MM"
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

        // 3. Create a complete timeline from the first registration until the current month
        const sortedUsers = [...users].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        const startDate = new Date(sortedUsers[0].createdAt);
        const endDate = new Date();
        const timelineMonths = [];
        let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        while (currentDate <= endDate) {
            timelineMonths.push(currentDate.toISOString().slice(0, 7));
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        // 4. Calculate the CUMULATIVE total for each month in the timeline
        let cumulativeCount = 0;
        const cumulativeDataPoints = timelineMonths.map(month => {
            cumulativeCount += newUsersPerMonth[month] || 0;
            return cumulativeCount;
        });
        
        // Use 'en-US' locale for chart labels
        const labels = timelineMonths.map(month => {
          const [year, m] = month.split('-');
          return new Date(year, m - 1).toLocaleString('en-US', { month: 'short', year: 'numeric' });
        });
        
        // Create chart data and options after the `users` variable is available
        const dataForChart = {
          labels,
          datasets: [
            {
              label: 'Total Accounts', // Translated label
              data: cumulativeDataPoints,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              fill: true,
              tension: 0.3,
            },
          ],
        };
        
        const optionsForChart = {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: {
                display: true,
                text: 'Account Growth Over Time', // Translated title
                font: { size: 18 }
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: users.length > 10 ? undefined : 1
                }
              }
            }
        };

        // Save both data and options into a single state
        setChartConfig({ data: dataForChart, options: optionsForChart });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAndProcessUsers();
  }, []);


  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {/* Translated Summary Cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h2>Total Accounts</h2>
          <p>{loading ? '...' : summaryData.total}</p>
        </div>
        <div className="dashboard-card status-active">
          <h2>Active</h2>
          <p>{loading ? '...' : summaryData.active}</p>
        </div>
        <div className="dashboard-card status-inactive">
          <h2>Inactive</h2>
          <p>{loading ? '...' : summaryData.inactive}</p>
        </div>
      </div>
      
      {/* Translated Chart Section */}
      <div className="dashboard-chart">
        <h2>User Growth</h2>
        {loading ? (
          <div className="loading">Loading chart data...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : chartConfig ? (
          <div className="chart-container">
            <Line options={chartConfig.options} data={chartConfig.data} />
          </div>
        ) : (
          <div>No data to display.</div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;