'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Breadcrumbs,
  Link as MuiLink,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  ShoppingCart as CartIcon,
  Favorite as WishlistIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);
};

export default function CustomerDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const customerId = params?.id;
  
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);

  const fetchCustomerData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch customer details
      const customerResponse = await fetch(`/api/admin/customers/${customerId}`);
      if (!customerResponse.ok) {
        throw new Error('Failed to fetch customer details');
      }
      const customerData = await customerResponse.json();
      setCustomer(customerData.data || customerData);
      
      try {
      // Fetch customer orders
      const ordersResponse = await fetch(`/api/admin/customers/${customerId}/orders`);
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setOrders(ordersData.data?.orders || []);
        } else {
          console.warn('Failed to fetch customer orders, showing empty orders list');
          setOrders([]);
        }
      } catch (ordersErr) {
        console.error('Error fetching customer orders:', ordersErr);
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError(err.message || 'Failed to load customer data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user || !user.isAdmin) {
      router.push('/login');
      return;
    }

    if (user && user.isAdmin && customerId) {
      fetchCustomerData();
    }
  }, [user, authLoading, router, customerId, fetchCustomerData]);

  const handleOpenDialog = (action) => {
    setDialogAction(action);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmAction = async () => {
    try {
      setLoading(true);
      
      let endpoint = '';
      let method = 'PUT';
      let successMessage = '';
      
      switch (dialogAction) {
        case 'block':
          endpoint = `/api/admin/customers/${customerId}/block`;
          successMessage = `${customer.name} has been blocked`;
          break;
        case 'unblock':
          endpoint = `/api/admin/customers/${customerId}/unblock`;
          successMessage = `${customer.name} has been unblocked`;
          break;
        case 'delete':
          endpoint = `/api/admin/customers/${customerId}`;
          method = 'DELETE';
          successMessage = `${customer.name} has been deleted`;
          break;
        default:
          throw new Error('Invalid action');
      }
      
      const response = await fetch(endpoint, { method });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to perform action');
      }
      
      setSnackbar({
        open: true,
        message: successMessage,
        severity: 'success',
      });
      
      // If customer was deleted, redirect to customers list
      if (dialogAction === 'delete') {
        setTimeout(() => {
          router.push('/admin/customers');
        }, 1500);
      } else {
        // Otherwise refresh customer data
        await fetchCustomerData();
      }
    } catch (err) {
      console.error(`Error performing ${dialogAction} action:`, err);
      setSnackbar({
        open: true,
        message: err.message || `Failed to ${dialogAction} customer`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
      handleCloseDialog();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (authLoading || loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#2196f3' }} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      </Container>
    );
  }

  if (!customer) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>Customer not found</Alert>
      </Container>
    );
  }

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
          Customer Details
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage customer information, orders, and account status
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', mb: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link href="/admin/dashboard" passHref>
            <MuiLink underline="hover" color="inherit">
              Dashboard
            </MuiLink>
          </Link>
          <Link href="/admin/customers" passHref>
            <MuiLink underline="hover" color="inherit">
              Customers
            </MuiLink>
          </Link>
          <Typography color="text.primary">Customer Details</Typography>
        </Breadcrumbs>
        
        {/* Customer Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: '#2196f3',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 3,
                fontSize: '1.5rem',
                fontWeight: 600,
              }}
            >
              {customer.name.charAt(0).toUpperCase()}
            </Box>
            <Box>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
                {customer.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Customer since {formatDate(customer.createdAt)}
                </Typography>
                <Chip
                  label={customer.isBlocked ? 'Blocked' : 'Active'}
                  size="small"
                  sx={{
                    bgcolor: customer.isBlocked ? '#ffebee' : '#e8f5e9',
                    color: customer.isBlocked ? '#c62828' : '#2e7d32',
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {customer.isBlocked ? (
              <Button
                variant="outlined"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => handleOpenDialog('unblock')}
                sx={{ minWidth: 120 }}
              >
                Unblock
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="warning"
                startIcon={<BlockIcon />}
                onClick={() => handleOpenDialog('block')}
                sx={{ minWidth: 120 }}
              >
                Block
              </Button>
            )}
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleOpenDialog('delete')}
              sx={{ minWidth: 120 }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Customer Information Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          backgroundColor: '#fafafa'
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3, 
            fontWeight: 600, 
            color: '#2c3e50',
            display: 'flex',
            alignItems: 'center',
            '&:before': {
              content: '"1"',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: '#2196f3',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 600,
              mr: 2,
            }
          }}
        >
          Customer Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <List sx={{ bgcolor: 'white', borderRadius: 2, p: 2 }}>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <PersonIcon sx={{ color: '#2196f3' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Full Name" 
                  secondary={customer.name}
                  primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }}
                  secondaryTypographyProps={{ fontSize: '1rem', color: 'text.primary' }}
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <EmailIcon sx={{ color: '#2196f3' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Email" 
                  secondary={customer.email}
                  primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }}
                  secondaryTypographyProps={{ fontSize: '1rem', color: 'text.primary' }}
                />
              </ListItem>
              {customer.phone && (
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <PhoneIcon sx={{ color: '#2196f3' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Phone" 
                    secondary={customer.phone}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }}
                    secondaryTypographyProps={{ fontSize: '1rem', color: 'text.primary' }}
                  />
                </ListItem>
              )}
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <CalendarIcon sx={{ color: '#2196f3' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Registered" 
                  secondary={formatDate(customer.createdAt)}
                  primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }}
                  secondaryTypographyProps={{ fontSize: '1rem', color: 'text.primary' }}
                />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 2, height: '100%' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ color: '#2196f3', mr: 1 }} />
                Default Shipping Address
              </Typography>
              {customer.defaultAddress ? (
                <Box sx={{ pl: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    {customer.defaultAddress.firstName} {customer.defaultAddress.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>{customer.defaultAddress.address}</Typography>
                  {customer.defaultAddress.address2 && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>{customer.defaultAddress.address2}</Typography>
                  )}
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {customer.defaultAddress.city}, {customer.defaultAddress.state} {customer.defaultAddress.zipCode}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>{customer.defaultAddress.country}</Typography>
                  {customer.defaultAddress.phone && (
                    <Typography variant="body2">{customer.defaultAddress.phone}</Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  No default address set
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      {/* Customer Statistics Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          backgroundColor: '#fafafa'
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3, 
            fontWeight: 600, 
            color: '#2c3e50',
            display: 'flex',
            alignItems: 'center',
            '&:before': {
              content: '"2"',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: '#4caf50',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 600,
              mr: 2,
            }
          }}
        >
          Customer Statistics
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <CartIcon sx={{ fontSize: 48, mb: 1, opacity: 0.8 }} />
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {customer.orderCount || 0}
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  Total Orders
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h2" sx={{ fontSize: '2rem', mb: 1 }}>💰</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {formatCurrency(customer.totalSpent)}
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  Total Spent
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 25px rgba(255, 152, 0, 0.3)'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <WishlistIcon sx={{ fontSize: 48, mb: 1, opacity: 0.8 }} />
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {customer.wishlistCount || 0}
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  Wishlist Items
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 25px rgba(156, 39, 176, 0.3)'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h2" sx={{ fontSize: '2rem', mb: 1 }}>📊</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {customer.orderCount > 0
                    ? formatCurrency(customer.totalSpent / customer.orderCount)
                    : '$0.00'}
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  Avg. Order Value
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Orders and Activity Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          backgroundColor: '#fafafa'
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3, 
            fontWeight: 600, 
            color: '#2c3e50',
            display: 'flex',
            alignItems: 'center',
            '&:before': {
              content: '"3"',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: '#ff9800',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 600,
              mr: 2,
            }
          }}
        >
          Orders & Activity
        </Typography>
        
        <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 0, overflow: 'hidden' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: '1rem',
                fontWeight: 600,
              }
            }}
          >
            <Tab 
              label="Recent Orders" 
              icon={<CartIcon />} 
              iconPosition="start" 
              sx={{ minWidth: 200 }}
            />
            <Tab 
              label="Wishlist Items" 
              icon={<WishlistIcon />} 
              iconPosition="start" 
              sx={{ minWidth: 200 }}
            />
          </Tabs>

          <Box sx={{ p: 3 }}>

            {/* Orders Tab */}
            {tabValue === 0 && (
              <>
                {orders && orders.length > 0 ? (
                  <>
                    <TableContainer>
                      <Table>
                        <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order._id} hover sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#2196f3' }}>
                                  #{order._id.substring(order._id.length - 8).toUpperCase()}
                                </Typography>
                              </TableCell>
                              <TableCell>{formatDate(order.createdAt)}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={`${order.orderItems?.length || 0} items`} 
                                  size="small" 
                                  sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#2196f3' }}>
                                  {formatCurrency(order.totalAmount || order.totalPrice || 0)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={(order.status || order.orderStatus || 'pending').charAt(0).toUpperCase() + (order.status || order.orderStatus || 'pending').slice(1)}
                                  size="small"
                                  sx={{
                                    bgcolor: 
                                      (order.status || order.orderStatus) === 'pending' ? '#fff8e1' :
                                      (order.status || order.orderStatus) === 'processing' ? '#e3f2fd' :
                                      (order.status || order.orderStatus) === 'shipped' ? '#e8f5e9' :
                                      (order.status || order.orderStatus) === 'delivered' ? '#e0f2f1' :
                                      '#ffebee',
                                    color: 
                                      (order.status || order.orderStatus) === 'pending' ? '#f57f17' :
                                      (order.status || order.orderStatus) === 'processing' ? '#1565c0' :
                                      (order.status || order.orderStatus) === 'shipped' ? '#2e7d32' :
                                      (order.status || order.orderStatus) === 'delivered' ? '#00695c' :
                                      '#c62828',
                                    fontWeight: 600,
                                  }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => router.push(`/admin/orders/${order._id}`)}
                                  sx={{ color: '#2196f3', borderColor: '#2196f3' }}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                      <Button
                        variant="outlined"
                        onClick={() => router.push(`/admin/orders?customer=${customer._id}`)}
                        sx={{ color: '#2196f3', borderColor: '#2196f3' }}
                      >
                        View All Orders
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CartIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      No Orders Yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This customer has not placed any orders yet.
                    </Typography>
                  </Box>
                )}
              </>
            )}

                {/* Wishlist Tab */}
                {tabValue === 1 && (
                  <>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Wishlist Items
                    </Typography>
                    {customer.wishlist && customer.wishlist.length > 0 ? (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Product</TableCell>
                              <TableCell>Price</TableCell>
                              <TableCell>Added On</TableCell>
                              <TableCell align="right">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {customer.wishlist.map((item) => (
                              <TableRow key={item._id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{formatCurrency(item.price)}</TableCell>
                                <TableCell>{formatDate(item.addedAt)}</TableCell>
                                <TableCell align="right">
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => router.push(`/admin/products/edit/${item.product}`)}
                                  >
                                    View Product
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        This customer has no items in their wishlist.
                      </Typography>
                    )}
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogAction === 'block' && 'Block Customer'}
          {dialogAction === 'unblock' && 'Unblock Customer'}
          {dialogAction === 'delete' && 'Delete Customer'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogAction === 'block' && (
              <>Are you sure you want to block <strong>{customer.name}</strong>? They will not be able to log in or place orders.</>  
            )}
            {dialogAction === 'unblock' && (
              <>Are you sure you want to unblock <strong>{customer.name}</strong>? They will regain full access to their account.</>  
            )}
            {dialogAction === 'delete' && (
              <>
                Are you sure you want to delete <strong>{customer.name}</strong>? This action cannot be undone.
                {customer.orderCount > 0 && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    Warning: This customer has {customer.orderCount} orders. Deleting this customer may affect order history.
                  </Typography>
                )}
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleConfirmAction} 
            color={dialogAction === 'delete' ? 'error' : dialogAction === 'unblock' ? 'success' : 'warning'} 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Processing...' : (
              dialogAction === 'block' ? 'Block' : 
              dialogAction === 'unblock' ? 'Unblock' : 'Delete'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}