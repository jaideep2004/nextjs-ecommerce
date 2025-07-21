'use client';

import { useState, useEffect } from 'react';
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
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
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
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && (!user || !user.isAdmin)) {
      router.push('/login?redirect=/admin/orders');
      return;
    }

    if (user && user.isAdmin) {
      fetchOrders();
    }
  }, [user, authLoading, router, page, rowsPerPage, statusFilter, sortBy, sortOrder]);

  const fetchOrders = async () => {
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
  };

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
    fetchOrders();
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

  if (authLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
              <MuiLink underline="hover" color="inherit" component={Link} href="/admin/dashboard">
                Dashboard
              </MuiLink>
              <Typography color="text.primary">Orders</Typography>
            </Breadcrumbs>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
              Orders Management
            </Typography>

            {/* Filters and Search */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <form onSubmit={handleSearch} style={{ display: 'flex', flexGrow: 1 }}>
                <TextField
                  label="Search Orders"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Order ID, Customer Name, Email"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton type="submit" edge="end">
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ maxWidth: { xs: '100%', sm: 300 } }}
                />
              </form>

              <FormControl size="small" sx={{ minWidth: 120 }}>
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

              <FormControl size="small" sx={{ minWidth: 150 }}>
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

              <FormControl size="small" sx={{ minWidth: 120 }}>
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
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {loading && !error ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                  <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Items</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders && orders.length > 0 ? (
                        orders.map((order) => {
                          console.log('Rendering order:', order);
                          return (
                            <TableRow key={order._id || Math.random()}>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                  {order._id ? order._id.slice(-8).toUpperCase() : 'UNKNOWN'}
                              </Typography>
                            </TableCell>
                              <TableCell>{order.createdAt ? formatDate(order.createdAt) : 'N/A'}</TableCell>
                            <TableCell>
                              <Typography variant="body2">{order.user?.name || 'Guest'}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {order.user?.email || order.shippingAddress?.email || '-'}
                              </Typography>
                            </TableCell>
                            <TableCell>{order.orderItems?.length || 0}</TableCell>
                              <TableCell>{formatCurrency(order.totalPrice || 0)}</TableCell>
                            <TableCell>
                              <Chip
                                  label={getOrderStatus(order).charAt(0).toUpperCase() + getOrderStatus(order).slice(1) || 'Pending'}
                                size="small"
                                sx={{
                                    bgcolor: statusColors[getOrderStatus(order)?.toLowerCase() || 'pending']?.bg || '#f5f5f5',
                                    color: statusColors[getOrderStatus(order)?.toLowerCase() || 'pending']?.color || 'text.primary',
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                color="primary"
                                onClick={() => router.push(`/admin/orders/${order._id}`)}
                                size="small"
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            No orders found
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
      </Box>
    </Box>
  );
}