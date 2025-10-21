import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { Search as SearchIcon, People as PeopleIcon } from '@mui/icons-material';
import axios from 'axios';

const Passengers = () => {
  const [passengers, setPassengers] = useState([]);
  const [filteredPassengers, setFilteredPassengers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0
  });

  useEffect(() => {
    fetchPassengers();
  }, []);

  useEffect(() => {
    const filtered = passengers.filter(passenger =>
      passenger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passenger.phone.includes(searchTerm) ||
      passenger.token_number.toString().includes(searchTerm)
    );
    setFilteredPassengers(filtered);
  }, [passengers, searchTerm]);

  const fetchPassengers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/passengers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPassengers(response.data.passengers || []);
      
      // Calculate stats
      const total = response.data.passengers?.length || 0;
      const active = response.data.passengers?.filter(p => p.status === 'waiting' || p.status === 'in_progress').length || 0;
      const completed = response.data.passengers?.filter(p => p.status === 'completed').length || 0;
      
      setStats({ total, active, completed });
    } catch (error) {
      console.error('Error fetching passengers:', error);
      // Mock data for development
      const mockData = [
        { id: 1, name: 'Rajesh Kumar', phone: '9876543210', token_number: 'T001', status: 'waiting', created_at: '2024-10-20T10:30:00Z' },
        { id: 2, name: 'Priya Sharma', phone: '9876543211', token_number: 'T002', status: 'in_progress', created_at: '2024-10-20T11:00:00Z' },
        { id: 3, name: 'Amit Patel', phone: '9876543212', token_number: 'T003', status: 'completed', created_at: '2024-10-20T09:15:00Z' }
      ];
      setPassengers(mockData);
      setStats({ total: 3, active: 2, completed: 1 });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting': return 'warning';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Passenger Management
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{stats.total}</Typography>
                  <Typography color="textSecondary">Total Passengers</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{stats.active}</Typography>
                  <Typography color="textSecondary">Active Queue</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{stats.completed}</Typography>
                  <Typography color="textSecondary">Completed Today</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by name, phone, or token number..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {/* Passengers Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Token Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPassengers.map((passenger) => (
              <TableRow key={passenger.id}>
                <TableCell>{passenger.token_number}</TableCell>
                <TableCell>{passenger.name}</TableCell>
                <TableCell>{passenger.phone}</TableCell>
                <TableCell>
                  <Chip
                    label={passenger.status.replace('_', ' ').toUpperCase()}
                    color={getStatusColor(passenger.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(passenger.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Passengers;
