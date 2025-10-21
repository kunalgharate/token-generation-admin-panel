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
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  ConfirmationNumber as TokenIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { apiClient } from '../utils/api';

const Tokens = () => {
  const [tokens, setTokens] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    today: 0,
    pending: 0,
    completed: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const response = await apiClient.get('/admin/tokens');
      const tokenData = response.data.tokens || response.data || [];
      
      setTokens(tokenData);
      calculateStats(tokenData);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (tokenData) => {
    const today = new Date().toDateString();
    const todayTokens = tokenData.filter(token => 
      new Date(token.created_at).toDateString() === today
    );
    
    setStats({
      today: todayTokens.length,
      pending: tokenData.filter(t => t.status === 'pending').length,
      completed: tokenData.filter(t => t.status === 'completed').length,
      cancelled: tokenData.filter(t => t.status === 'cancelled').length
    });
  };

  const handleStatusUpdate = async (tokenId, newStatus) => {
    try {
      await apiClient.put(`/admin/tokens/${tokenId}`, { status: newStatus });
      
      // Update local state
      const updatedTokens = tokens.map(t => 
        t.id === tokenId ? { ...t, status: newStatus } : t
      );
      setTokens(updatedTokens);
      calculateStats(updatedTokens);
    } catch (error) {
      console.error('Error updating token status:', error);
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

  const StatusUpdateDialog = () => (
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
      <DialogTitle>Update Token Status</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedToken?.status || ''}
            onChange={(e) => setSelectedToken({...selectedToken, status: e.target.value})}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button 
          onClick={() => {
            handleStatusUpdate(selectedToken.id, selectedToken.status);
            setOpenDialog(false);
          }}
          variant="contained"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );

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
        Token Management
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TokenIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{stats.today}</Typography>
                  <Typography color="textSecondary">Today's Tokens</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TokenIcon color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{stats.pending}</Typography>
                  <Typography color="textSecondary">Pending</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TokenIcon color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{stats.completed}</Typography>
                  <Typography color="textSecondary">Completed</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TokenIcon color="error" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{stats.cancelled}</Typography>
                  <Typography color="textSecondary">Cancelled</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tokens Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Token Number</TableCell>
              <TableCell>Vehicle Number</TableCell>
              <TableCell>Passenger Count</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tokens.map((token) => (
              <TableRow key={token.id}>
                <TableCell>{token.token_number}</TableCell>
                <TableCell>{token.vehicle_number}</TableCell>
                <TableCell>{token.passenger_count}</TableCell>
                <TableCell>
                  <Chip
                    label={token.status?.replace('_', ' ').toUpperCase()}
                    color={getStatusColor(token.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(token.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => {
                      setSelectedToken(token);
                      setOpenDialog(true);
                    }}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <StatusUpdateDialog />
    </Box>
  );
};

export default Tokens;
