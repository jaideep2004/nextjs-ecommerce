'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Pagination,
  Breadcrumbs,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { NavigateNext, ArrowBack } from '@mui/icons-material';

export default function CustomerOrders() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  const limit = 10; // Orders per page
  
  // Redirect if user is not logged in
  useEffect(() => {
    if (!authLoading && !user && typeof window !== 'undefined') {
      router.push('/login?redirect=/customer/orders');
    }
  }, [user, authLoading, router]);
  
  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams({
          page,
          limit,
          sort: sortBy === 'newest' ? '-createdAt' : 'createdAt',
        });
        
        if (statusFilter !== 'all') {
          params.append('orderStatus', statusFilter);
        }
        
        const res = await fetch(`/api/orders?${params.toString()}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await res.json();
        if (!data.data || !data.data.orders || !Array.isArray(data.data.orders)) {
          setOrders([]);
          setTotalPages(0);
        } else {
          setOrders(data.data.orders);
          setTotalPages(Math.ceil(data.data.pagination.total / limit));
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user, page, statusFilter, sortBy]);
  
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1); // Reset to first page when filter changes
  };
  
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1); // Reset to first page when sort changes
  };
  
  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Processing':
        return 'info';
      case 'Shipped':
        return 'primary';
      case 'Delivered':
        return 'success';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };
  
  if (authLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#8D6E63' }} />
      </Container>
    );
  }
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs 
        separator={<NavigateNext fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link href="/" passHref>
          <Typography color="inherit" sx={{ '&:hover': { textDecoration: 'underline' } }}>
            Home
          </Typography>
        </Link>
        <Link href="/customer/dashboard" passHref>
          <Typography color="inherit" sx={{ '&:hover': { textDecoration: 'underline' } }}>
            My Account
          </Typography>
        </Link>
        <Typography color="text.primary">My Orders</Typography>
      </Breadcrumbs>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button 
          component={Link} 
          href="/customer/dashboard"
          startIcon={<ArrowBack />}
          sx={{ mr: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          My Orders
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        {/* Filters */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="Status"
              size="small"
            >
              <MenuItem value="all">All Orders</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              value={sortBy}
              onChange={handleSortChange}
              label="Sort By"
              size="small"
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#8D6E63' }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : orders.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {statusFilter === 'all' 
                ? "You haven't placed any orders yet." 
                : `You don't have any ${statusFilter.toLowerCase()} orders.`}
            </Typography>
            {statusFilter !== 'all' ? (
              <Button 
                onClick={() => setStatusFilter('all')}
                variant="outlined"
                sx={{ mr: 2 }}
              >
                View All Orders
              </Button>
            ) : null}
            <Button 
              component={Link} 
              href="/products" 
              variant="contained"
              sx={{ 
                bgcolor: '#8D6E63',
                '&:hover': { bgcolor: '#6D4C41' },
              }}
            >
              Start Shopping
            </Button>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell component="th" scope="row">
                        #{order._id && order._id.substring(0, 8)}
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {order.orderItems && order.orderItems.length ? 
                          `${order.orderItems.length} ${order.orderItems.length === 1 ? 'item' : 'items'}` : 
                          '0 items'}
                      </TableCell>
                      <TableCell align="right">
                        ${order.totalPrice.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={order.orderStatus} 
                          color={getStatusColor(order.orderStatus)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button 
                          component={Link} 
                          href={`/customer/orders/${order._id}`}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            borderColor: '#8D6E63',
                            color: '#8D6E63',
                            '&:hover': { borderColor: '#6D4C41', color: '#6D4C41' },
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary"
                  sx={{ 
                    '& .MuiPaginationItem-root.Mui-selected': { bgcolor: '#8D6E63' },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
}