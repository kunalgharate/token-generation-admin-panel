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
  CardContent,
  CircularProgress
} from '@mui/material';
import { Search as SearchIcon, People as PeopleIcon } from '@mui/icons-material';
import { apiClient } from '../utils/api';

const Passengers = () => {
  const [passengers, setPassengers] = useState([]);
  const [filteredPassengers, setFilteredPassengers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
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
      passenger.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passenger.phone?.includes(searchTerm) ||
      passenger.token_number?.toString().includes(searchTerm)
    );
    setFilteredPassengers(filtered);
  }, [passengers, searchTerm]);

  const fetchPassengers = async () => {
    try {
      const response = await apiClient.get('/api/admin/passengers');
      const passengerData = response.data.passengers || response.data || [];
      
      setPassengers(passengerData);
      
      // Calculate stats
      const total = passengerData.length;
      const active = passengerData.filter(p => p.status === 'waiting' || p.status === 'in_progress').length;
      const completed = passengerData.filter(p => p.status === 'completed').length;
      
      setStats({ total, active, completed });
    } catch (error) {
      console.error('Error fetching passengers:', error);
    } finally {
      setLoading(false);
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
                    label={passenger.status?.replace('_', ' ').toUpperCase()}
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
