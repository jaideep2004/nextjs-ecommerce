'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push(`/login?redirect=/admin/customers/${customerId}`);
      return;
    }

    if (user && user.role === 'admin' && customerId) {
      fetchCustomerData();
    }
  }, [user, authLoading, router, customerId]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      
      // Fetch customer details
      const customerResponse = await fetch(`/api/admin/customers/${customerId}`);
      if (!customerResponse.ok) {
        throw new Error('Failed to fetch customer details');
      }
      const customerData = await customerResponse.json();
      
      // Fetch customer orders
      const ordersResponse = await fetch(`/api/admin/customers/${customerId}/orders`);
      if (!ordersResponse.ok) {
        throw new Error('Failed to fetch customer orders');
      }
      const ordersData = await ordersResponse.json();
      
      setCustomer(customerData);
      setOrders(ordersData.orders);
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError(err.message || 'Failed to load customer data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!customer) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">Customer not found</Alert>
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
          </Paper>

          {/* Customer Header */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    bgcolor: '#8D6E63',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    fontSize: '1.5rem',
                  }}
                >
                  {customer.name.charAt(0).toUpperCase()}
                </Box>
                <Box>
                  <Typography variant="h6" component="h2">
                    {customer.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                      Customer since {formatDate(customer.createdAt)}
                    </Typography>
                    <Chip
                      label={customer.isBlocked ? 'Blocked' : 'Active'}
                      size="small"
                      sx={{
                        bgcolor: customer.isBlocked ? '#FFEBEE' : '#E8F5E9',
                        color: customer.isBlocked ? '#C62828' : '#2E7D32',
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
                  >
                    Unblock
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<BlockIcon />}
                    onClick={() => handleOpenDialog('block')}
                  >
                    Block
                  </Button>
                )}
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleOpenDialog('delete')}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Paper>

          <Grid container spacing={3}>
            {/* Customer Information */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                  Customer Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary="Full Name" secondary={customer.name} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary="Email" secondary={customer.email} />
                  </ListItem>
                  {customer.phone && (
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon />
                      </ListItemIcon>
                      <ListItemText primary="Phone" secondary={customer.phone} />
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemIcon>
                      <CalendarIcon />
                    </ListItemIcon>
                    <ListItemText primary="Registered" secondary={formatDate(customer.createdAt)} />
                  </ListItem>
                </List>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Default Shipping Address
                </Typography>
                {customer.defaultAddress ? (
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2">
                      {customer.defaultAddress.firstName} {customer.defaultAddress.lastName}
                    </Typography>
                    <Typography variant="body2">{customer.defaultAddress.address}</Typography>
                    {customer.defaultAddress.address2 && (
                      <Typography variant="body2">{customer.defaultAddress.address2}</Typography>
                    )}
                    <Typography variant="body2">
                      {customer.defaultAddress.city}, {customer.defaultAddress.state} {customer.defaultAddress.zipCode}
                    </Typography>
                    <Typography variant="body2">{customer.defaultAddress.country}</Typography>
                    {customer.defaultAddress.phone && (
                      <Typography variant="body2">{customer.defaultAddress.phone}</Typography>
                    )}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No default address set
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Customer Stats */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" component="h3" sx={{ mb: 3 }}>
                  Customer Stats
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#EFEBE9' }}>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Total Orders
                        </Typography>
                        <Typography variant="h4">{customer.orderCount || 0}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#EFEBE9' }}>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Total Spent
                        </Typography>
                        <Typography variant="h4">{formatCurrency(customer.totalSpent)}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#EFEBE9' }}>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Wishlist Items
                        </Typography>
                        <Typography variant="h4">{customer.wishlistCount || 0}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#EFEBE9' }}>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Avg. Order Value
                        </Typography>
                        <Typography variant="h4">
                          {customer.orderCount > 0
                            ? formatCurrency(customer.totalSpent / customer.orderCount)
                            : '$0.00'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>

              {/* Tabs for Orders and Wishlist */}
              <Paper sx={{ p: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                  <Tab label="Orders" icon={<CartIcon />} iconPosition="start" />
                  <Tab label="Wishlist" icon={<WishlistIcon />} iconPosition="start" />
                </Tabs>

                {/* Orders Tab */}
                {tabValue === 0 && (
                  <>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Recent Orders
                    </Typography>
                    {orders.length > 0 ? (
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
                                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    {order._id.substring(order._id.length - 8).toUpperCase()}
                                  </Typography>
                                </TableCell>
                                <TableCell>{formatDate(order.createdAt)}</TableCell>
                                <TableCell>{order.orderItems?.length || 0}</TableCell>
                                <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    size="small"
                                    sx={{
                                      bgcolor: 
                                        order.status === 'pending' ? '#FFF8E1' :
                                        order.status === 'processing' ? '#E3F2FD' :
                                        order.status === 'shipped' ? '#E8F5E9' :
                                        order.status === 'delivered' ? '#E0F2F1' :
                                        '#FFEBEE',
                                      color: 
                                        order.status === 'pending' ? '#F57F17' :
                                        order.status === 'processing' ? '#1565C0' :
                                        order.status === 'shipped' ? '#2E7D32' :
                                        order.status === 'delivered' ? '#00695C' :
                                        '#C62828',
                                    }}
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
                      <Typography variant="body2" color="text.secondary">
                        This customer has not placed any orders yet.
                      </Typography>
                    )}
                    {orders.length > 0 && (
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Button
                          variant="outlined"
                          onClick={() => router.push(`/admin/orders?customer=${customer._id}`)}
                        >
                          View All Orders
                        </Button>
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