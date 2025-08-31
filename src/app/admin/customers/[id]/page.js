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
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
          Customer Details: {customer.name}
        </Typography>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink 
            component={Link} 
            href="/admin/dashboard" 
            underline="hover" 
            color="inherit"
          >
            Dashboard
          </MuiLink>
          <MuiLink 
            component={Link} 
            href="/admin/customers" 
            underline="hover" 
            color="inherit"
          >
            Customers
          </MuiLink>
          <Typography color="text.primary">Customer Details</Typography>
        </Breadcrumbs>
      </Box>
          
          {/* Customer Header */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
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

          {/* Customer Information */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Customer Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <PersonIcon sx={{ color: '#2196f3' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Full Name" 
                      secondary={customer.name}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <EmailIcon sx={{ color: '#2196f3' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email" 
                      secondary={customer.email}
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
                    />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ color: '#2196f3', mr: 1 }} />
                  Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196f3' }}>
                          {customer.orderCount || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Orders
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50' }}>
                          {formatCurrency(customer.totalSpent)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Spent
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          {/* Orders Section */}
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Recent Orders
            </Typography>
            
            {orders && orders.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                            #{order._id.substring(order._id.length - 8).toUpperCase()}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={`${order.orderItems?.length || 0} items`} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(order.totalAmount || order.totalPrice || 0)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={(order.status || order.orderStatus || 'pending').charAt(0).toUpperCase() + (order.status || order.orderStatus || 'pending').slice(1)}
                            size="small"
                            color={
                              (order.status || order.orderStatus) === 'delivered' ? 'success' :
                              (order.status || order.orderStatus) === 'shipped' ? 'info' :
                              (order.status || order.orderStatus) === 'processing' ? 'warning' :
                              'default'
                            }
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => router.push(`/admin/orders/${order._id}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
          </Paper>

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
    </Container>
  );
}