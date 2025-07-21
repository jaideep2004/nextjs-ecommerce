'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
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
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
              {value}
            </Typography>
            {percentChange !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {changeType === 'increase' ? (
                  <ArrowUpward fontSize="small" sx={{ color: 'success.main', mr: 0.5 }} />
                ) : (
                  <ArrowDownward fontSize="small" sx={{ color: 'error.main', mr: 0.5 }} />
                )}
                <Typography 
                  variant="body2" 
                  color={changeType === 'increase' ? 'success.main' : 'error.main'}
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
              bgcolor: `${color}.light`,
              color: `${color}.main`,
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
  
  if (!orders || orders.length === 0) {
    return (
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No recent orders found
        </Typography>
      </Box>
    );
  }
  
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => {
            const orderStatus = order.orderStatus || getOrderStatus(order);
            const userName = order.user?.name || order.user?.email || 'Unknown';
            
            return (
              <TableRow key={order._id} hover>
                <TableCell>
                  <Link href={`/admin/orders/${order._id}`} passHref>
                    <Typography 
                      sx={{ 
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      #{order._id && order._id.substring(0, 8)}
                    </Typography>
                  </Link>
                </TableCell>
                <TableCell>{userName}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">${order.totalPrice.toFixed(2)}</TableCell>
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
  if (!products || products.length === 0) {
    return (
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No low stock products found
        </Typography>
      </Box>
    );
  }
  
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Category</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Stock</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => {
            // Get category name - handle both string and object formats
            const categoryName = typeof product.category === 'object' 
              ? product.category?.name || 'Uncategorized'
              : product.category || 'Uncategorized';
              
            return (
              <TableRow key={product._id} hover>
                <TableCell>
                  <Typography 
                    component={Link}
                    href={`/admin/products/${product._id}`}
                    sx={{ 
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    {product.name}
                  </Typography>
                </TableCell>
                <TableCell>{categoryName}</TableCell>
                <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                <TableCell align="right">
                  <Typography 
                    color={product.countInStock <= 5 ? 'error.main' : 'text.primary'}
                    fontWeight={product.countInStock <= 5 ? 'bold' : 'normal'}
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
        
        // Check if response has the expected structure
        let apiData;
        if (response.data && response.data.data) {
          // New API format with nested data
          apiData = response.data.data;
        } else if (response.data) {
          // Old API format with direct data
          apiData = response.data;
        } else {
          console.error('Unexpected API response format:', response.data);
          setError('Received unexpected data format from server');
          return;
        }
        
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
              <Typography color="text.primary">Dashboard</Typography>
            </Breadcrumbs>
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h6" component="h1">
              Admin Dashboard
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              component={Link}
              href="/admin/products/new"
              sx={{ 
                bgcolor: '#8D6E63',
                '&:hover': { bgcolor: '#6D4C41' },
              }}
            >
              Add New Product
            </Button>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#8D6E63' }} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          ) : (
            <>
              {/* Stats Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard 
                    title="Total Sales" 
                    value={`$${data.stats.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                    icon={<AttachMoney />} 
                    color="success"
                    percentChange={data.salesChange}
                    changeType="increase"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard 
                    title="Total Orders" 
                    value={data.stats.totalOrders} 
                    icon={<ShoppingBag />} 
                    color="info"
                    percentChange={data.ordersChange}
                    changeType="increase"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard 
                    title="Total Customers" 
                    value={data.stats.totalCustomers} 
                    icon={<People />} 
                    color="warning"
                    percentChange={data.customersChange}
                    changeType="increase"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard 
                    title="Total Products" 
                    value={data.stats.totalProducts} 
                    icon={<Inventory />} 
                    color="error"
                  />
                </Grid>
              </Grid>
              
              <Grid container spacing={4}>
                {/* Main Content */}
                <Grid item xs={12}>
                  {/* Recent Orders */}
                  <Paper sx={{ p: 3, mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="h2">
                        Recent Orders
                      </Typography>
                      <Button 
                        component={Link} 
                        href="/admin/orders"
                        size="small"
                      >
                        View All
                      </Button>
                    </Box>
                    <RecentOrders orders={data.recentOrders} />
                  </Paper>
                  
                  {/* Low Stock Products */}
                  <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="h2">
                        Low Stock Products
                      </Typography>
                      <Button 
                        component={Link} 
                        href="/admin/products"
                        size="small"
                      >
                        View All
                      </Button>
                    </Box>
                    <LowStockProducts products={data.lowStockProducts} />
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
}