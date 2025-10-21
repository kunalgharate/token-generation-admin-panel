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
  MenuItem
} from '@mui/material';
import {
  ConfirmationNumber as TokenIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import axios from 'axios';

const Tokens = () => {
  const [tokens, setTokens] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [stats, setStats] = useState({
    today: 0,
    pending: 0,
    completed: 0,
    cancelled: 0
  });

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/admin/tokens', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setTokens(response.data.tokens || []);
        calculateStats(response.data.tokens || []);
      } catch (error) {
        console.error('Error fetching tokens:', error);
        // Mock data for development
        const mockTokens = [
          { id: 1, token_number: 'T001', passenger_name: 'Rajesh Kumar', vehicle_type: 'Car', status: 'pending', created_at: '2024-10-20T10:30:00Z' },
          { id: 2, token_number: 'T002', passenger_name: 'Priya Sharma', vehicle_type: 'Bus', status: 'in_progress', created_at: '2024-10-20T11:00:00Z' },
          { id: 3, token_number: 'T003', passenger_name: 'Amit Patel', vehicle_type: 'Car', status: 'completed', created_at: '2024-10-20T09:15:00Z' },
          { id: 4, token_number: 'T004', passenger_name: 'Sunita Devi', vehicle_type: 'Auto', status: 'cancelled', created_at: '2024-10-20T12:00:00Z' }
        ];
        setTokens(mockTokens);
        calculateStats(mockTokens);
      }
    };

    fetchTokens();
  }, []);

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
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/tokens/${tokenId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setTokens(tokens.map(t => 
        t.id === tokenId ? { ...t, status: newStatus } : t
      ));
      calculateStats(tokens.map(t => 
        t.id === tokenId ? { ...t, status: newStatus } : t
      ));
    } catch (error) {
      console.error('Error updating token status:', error);
      // For demo purposes, update locally
      setTokens(tokens.map(t => 
        t.id === tokenId ? { ...t, status: newStatus } : t
      ));
      calculateStats(tokens.map(t => 
        t.id === tokenId ? { ...t, status: newStatus } : t
      ));
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
              <TableCell>Passenger Name</TableCell>
              <TableCell>Vehicle Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tokens.map((token) => (
              <TableRow key={token.id}>
                <TableCell>{token.token_number}</TableCell>
                <TableCell>{token.passenger_name}</TableCell>
                <TableCell>{token.vehicle_type}</TableCell>
                <TableCell>
                  <Chip
                    label={token.status.replace('_', ' ').toUpperCase()}
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
