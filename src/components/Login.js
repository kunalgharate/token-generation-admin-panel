import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { apiClient } from '../utils/api';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/api/auth/login', credentials);
      console.log('Full login response:', response.data);
      
      // Handle different response structures
      let token, user;
      
      if (response.data.token && response.data.user) {
        // Structure: { token, user }
        token = response.data.token;
        user = response.data.user;
      } else if (response.data.accessToken) {
        // Structure: { accessToken, ...userFields }
        token = response.data.accessToken;
        user = response.data;
      } else if (response.data.role) {
        // Structure: { role, username, token, ... }
        token = response.data.token;
        user = response.data;
      } else {
        // Fallback
        token = response.data.token;
        user = response.data;
      }
      
      console.log('Extracted user:', user);
      console.log('User role:', user?.role);
      
      if (!user || !user.role) {
        setError('Invalid response from server. User data missing.');
        return;
      }
      
      if (user.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        return;
      }
      
      onLogin(user, token);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || error.response?.data?.error || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Temple Queue Admin
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
