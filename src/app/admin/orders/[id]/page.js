'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  Button,
  Stepper,
  Step,
  StepLabel,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Snackbar,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Status steps mapping
const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];

// Status colors
const statusColors = {
  pending: { bg: '#FFF8E1', color: '#F57F17' },
  processing: { bg: '#E3F2FD', color: '#1565C0' },
  shipped: { bg: '#E8F5E9', color: '#2E7D32' },
  delivered: { bg: '#E0F2F1', color: '#00695C' },
  cancelled: { bg: '#FFEBEE', color: '#C62828' },
};

export default function OrderDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id;
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push(`/login?redirect=/admin/orders/${orderId}`);
      return;
    }

    if (user && user.role === 'admin' && orderId) {
      fetchOrder();
    }
  }, [user, authLoading, router, orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      console.log('Fetching order details for ID:', orderId);
      
      const { data } = await axios.get(`/api/admin/orders/${orderId}`);
      console.log('Order data received:', data);
      
      setOrder(data);
      
      // Initialize dialog fields with current values
      if (data) {
        setNewStatus(data.status);
        setTrackingNumber(data.trackingNumber || '');
        setTrackingUrl(data.trackingUrl || '');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatusDialog = () => {
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
  };

  const handleUpdateStatus = async () => {
    try {
      setLoading(true);
      
      const updateData = {
        status: newStatus,
        trackingNumber: trackingNumber.trim() || undefined,
        trackingUrl: trackingUrl.trim() || undefined,
        statusNote: statusNote.trim() || undefined,
      };
      
      console.log('Updating order status for ID:', orderId, 'with data:', updateData);
      
      await axios.put(`/api/admin/orders/${orderId}`, updateData);
      console.log('Order status updated successfully');
      
      await fetchOrder(); // Refresh order data
      handleCloseStatusDialog();
      setSnackbar({
        open: true,
        message: 'Order status updated successfully',
        severity: 'success',
      });
    } catch (err) {
      console.error('Error updating order status:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.message || 'Failed to update order status',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getActiveStep = () => {
    if (order?.status === 'cancelled') return -1;
    return statusSteps.indexOf(order?.status);
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

  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">Order not found</Alert>
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
              <Link href="/admin/orders" passHref>
                <MuiLink underline="hover" color="inherit">
                  Orders
                </MuiLink>
              </Link>
              <Typography color="text.primary">Order Details</Typography>
            </Breadcrumbs>
          </Paper>

          {/* Order Header */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h6" component="h2">
                  Order #{order._id.substring(order._id.length - 8).toUpperCase()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Placed on {formatDate(order.createdAt)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PrintIcon />}
                  onClick={() => window.print()}
                >
                  Print
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EmailIcon />}
                  onClick={() => window.location.href = `mailto:${order.user?.email || order.shippingAddress?.email}`}
                >
                  Email Customer
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleOpenStatusDialog}
                  sx={{ 
                    bgcolor: '#8D6E63',
                    '&:hover': { bgcolor: '#6D4C41' },
                  }}
                >
                  Update Status
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Order Status */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  Status:
                </Typography>
                <Chip
                  label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  sx={{
                    bgcolor: statusColors[order.status]?.bg || '#f5f5f5',
                    color: statusColors[order.status]?.color || 'text.primary',
                    fontWeight: 'medium',
                  }}
                />
              </Box>

              {order.status !== 'cancelled' && (
                <Stepper activeStep={getActiveStep()} alternativeLabel sx={{ mt: 3 }}>
                  <Step>
                    <StepLabel>Order Placed</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Processing</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Shipped</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Delivered</StepLabel>
                  </Step>
                </Stepper>
              )}

              {order.trackingNumber && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Tracking Number: {order.trackingUrl ? (
                      <MuiLink href={order.trackingUrl} target="_blank" rel="noopener noreferrer">
                        {order.trackingNumber}
                      </MuiLink>
                    ) : (
                      order.trackingNumber
                    )}
                  </Typography>
                </Box>
              )}

              {order.statusNote && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Note: {order.statusNote}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          <Grid container spacing={3}>
            {/* Order Items */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                  Order Items
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.orderItems.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ position: 'relative', width: 60, height: 60, mr: 2 }}>
                                <Image
                                  src={item.image || '/images/placeholder.png'}
                                  alt={item.name}
                                  fill
                                  style={{ objectFit: 'contain' }}
                                />
                              </Box>
                              <Box>
                                <Typography variant="body2">{item.name}</Typography>
                                {item.color && (
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    Color: {item.color}
                                  </Typography>
                                )}
                                {item.size && (
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    Size: {item.size}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell align="center">{item.quantity}</TableCell>
                          <TableCell align="right">{formatCurrency(item.price * item.quantity)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                  Order Summary
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">{formatCurrency(order.subtotal)}</Typography>
                </Box>
                {order.discount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Discount</Typography>
                    <Typography variant="body2" color="error">
                      -{formatCurrency(order.discount)}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Shipping</Typography>
                  <Typography variant="body2">{formatCurrency(order.shippingPrice)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Tax</Typography>
                  <Typography variant="body2">{formatCurrency(order.taxPrice)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {formatCurrency(order.totalAmount)}
                  </Typography>
                </Box>
                {order.couponCode && (
                  <Box sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2">
                      Coupon Applied: <strong>{order.couponCode}</strong>
                    </Typography>
                  </Box>
                )}
              </Paper>

              {/* Payment Information */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PaymentIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h3">
                    Payment Information
                  </Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Payment Method
                  </Typography>
                  <Typography variant="body1">
                    {order.paymentMethod || 'Not specified'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Payment Status
                  </Typography>
                  <Chip
                    label={order.isPaid ? 'Paid' : 'Unpaid'}
                    size="small"
                    sx={{
                      bgcolor: order.isPaid ? '#E8F5E9' : '#FFEBEE',
                      color: order.isPaid ? '#2E7D32' : '#C62828',
                    }}
                  />
                </Box>
                {order.isPaid && order.paidAt && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Paid On
                    </Typography>
                    <Typography variant="body1">{formatDate(order.paidAt)}</Typography>
                  </Box>
                )}
                {order.transactionId && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Transaction ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                      {order.transactionId}
                    </Typography>
                  </Box>
                )}
              </Paper>

              {/* Shipping Information */}
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ShippingIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h3">
                    Shipping Information
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Customer
                  </Typography>
                  <Typography variant="body1">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </Typography>
                  <Typography variant="body2">
                    {order.user?.email || order.shippingAddress.email}
                  </Typography>
                  {order.shippingAddress.phone && (
                    <Typography variant="body2">{order.shippingAddress.phone}</Typography>
                  )}
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1">
                    {order.shippingAddress.address}
                  </Typography>
                  {order.shippingAddress.address2 && (
                    <Typography variant="body1">{order.shippingAddress.address2}</Typography>
                  )}
                  <Typography variant="body1">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </Typography>
                  <Typography variant="body1">{order.shippingAddress.country}</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Update Status Dialog */}
      <Dialog open={openStatusDialog} onClose={handleCloseStatusDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update the status and tracking information for this order.
          </DialogContentText>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={newStatus}
              label="Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Tracking Number (Optional)"
            fullWidth
            variant="outlined"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Tracking URL (Optional)"
            fullWidth
            variant="outlined"
            value={trackingUrl}
            onChange={(e) => setTrackingUrl(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Status Note (Optional)"
            fullWidth
            variant="outlined"
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseStatusDialog}>Cancel</Button>
          <Button 
            onClick={handleUpdateStatus} 
            variant="contained"
            disabled={loading}
            sx={{ 
              bgcolor: '#8D6E63',
              '&:hover': { bgcolor: '#6D4C41' },
            }}
          >
            {loading ? 'Updating...' : 'Update'}
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