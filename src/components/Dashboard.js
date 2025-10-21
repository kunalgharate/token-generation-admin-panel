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
import { apiClient } from '../utils/api';

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
  const [stats, setStats] = useState(null);
  const [recentTokens, setRecentTokens] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard stats
      const statsResponse = await apiClient.get('/admin/dashboard');
      setStats(statsResponse.data);

      // Fetch recent tokens
      const tokensResponse = await apiClient.get('/admin/recent-tokens');
      setRecentTokens(tokensResponse.data.tokens || []);

      // Fetch hourly data for chart
      const chartResponse = await apiClient.get('/admin/hourly-stats');
      setChartData(chartResponse.data.hourly_data || []);

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
            trend={stats?.today?.tokens_trend}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Passengers"
            value={stats?.today?.today_passengers || 0}
            icon={<People />}
            color="#f7931e"
            trend={stats?.today?.passengers_trend}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Queue Entries"
            value={stats?.today?.today_queue_entries || 0}
            icon={<Queue />}
            color="#4caf50"
            trend={stats?.today?.queue_trend}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Today"
            value={stats?.today?.today_completed || 0}
            icon={<AccessTime />}
            color="#2196f3"
            trend={stats?.today?.completed_trend}
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
