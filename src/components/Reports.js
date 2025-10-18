import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Chip,
  CircularProgress
} from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    vehicle_number: '',
    token_number: ''
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`/api/admin/reports?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'primary';
      case 'completed': return 'success';
      case 'expired': return 'error';
      case 'waiting': return 'warning';
      case 'called': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Vehicle Number"
              value={filters.vehicle_number}
              onChange={(e) => handleFilterChange('vehicle_number', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Token Number"
              value={filters.token_number}
              onChange={(e) => handleFilterChange('token_number', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={fetchReports}
              disabled={loading}
              sx={{ mr: 2 }}
            >
              {loading ? 'Loading...' : 'Apply Filters'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setFilters({
                  start_date: '',
                  end_date: '',
                  vehicle_number: '',
                  token_number: ''
                });
                setTimeout(fetchReports, 100);
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Token Number</TableCell>
                <TableCell>Vehicle Number</TableCell>
                <TableCell>Passengers</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Queue Number</TableCell>
                <TableCell>Queue Status</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.token_number}>
                  <TableCell>{report.token_number}</TableCell>
                  <TableCell>{report.vehicle_number}</TableCell>
                  <TableCell>
                    {report.passengers_filled}/{report.passenger_count}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={report.status}
                      color={getStatusColor(report.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{report.queue_number || '-'}</TableCell>
                  <TableCell>
                    {report.queue_status ? (
                      <Chip
                        label={report.queue_status}
                        color={getStatusColor(report.queue_status)}
                        size="small"
                      />
                    ) : '-'}
                  </TableCell>
                  <TableCell>{report.created_by}</TableCell>
                  <TableCell>
                    {format(new Date(report.created_at), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Reports;
