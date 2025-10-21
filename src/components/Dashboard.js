import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  DirectionsCar,
  ConfirmationNumber,
  People,
  Queue,
  TrendingUp,
  AccessTime
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const StatCard = ({ title, value, icon, color, trend }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: '50%',
              p: 1,
              mr: 2,
              color: 'white'
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
        {trend && (
          <Box display="flex" alignItems="center" color="success.main">
            <TrendingUp fontSize="small" />
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              +{trend}%
            </Typography>
          </Box>
        )}
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    today: {
      today_tokens: 25,
      today_passengers: 18,
      today_queue_entries: 32,
      today_completed: 15
    },
    total: {
      total_vehicles: 156,
      total_tokens: 1248,
      total_passengers: 892,
      total_queue_entries: 2156
    }
  });
  const [recentTokens, setRecentTokens] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch dashboard stats
      try {
        const response = await axios.get('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.log('Using mock dashboard data');
      }

      // Fetch recent tokens
      try {
        const tokensResponse = await axios.get('/api/admin/recent-tokens', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecentTokens(tokensResponse.data.tokens || []);
      } catch (error) {
        // Mock recent tokens data
        setRecentTokens([
          { id: 1, token_number: 'T025', passenger_name: 'Rajesh Kumar', status: 'pending', created_at: '2024-10-20T12:30:00Z' },
          { id: 2, token_number: 'T024', passenger_name: 'Priya Sharma', status: 'in_progress', created_at: '2024-10-20T12:15:00Z' },
          { id: 3, token_number: 'T023', passenger_name: 'Amit Patel', status: 'completed', created_at: '2024-10-20T12:00:00Z' },
          { id: 4, token_number: 'T022', passenger_name: 'Sunita Devi', status: 'completed', created_at: '2024-10-20T11:45:00Z' },
          { id: 5, token_number: 'T021', passenger_name: 'Vikram Singh', status: 'completed', created_at: '2024-10-20T11:30:00Z' }
        ]);
      }

      // Mock chart data for hourly token generation
      setChartData([
        { hour: '9 AM', tokens: 3 },
        { hour: '10 AM', tokens: 7 },
        { hour: '11 AM', tokens: 5 },
        { hour: '12 PM', tokens: 8 },
        { hour: '1 PM', tokens: 2 }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Temple Queue Dashboard
      </Typography>
      
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Today's Statistics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Tokens"
            value={stats?.today?.today_tokens || 0}
            icon={<ConfirmationNumber />}
            color="#ff6b35"
            trend={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Passengers"
            value={stats?.today?.today_passengers || 0}
            icon={<People />}
            color="#f7931e"
            trend={8}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Queue Entries"
            value={stats?.today?.today_queue_entries || 0}
            icon={<Queue />}
            color="#4caf50"
            trend={15}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Today"
            value={stats?.today?.today_completed || 0}
            icon={<AccessTime />}
            color="#2196f3"
            trend={5}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Hourly Token Generation Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Hourly Token Generation
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="tokens" stroke="#ff6b35" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Tokens */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Tokens
              </Typography>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {recentTokens.map((token) => (
                  <Box key={token.id} sx={{ mb: 2, p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2">{token.token_number}</Typography>
                      <Chip
                        label={token.status}
                        color={getStatusColor(token.status)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {token.passenger_name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(token.created_at).toLocaleTimeString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        Overall Statistics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Vehicles"
            value={stats?.total?.total_vehicles || 0}
            icon={<DirectionsCar />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Tokens"
            value={stats?.total?.total_tokens || 0}
            icon={<ConfirmationNumber />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Passengers"
            value={stats?.total?.total_passengers || 0}
            icon={<People />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Queue Entries"
            value={stats?.total?.total_queue_entries || 0}
            icon={<Queue />}
            color="#795548"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
