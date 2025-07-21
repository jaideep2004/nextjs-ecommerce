'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Breadcrumbs,
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
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  NavigateNext,
  ArrowBack,
  LocalShipping,
  Payment,
  Inventory,
  CheckCircle,
  AccessTime,
} from '@mui/icons-material';

export default function OrderDetails({ params }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const orderId = params.id;
  
  // Redirect if user is not logged in
  useEffect(() => {
    if (!authLoading && !user && typeof window !== 'undefined') {
      router.push('/login?redirect=/customer/orders/' + orderId);
    }
  }, [user, authLoading, router, orderId]);
  
  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user || !orderId) return;
      
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${orderId}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Order not found');
          } else if (res.status === 403) {
            throw new Error('You do not have permission to view this order');
          } else {
            throw new Error('Failed to fetch order details');
          }
        }
        
        const response = await res.json();
        
        // Handle the API response structure correctly
        if (response.data) {
          setOrder(response.data);
        } else if (response._id) {
          // In case the API returns order directly without wrapping in 'data'
          setOrder(response);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [user, orderId]);
  
  // Get active step based on order status
  const getActiveStep = (status) => {
    if (!status) return 0;
    switch (status) {
      case 'Pending':
        return 0;
      case 'Processing':
        return 1;
      case 'Shipped':
        return 2;
      case 'Delivered':
        return 3;
      case 'Cancelled':
        return -1; // Special case for cancelled orders
      default:
        return 0;
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Safe access to nested properties
  const getOrderId = () => {
    if (!order?._id) return 'N/A';
    return typeof order._id === 'string' ? order._id.substring(0, 8) : order._id.toString().substring(0, 8);
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
        <Link href="/customer/orders" passHref>
          <Typography color="inherit" sx={{ '&:hover': { textDecoration: 'underline' } }}>
            My Orders
          </Typography>
        </Link>
        <Typography color="text.primary">Order Details</Typography>
      </Breadcrumbs>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button 
          component={Link} 
          href="/customer/orders"
          startIcon={<ArrowBack />}
          sx={{ mr: 2 }}
        >
          Back to Orders
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Order Details
        </Typography>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#8D6E63' }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : order ? (
        <>
          {/* Order Status */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" component="h2">
                  Order #{getOrderId()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Placed on {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                </Typography>
              </Box>
              <Chip 
                label={order.orderStatus} 
                color={order.orderStatus === 'Cancelled' ? 'error' : 
                       order.orderStatus === 'Delivered' ? 'success' : 
                       order.orderStatus === 'Shipped' ? 'primary' : 
                       order.orderStatus === 'Processing' ? 'info' : 'warning'}
              />
            </Box>
            
            {order.orderStatus !== 'Cancelled' && (
              <Stepper activeStep={getActiveStep(order.orderStatus)} alternativeLabel>
                <Step>
                  <StepLabel StepIconProps={{ 
                    icon: <AccessTime />,
                    active: order.orderStatus === 'Pending',
                    completed: getActiveStep(order.orderStatus) > 0,
                  }}>
                    Order Placed
                    {order.createdAt && (
                      <Typography variant="caption" display="block">
                        {formatDate(order.createdAt)}
                      </Typography>
                    )}
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel StepIconProps={{ 
                    icon: <Payment />,
                    active: order.orderStatus === 'Processing',
                    completed: getActiveStep(order.orderStatus) > 1,
                  }}>
                    Processing
                    {order.paidAt && (
                      <Typography variant="caption" display="block">
                        {formatDate(order.paidAt)}
                      </Typography>
                    )}
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel StepIconProps={{ 
                    icon: <LocalShipping />,
                    active: order.orderStatus === 'Shipped',
                    completed: getActiveStep(order.orderStatus) > 2,
                  }}>
                    Shipped
                    {order.shippedAt && (
                      <Typography variant="caption" display="block">
                        {formatDate(order.shippedAt)}
                      </Typography>
                    )}
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel StepIconProps={{ 
                    icon: <CheckCircle />,
                    active: order.orderStatus === 'Delivered',
                    completed: order.orderStatus === 'Delivered',
                  }}>
                    Delivered
                    {order.deliveredAt && (
                      <Typography variant="caption" display="block">
                        {formatDate(order.deliveredAt)}
                      </Typography>
                    )}
                  </StepLabel>
                </Step>
              </Stepper>
            )}
            
            {order.orderStatus === 'Cancelled' && (
              <Alert severity="error" sx={{ mt: 2 }}>
                This order was cancelled on {formatDate(order.updatedAt)}.
                {order.cancelReason && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Reason: {order.cancelReason}
                  </Typography>
                )}
              </Alert>
            )}
            
            {order.orderStatus === 'Shipped' && order.trackingNumber && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Tracking Number:</strong> {order.trackingNumber}
                </Typography>
                {order.trackingUrl && (
                  <Button 
                    component="a" 
                    href={order.trackingUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    Track Package
                  </Button>
                )}
              </Alert>
            )}
          </Paper>
          
          <Grid container spacing={4}>
            {/* Order Items */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, mb: { xs: 4, md: 0 } }}>
                <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
                  Order Items
                </Typography>
                
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.orderItems && order.orderItems.length > 0 ? (
                        order.orderItems.map((item, index) => (
                          <TableRow key={item._id || index}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ position: 'relative', width: 60, height: 60, mr: 2 }}>
                                  <Image
                                    src={item.image || '/images/placeholder.png'}
                                    alt={item.name || 'Product'}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                  />
                                </Box>
                                <Box>
                                  <Typography variant="body1">
                                    {item.slug ? (
                                      <Link href={`/product/${item.slug}`} passHref>
                                        <Typography 
                                          component="span" 
                                          sx={{ 
                                            color: 'inherit', 
                                            '&:hover': { color: '#8D6E63' } 
                                          }}
                                        >
                                          {item.name || 'Product Name'}
                                        </Typography>
                                      </Link>
                                    ) : (
                                      <Typography component="span">
                                        {item.name || 'Product Name'}
                                      </Typography>
                                    )}
                                  </Typography>
                                  {item.color && (
                                    <Typography variant="body2" color="text.secondary">
                                      Color: {item.color}
                                    </Typography>
                                  )}
                                  {item.size && (
                                    <Typography variant="body2" color="text.secondary">
                                      Size: {item.size}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>${(item.price || 0).toFixed(2)}</TableCell>
                            <TableCell align="center">{item.quantity || 0}</TableCell>
                            <TableCell align="right">${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">No items in this order</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            
            {/* Order Summary */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
                  Order Summary
                </Typography>
                
                <List disablePadding>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Subtotal" />
                    <Typography variant="body2">${(order.itemsPrice || 0).toFixed(2)}</Typography>
                  </ListItem>
                  
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Shipping" />
                    <Typography variant="body2">${(order.shippingPrice || 0).toFixed(2)}</Typography>
                  </ListItem>
                  
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Tax" />
                    <Typography variant="body2">${(order.taxPrice || 0).toFixed(2)}</Typography>
                  </ListItem>
                  
                  {(order.discount || 0) > 0 && (
                    <ListItem sx={{ py: 1, px: 0 }}>
                      <ListItemText primary="Discount" />
                      <Typography variant="body2" color="error.main">
                        -${(order.discount || 0).toFixed(2)}
                      </Typography>
                    </ListItem>
                  )}
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Total" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      ${(order.totalPrice || 0).toFixed(2)}
                    </Typography>
                  </ListItem>
                </List>
              </Paper>
              
              {/* Payment Information */}
              <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                  Payment Information
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Payment Method:</strong> {order.paymentMethod ? order.paymentMethod.toUpperCase() : 'N/A'}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Payment Status:</strong> {order.isPaid ? 'Paid' : 'Not Paid'}
                </Typography>
                
                {order.isPaid && order.paidAt && (
                  <Typography variant="body2">
                    <strong>Paid On:</strong> {formatDate(order.paidAt)}
                  </Typography>
                )}
                
                {order.paymentResult && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Transaction ID:</strong> {order.paymentResult.id}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> {order.paymentResult.status}
                    </Typography>
                  </Box>
                )}
              </Paper>
              
              {/* Shipping Information */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                  Shipping Information
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Name:</strong> {order.shippingAddress?.fullName || 'N/A'}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Address:</strong> {order.shippingAddress?.address || 'N/A'}
                  {order.shippingAddress?.city && `, ${order.shippingAddress.city}`}
                  {order.shippingAddress?.postalCode && ` ${order.shippingAddress.postalCode}`}
                  {order.shippingAddress?.country && `, ${order.shippingAddress.country}`}
                </Typography>
                
                {order.shippingAddress?.phone && (
                  <Typography variant="body2">
                    <strong>Phone:</strong> {order.shippingAddress.phone}
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
          
          {/* Action Buttons */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              component={Link} 
              href="/customer/orders"
              startIcon={<ArrowBack />}
            >
              Back to Orders
            </Button>
            
            {order.orderStatus === 'Delivered' && order.orderItems && order.orderItems.length > 0 && order.orderItems[0]?.slug && (
              <Button 
                component={Link} 
                href={`/product/${order.orderItems[0].slug}#review`}
                variant="contained"
                sx={{ 
                  bgcolor: '#8D6E63',
                  '&:hover': { bgcolor: '#6D4C41' },
                }}
              >
                Write a Review
              </Button>
            )}
          </Box>
        </>
      ) : (
        <Alert severity="error">
          Order not found. Please check the order ID and try again.
        </Alert>
      )}
    </Container>
  );
}