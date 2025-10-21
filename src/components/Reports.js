import React, { useState, useEffect, useCallback } from 'react';
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
import { apiClient } from '../utils/api';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    vehicle_number: '',
    token_number: ''
  });

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await apiClient.get(`/api/admin/reports?${params}`);
      setReports(response.data.reports || response.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'primary';
      case 'waiting': return 'warning';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Vehicle Number"
              value={filters.vehicle_number}
              onChange={(e) => handleFilterChange('vehicle_number', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              onClick={fetchReports}
              disabled={loading}
              fullWidth
            >
              Apply Filters
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
                <TableCell>Passenger Count</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id || report.token_number}>
                  <TableCell>{report.token_number}</TableCell>
                  <TableCell>{report.vehicle_number}</TableCell>
                  <TableCell>{report.passenger_count}</TableCell>
                  <TableCell>
                    <Chip
                      label={report.status}
                      color={getStatusColor(report.status)}
                      size="small"
                    />
                  </TableCell>
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
