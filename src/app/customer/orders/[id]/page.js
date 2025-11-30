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
  Stepper,
  Step,
  StepLabel,
  Breadcrumbs,
  Divider,
} from '@mui/material';
import {
  NavigateNext,
  ArrowBack,
  AccessTime,
  Payment,
  LocalShipping,
  CheckCircle,
} from '@mui/icons-material';
import { useThemeContext } from '@/theme'; // Import theme context

export default function OrderDetails({ params }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { theme } = useThemeContext(); // Get theme context
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const orderId = params.id;

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
        <Link href="/customer/orders" passHref>
          <Typography 
            color="inherit" 
            sx={{ 
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
              cursor: 'pointer',
              color: theme.palette.mode === 'dark' ? '#a29278' : 'inherit',
            }}
          >
            My Orders
          </Typography>
        </Link>
        <Typography 
          color="text.primary"
          sx={{
            color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
          }}
        >
          Order Details
        </Typography>
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
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
          }}
        >
          Order Details
        </Typography>
      </Box>
      
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
      ) : order ? (
        <>
          {/* Order Status */}
          <Paper 
            sx={{ 
              p: 3, 
              mb: 4,
              bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'white',
              boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography 
                  variant="h6" 
                  component="h2"
                  sx={{
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                  }}
                >
                  Order #{getOrderId()}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary',
                  }}
                >
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
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 2,
                  bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : undefined,
                }}
              >
                This order was cancelled on {formatDate(order.updatedAt)}.
                {order.cancelReason && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 1,
                      color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'inherit',
                    }}
                  >
                    Reason: {order.cancelReason}
                  </Typography>
                )}
              </Alert>
            )}
            
            {order.orderStatus === 'Shipped' && order.trackingNumber && (
              <Alert 
                severity="info" 
                sx={{ 
                  mt: 2,
                  bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : undefined,
                }}
              >
                <Typography 
                  variant="body2"
                  sx={{
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                  }}
                >
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
              <Paper 
                sx={{ 
                  p: 3, 
                  mb: { xs: 4, md: 0 },
                  bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'white',
                  boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                <Typography 
                  variant="h6" 
                  component="h2" 
                  sx={{ 
                    mb: 3,
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                  }}
                >
                  Order Items
                </Typography>
                
                <TableContainer>
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
                          Product
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                          }}
                        >
                          Price
                        </TableCell>
                        <TableCell 
                          align="center" 
                          sx={{ 
                            color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                          }}
                        >
                          Quantity
                        </TableCell>
                        <TableCell 
                          align="right" 
                          sx={{ 
                            color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                          }}
                        >
                          Total
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.orderItems && order.orderItems.length > 0 ? (
                        order.orderItems.map((item, index) => (
                          <TableRow 
                            key={index}
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell 
                              sx={{ 
                                color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {item.image && (
                                  <Box
                                    component="img"
                                    src={item.image}
                                    alt={item.name}
                                    sx={{
                                      width: 60,
                                      height: 60,
                                      objectFit: 'cover',
                                      borderRadius: 1,
                                      mr: 2,
                                    }}
                                  />
                                )}
                                <Box>
                                  <Typography 
                                    variant="body1" 
                                    sx={{
                                      fontWeight: 'medium',
                                      color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                                    }}
                                  >
                                    {item.name}
                                  </Typography>
                                  {item.color && (
                                    <Typography 
                                      variant="body2" 
                                      sx={{
                                        color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary',
                                      }}
                                    >
                                      Color: {item.color}
                                    </Typography>
                                  )}
                                  {item.size && (
                                    <Typography 
                                      variant="body2" 
                                      sx={{
                                        color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary',
                                      }}
                                    >
                                      Size: {item.size}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell 
                              sx={{ 
                                color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                              }}
                            >
                              ${item.price.toFixed(2)}
                            </TableCell>
                            <TableCell 
                              align="center" 
                              sx={{ 
                                color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                              }}
                            >
                              {item.quantity}
                            </TableCell>
                            <TableCell 
                              align="right" 
                              sx={{ 
                                color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                              }}
                            >
                              ${(item.price * item.quantity).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell 
                            colSpan={4} 
                            align="center"
                            sx={{ 
                              color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary',
                              py: 4,
                            }}
                          >
                            No items found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ textAlign: 'right' }}>
                  <Typography 
                    variant="body1" 
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                    }}
                  >
                    <strong>Subtotal:</strong> ${order.itemsPrice.toFixed(2)}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                    }}
                  >
                    <strong>Shipping:</strong> ${order.shippingPrice.toFixed(2)}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                    }}
                  >
                    <strong>Tax:</strong> ${order.taxPrice.toFixed(2)}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mt: 1,
                      color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                    }}
                  >
                    <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            {/* Order Summary */}
            <Grid item xs={12} md={4}>
              <Paper 
                sx={{ 
                  p: 3,
                  bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'white',
                  boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                <Typography 
                  variant="h6" 
                  component="h2" 
                  sx={{ 
                    mb: 3,
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                  }}
                >
                  Order Summary
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      mb: 1,
                      color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                    }}
                  >
                    Shipping Address
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary',
                    }}
                  >
                    {order.shippingAddress?.fullName}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary',
                    }}
                  >
                    {order.shippingAddress?.address}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary',
                    }}
                  >
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary',
                    }}
                  >
                    {order.shippingAddress?.country}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary',
                      mt: 1,
                    }}
                  >
                    <strong>Phone:</strong> {order.shippingAddress?.phone || 'N/A'}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary',
                    }}
                  >
                    <strong>Email:</strong> {order.shippingAddress?.email || order.user?.email || 'N/A'}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      mb: 1,
                      color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                    }}
                  >
                    Payment Method
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary',
                      textTransform: 'capitalize',
                    }}
                  >
                    {order.paymentMethod}
                  </Typography>
                  
                  {order.isPaid ? (
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label="Paid" 
                        color="success" 
                        size="small" 
                        sx={{ mr: 1 }} 
                      />
                      <Typography 
                        variant="body2" 
                        sx={{
                          color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary',
                          mt: 1,
                        }}
                      >
                        Paid on {formatDate(order.paidAt)}
                      </Typography>
                    </Box>
                  ) : (
                    <Chip 
                      label="Not Paid" 
                      color="error" 
                      size="small" 
                      sx={{ mt: 1 }} 
                    />
                  )}
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      mb: 1,
                      color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
                    }}
                  >
                    Order ID
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary',
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                    }}
                  >
                    {order._id}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      ) : null}
    </Container>
  );
}