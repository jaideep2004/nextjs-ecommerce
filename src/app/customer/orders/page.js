'use client';

import React, { useState, useEffect } from 'react';
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
import CustomerSidebar from '@/components/customer/CustomerSidebar';
import { useThemeContext } from '@/theme'; // Import theme context

export default function CustomerOrders() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { theme } = useThemeContext(); // Get theme context
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
    <Box sx={{ display: 'flex' }}>
      <CustomerSidebar activeTab="orders" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: theme.palette.mode === 'dark' ? '#000000' : '#f5f5f5', // Use theme-aware background
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Paper 
            sx={{ 
              p: 2, 
              mb: 3,
              bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'white',
              boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
              <Link href="/" passHref>
                <Typography 
                  color="inherit" 
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                    cursor: 'pointer',
                    color: theme.palette.mode === 'dark' ? '#a29278' : 'inherit',
                  }}
                >
                  Home
                </Typography>
              </Link>
              <Link href="/customer/dashboard" passHref>
                <Typography 
                  color="inherit" 
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                    cursor: 'pointer',
                    color: theme.palette.mode === 'dark' ? '#a29278' : 'inherit',
                  }}
                >
                  My Account
                </Typography>
              </Link>
              <Typography 
                color="text.primary"
                sx={{
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                }}
              >
                My Orders
              </Typography>
            </Breadcrumbs>
          </Paper>

          {/* Page Header */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50',
                mb: 1,
              }}
            >
              My Orders
            </Typography>
            <Typography 
              variant="body1" 
              sx={{
                color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary',
              }}
            >
              View and track all your orders
            </Typography>
          </Box>
          
          {/* Filters */}
          <Paper 
            sx={{ 
              p: 2, 
              mb: 3,
              bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'white',
              boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel 
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'inherit',
                    }}
                  >
                    Status
                  </InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={handleStatusFilterChange}
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.mode === 'dark' ? '#333333' : 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                      },
                      '.MuiSvgIcon-root': {
                        color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                      },
                    }}
                  >
                    <MenuItem value="all">All Orders</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Processing">Processing</MenuItem>
                    <MenuItem value="Shipped">Shipped</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel 
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'inherit',
                    }}
                  >
                    Sort By
                  </InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={handleSortChange}
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.mode === 'dark' ? '#333333' : 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                      },
                      '.MuiSvgIcon-root': {
                        color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                      },
                    }}
                  >
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Orders Table */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#8D6E63' }} />
            </Box>
          ) : error ? (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'white',
              }}
            >
              {error}
            </Alert>
          ) : orders.length === 0 ? (
            <Paper 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'white',
                boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
              }}
            >
              <Typography 
                variant="h6" 
                sx={{
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                  mb: 2,
                }}
              >
                No orders found
              </Typography>
              <Typography 
                variant="body1" 
                sx={{
                  color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary',
                  mb: 3,
                }}
              >
                You haven't placed any orders yet.
              </Typography>
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
            </Paper>
          ) : (
            <>
              <TableContainer 
                component={Paper}
                sx={{
                  mb: 3,
                  bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'white',
                  boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                <Table>
                  <TableHead sx={{ 
                    bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5' 
                  }}>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                        }}
                      >
                        Order ID
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                        }}
                      >
                        Date
                      </TableCell>
                      <TableCell 
                        align="right" 
                        sx={{ 
                          color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                        }}
                      >
                        Total
                      </TableCell>
                      <TableCell 
                        align="center" 
                        sx={{ 
                          color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                        }}
                      >
                        Status
                      </TableCell>
                      <TableCell 
                        align="right" 
                        sx={{ 
                          color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow 
                        key={order._id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          '&:hover': {
                            bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f9f9f9',
                          },
                        }}
                      >
                        <TableCell 
                          component="th" 
                          scope="row"
                          sx={{ 
                            color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                          }}
                        >
                          #{order._id.substring(0, 8)}
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'inherit' 
                          }}
                        >
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell 
                          align="right" 
                          sx={{ 
                            color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                          }}
                        >
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
                            sx={{
                              color: theme.palette.mode === 'dark' ? '#a29278' : 'primary.main',
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination 
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{
                      '.MuiPaginationItem-root': {
                        color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                      },
                      '.Mui-selected': {
                        bgcolor: theme.palette.mode === 'dark' ? '#a29278' : 'primary.main',
                        color: theme.palette.mode === 'dark' ? '#000000' : '#FFFFFF',
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark' ? '#8b7d65' : 'primary.dark',
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
}