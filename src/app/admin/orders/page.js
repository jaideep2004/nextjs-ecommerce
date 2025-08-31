'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from 'axios';    

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Status chip colors
const statusColors = {
  pending: { bg: '#FFF8E1', color: '#F57F17' },
  processing: { bg: '#E3F2FD', color: '#1565C0' },
  shipped: { bg: '#E8F5E9', color: '#2E7D32' },
  delivered: { bg: '#E0F2F1', color: '#00695C' },
  cancelled: { bg: '#FFEBEE', color: '#C62828' },
};

// Get order status
const getOrderStatus = (order) => {
  if (order.orderStatus) return order.orderStatus;
  if (order.isDelivered) return 'Delivered';
  if (order.isShipped) return 'Shipped';
  if (order.isPaid) return 'Processing';
  return 'Pending';
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page + 1, // API uses 1-indexed pages
        limit: rowsPerPage,
        sortBy,
        sortOrder,
      });
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      if (searchQuery.trim()) {   
        params.append('search', searchQuery.trim());
      }
      
      const url = `/api/admin/orders?${params.toString()}`;
      console.log('Fetching orders from URL:', url);
      
      const response = await axios.get(url);
      console.log('Full API response:', response.data);
      
      // The API is now consistently returning { status, data, message, timestamp }
      // where data contains { orders, totalOrders }
      if (response.data && response.data.data) {
        const apiData = response.data.data;
        console.log('API data object:', apiData);
        
        // Log orders object type and structure
        console.log('Orders data type:', Array.isArray(apiData.orders) ? 'Array' : typeof apiData.orders);
        console.log('Orders data length:', Array.isArray(apiData.orders) ? apiData.orders.length : 'N/A');
        
        if (Array.isArray(apiData.orders)) {
          console.log('Found orders array with length:', apiData.orders.length);
          // Sample the first order if available
          if (apiData.orders.length > 0) {
            console.log('Sample order data:', apiData.orders[0]);
          }
          setOrders(apiData.orders);
          setTotalOrders(apiData.totalOrders || 0);
        } else {
          console.error('API data does not contain orders array:', apiData);
          setOrders([]);
          setTotalOrders(0);
        }
      } else {
        console.error('Unexpected API response format:', response.data);
        setError('Received unexpected data format from server');
        setOrders([]);
        setTotalOrders(0);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter, sortBy, sortOrder, searchQuery]);
  
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0); // Reset to first page when searching
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setPage(0);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0); // Reset to first page when filtering
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(0); // Reset to first page when sorting
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setPage(0); // Reset to first page when changing sort order
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            color: '#2c3e50',
            mb: 1,
          }}
        >
          Orders Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage customer orders, shipping, and fulfillment
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        {/* Filters and Search */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Orders"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e);
                }
              }}
              placeholder="Order ID, Customer Name, Email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClearSearch} edge="end">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="sort-by-label">Sort By</InputLabel>
              <Select
                labelId="sort-by-label"
                value={sortBy}
                label="Sort By"
                onChange={handleSortChange}
              >
                <MenuItem value="createdAt">Order Date</MenuItem>
                <MenuItem value="totalAmount">Total Amount</MenuItem>
                <MenuItem value="status">Status</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="sort-order-label">Order</InputLabel>
              <Select
                labelId="sort-order-label"
                value={sortOrder}
                label="Order"
                onChange={handleSortOrderChange}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {loading && !error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders && orders.length > 0 ? (
                    orders.map((order) => {
                      console.log('Rendering order:', order);
                      return (
                        <TableRow key={order._id || Math.random()} hover sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#2196f3' }}>
                              #{order._id ? order._id.slice(-8).toUpperCase() : 'UNKNOWN'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {order.user?.name || 'Guest'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {order.user?.email || order.shippingAddress?.email || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {order.orderItems?.length || 0} items
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {formatCurrency(order.totalPrice || 0)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getOrderStatus(order).charAt(0).toUpperCase() + getOrderStatus(order).slice(1) || 'Pending'}
                              size="small"
                              sx={{
                                bgcolor: statusColors[getOrderStatus(order)?.toLowerCase() || 'pending']?.bg || '#f5f5f5',
                                color: statusColors[getOrderStatus(order)?.toLowerCase() || 'pending']?.color || 'text.primary',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              onClick={() => window.location.href = `/admin/orders/${order._id}`}
                              size="small"
                              sx={{ color: '#2196f3', '&:hover': { bgcolor: '#e3f2fd' } }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          No orders found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={totalOrders}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>
    </Container>
  );
}