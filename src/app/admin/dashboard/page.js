'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeContext } from '@/theme';
import axios from 'axios';
import Link from 'next/link';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Breadcrumbs,
} from '@mui/material';
import {
  Dashboard,
  ShoppingBag,
  People,
  Inventory,
  AttachMoney,
  TrendingUp,
  Category,
  Settings,
  Add,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';

// Dashboard Stat Card Component
const StatCard = ({ title, value, icon, color, percentChange, changeType }) => {
  const { theme } = useThemeContext();
  
  return (
    <Card sx={{ 
      height: '100%',
      bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'white',
      color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography 
              variant="subtitle2" 
              gutterBottom
              sx={{ 
                color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary' 
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
              }}
            >
              {value}
            </Typography>
            {percentChange !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {changeType === 'increase' ? (
                  <ArrowUpward 
                    fontSize="small" 
                    sx={{ 
                      color: theme.palette.mode === 'dark' ? '#4caf50' : 'success.main', 
                      mr: 0.5 
                    }} 
                  />
                ) : (
                  <ArrowDownward 
                    fontSize="small" 
                    sx={{ 
                      color: theme.palette.mode === 'dark' ? '#f44336' : 'error.main', 
                      mr: 0.5 
                    }} 
                  />
                )}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: changeType === 'increase' 
                      ? (theme.palette.mode === 'dark' ? '#4caf50' : 'success.main') 
                      : (theme.palette.mode === 'dark' ? '#f44336' : 'error.main')
                  }}
                >
                  {percentChange}% from last month
                </Typography>
              </Box>
            )}
          </Box>
          <Box 
            sx={{ 
              p: 1.5, 
              borderRadius: '50%', 
              bgcolor: theme.palette.mode === 'dark' ? `${color}.dark` : `${color}.light`,
              color: theme.palette.mode === 'dark' ? '#FFFFFF' : `${color}.main`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Recent Orders Component
const RecentOrders = ({ orders }) => {
  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
      case 'pending':
        return 'warning';
      case 'Processing':
      case 'processing':
        return 'info';
      case 'Shipped':
      case 'shipped':
        return 'primary';
      case 'Delivered':
      case 'delivered':
        return 'success';
      case 'Cancelled':
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Get order status
  const getOrderStatus = (order) => {
    if (order.orderStatus) return order.orderStatus;
    if (order.isDelivered) return 'Delivered';
    if (order.isShipped) return 'Shipped';
    if (order.isPaid) return 'Processing';
    return order.orderStatus || 'Pending';
  };
  
  const { theme } = useThemeContext();
  
  if (!orders || orders.length === 0) {
    return (
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary' 
          }}
        >
          No recent orders found
        </Typography>
      </Box>
    );
  }
  
  return (
    <TableContainer 
      sx={{ 
        bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'white',
        boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow 
            sx={{ 
              bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5' 
            }}
          >
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
              Customer
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
              Amount
            </TableCell>
            <TableCell 
              align="center" 
              sx={{ 
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
              }}
            >
              Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => {
            const orderStatus = order.orderStatus || getOrderStatus(order);
            const userName = order.user?.name || order.user?.email || 'Unknown';
            
            return (
              <TableRow 
                key={order._id} 
                hover
                sx={{
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <TableCell 
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                  }}
                >
                  <Link href={`/admin/orders/${order._id}`} passHref>
                    <Typography 
                      sx={{ 
                        color: theme.palette.mode === 'dark' ? '#a29278' : 'primary.main',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      #{order._id && order._id.substring(0, 8)}
                    </Typography>
                  </Link>
                </TableCell>
                <TableCell 
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                  }}
                >
                  {userName}
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
                    label={orderStatus} 
                    color={getStatusColor(orderStatus)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Low Stock Products Component
const LowStockProducts = ({ products }) => {
  const { theme } = useThemeContext();
  
  if (!products || products.length === 0) {
    return (
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary' 
          }}
        >
          No low stock products found
        </Typography>
      </Box>
    );
  }
  
  return (
    <TableContainer 
      sx={{ 
        bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'white',
        boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow 
            sx={{ 
              bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5' 
            }}
          >
            <TableCell 
              sx={{ 
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
              }}
            >
              Product
            </TableCell>
            <TableCell 
              sx={{ 
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
              }}
            >
              Category
            </TableCell>
            <TableCell 
              align="right" 
              sx={{ 
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
              }}
            >
              Price
            </TableCell>
            <TableCell 
              align="right" 
              sx={{ 
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
              }}
            >
              Stock
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => {
            // Get category name - handle both string and object formats
            const categoryName = typeof product.category === 'object' 
              ? product.category?.name || 'Uncategorized'
              : product.category || 'Uncategorized';
              
            return (
              <TableRow 
                key={product._id} 
                hover
                sx={{
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <TableCell 
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                  }}
                >
                  <Typography 
                    component={Link}
                    href={`/admin/products/${product._id}`}
                    sx={{ 
                      color: theme.palette.mode === 'dark' ? '#a29278' : 'primary.main',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    {product.name}
                  </Typography>
                </TableCell>
                <TableCell 
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                  }}
                >
                  {categoryName}
                </TableCell>
                <TableCell 
                  align="right" 
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                  }}
                >
                  ${product.price.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <Typography 
                    sx={{ 
                      color: product.countInStock <= 5 
                        ? (theme.palette.mode === 'dark' ? '#f44336' : 'error.main') 
                        : (theme.palette.mode === 'dark' ? '#FFFFFF' : 'text.primary'),
                      fontWeight: product.countInStock <= 5 ? 'bold' : 'normal'
                    }}
                  >
                    {product.countInStock}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { theme } = useThemeContext();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Redirect if user is not admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/admin/dashboard');
      } else if (!user.isAdmin) {
        router.push('/');
      }
    }
  }, [user, authLoading, router]);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !user.isAdmin) return;
      
      try {
        setLoading(true);
        console.log('Fetching dashboard data...');
        const response = await axios.get('/api/admin/dashboard');
        console.log('Dashboard data received:', response.data);
        
        // Extract the actual data from the response
        const apiData = response.data.status || response.data.data || response.data;
        
        // Transform API data to match the expected format
        const formattedData = {
          stats: {
            totalSales: apiData.totalSales || 0,
            totalOrders: apiData.totalOrders || 0,
            totalCustomers: apiData.totalUsers || 0,
            totalProducts: apiData.totalProducts || 0,
          },
          salesChange: 0, // We don't have this data yet
          ordersChange: 0, // We don't have this data yet
          customersChange: 0, // We don't have this data yet
          recentOrders: apiData.recentOrders || [],
          lowStockProducts: apiData.lowStockProducts || [],
        };
        
        console.log('Formatted dashboard data:', formattedData);
        setDashboardData(formattedData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);
  
  if (authLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#8D6E63' }} />
      </Container>
    );
  }
  
  if (!user || !user.isAdmin) {
    return null; // Will redirect in useEffect
  }
  
  // Use the dashboard data from API
  const data = dashboardData || {
    stats: {
      totalSales: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalProducts: 0,
    },
    salesChange: 0,
    ordersChange: 0,
    customersChange: 0,
    recentOrders: [],
    lowStockProducts: [],
  };
  
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
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
          Dashboard Overview
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary' 
          }}
        >
          Monitor your store's performance and key metrics
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            component={Link}
            href="/admin/products/new"
            sx={{ 
              bgcolor: '#2196f3',
              '&:hover': { bgcolor: '#1976d2' },
              boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
            }}
          >
            Add New Product
          </Button>
        </Box>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#2196f3' }} size={48} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : (
        <>
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} lg={3}  style={{minWidth: '230px'}}>
              <StatCard 
                title="Total Sales" 
                value={`$${data.stats.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                icon={<AttachMoney />} 
                color="success"
                percentChange={data.salesChange}
                changeType="increase"
                isLoading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3} style={{minWidth: '230px'}}>
              <StatCard 
                title="Total Orders" 
                value={data.stats.totalOrders} 
                icon={<ShoppingBag />} 
                color="info"
                percentChange={data.ordersChange}
                changeType="increase"
                isLoading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3} style={{minWidth: '230px'}}>
              <StatCard 
                title="Total Customers" 
                value={data.stats.totalCustomers} 
                icon={<People />} 
                color="warning"
                percentChange={data.customersChange}
                changeType="increase"
                isLoading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3} style={{minWidth: '230px'}}>
              <StatCard 
                title="Total Products" 
                value={data.stats.totalProducts} 
                icon={<Inventory />} 
                color="primary"
                isLoading={loading}
              />
            </Grid>
          </Grid>
          
          <Grid container spacing={4}>
            {/* Recent Orders */}
            <Grid item xs={12} lg={8}>
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 4px 20px rgba(0,0,0,0.3)' 
                    : '0 4px 20px rgba(0,0,0,0.1)',
                  bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'white',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50' 
                    }}
                  >
                    Recent Orders
                  </Typography>
                  <Button 
                    component={Link} 
                    href="/admin/orders"
                    size="small"
                    variant="outlined"
                  >
                    View All
                  </Button>
                </Box>
                <RecentOrders orders={data.recentOrders} isLoading={loading} />
              </Paper>
            </Grid>
            
            {/* Low Stock Products */}
            <Grid item xs={12} lg={4}>
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 4px 20px rgba(0,0,0,0.3)' 
                    : '0 4px 20px rgba(0,0,0,0.1)',
                  bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'white',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50' 
                    }}
                  >
                    Low Stock Alert
                  </Typography>
                  <Button 
                    component={Link} 
                    href="/admin/products"
                    size="small"
                    variant="outlined"
                  >
                    View All
                  </Button>
                </Box>
                <LowStockProducts products={data.lowStockProducts} isLoading={loading} />
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}