'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import Link from 'next/link';
import Image from 'next/image';
import { calculateTax } from '@/utils/settings';
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
  IconButton,
  Button,
  Divider,
  TextField,
  Alert,
  Breadcrumbs,
  Card,
  CardContent,
  Chip,
  useTheme,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  NavigateNext,
  ShoppingBag,
  Inventory2,
  LocalShipping,
} from '@mui/icons-material';

export default function CartPage() {
  const { cart, updateCartItemQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const { settings, loading: loadingSettings } = useSettings();
  const theme = useTheme();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponFreeShipping, setCouponFreeShipping] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(null);
  
  // Get the actual settings data from the nested structure
  const settingsData = settings?.status || settings;
  
  // Get available shipping options
  const shippingOptions = settingsData?.shipping?.shippingOptions || [
    { name: 'Standard Shipping', price: 10, estimatedDays: '3-5' }
  ];
  
  // Auto-select first shipping option if none selected
  const currentShipping = selectedShipping || shippingOptions[0];
  
  // Shipping cost calculation based on settings and coupon
  const baseShippingCost = settingsData?.shipping?.enableFreeShipping && cartTotal >= (settingsData?.shipping?.freeShippingThreshold || 100)
    ? 0 
    : (currentShipping?.price || 10);
  
  const shippingCost = couponFreeShipping ? 0 : baseShippingCost;
  
  // Tax calculation using settings
  const taxAmount = calculateTax(cartTotal - couponDiscount, settingsData);
  
  // Final total
  const finalTotal = cartTotal - couponDiscount + shippingCost + taxAmount;
  
  // Debug logging
  console.log('Cart Settings Debug:', {
    settings: settings,
    settingsData: settingsData,
    cartTotal,
    taxRate: settingsData?.payment?.taxRate,
    taxAmount,
    shippingCost,
    currentShipping,
    shippingOptions,
    finalTotal
  });
  
  // Handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItemQuantity(productId, newQuantity);
  };
  
  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode,
          orderAmount: cartTotal,
          cartItems: cart
        }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setCouponDiscount(data.discount.amount);
        setCouponFreeShipping(data.discount.freeShipping);
        setAppliedCoupon(data.coupon);
        setCouponError('');
      } else {
        setCouponDiscount(0);
        setCouponFreeShipping(false);
        setAppliedCoupon(null);
        setCouponError(data.message || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      setCouponDiscount(0);
      setCouponFreeShipping(false);
      setAppliedCoupon(null);
      setCouponError('Error validating coupon. Please try again.');
    }
  };

  // Handle coupon removal
  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setCouponFreeShipping(false);
    setAppliedCoupon(null);
    setCouponError('');
  };
  
  // Handle shipping option change
  const handleShippingChange = (event) => {
    const selectedOption = shippingOptions.find(option => option._id === event.target.value);
    setSelectedShipping(selectedOption);
  };
  
  if (!cart || cart.length === 0) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #a29278 0%, #8b7d65 100%)',
        py: 6 
      }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
          <Breadcrumbs 
            separator={<NavigateNext fontSize="small" />} 
            aria-label="breadcrumb"
            sx={{ mb: 4 }}
          >
            <Link href="/" passHref> 
              <Typography color="white" sx={{ 
                '&:hover': { textDecoration: 'underline' },
                opacity: 0.9,
                fontWeight: 500,
              }}>
                Home
              </Typography> 
            </Link>
            <Typography color="white" sx={{ fontWeight: 600 }}>Cart</Typography>
          </Breadcrumbs>
          
          <Card sx={{ 
            p: 6, 
            textAlign: 'center',
            borderRadius: 3,
            background: theme.palette.mode === 'dark' ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: theme.palette.mode === 'dark' ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <Box sx={{ 
              width: 120, 
              height: 120, 
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #a29278, #8b7d65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 10px 30px rgba(162, 146, 120, 0.3)',
            }}>
              <ShoppingBag sx={{ fontSize: 60, color: 'white' }} />
            </Box>
            <Typography variant="h4" gutterBottom sx={{ 
              fontWeight: 700,
              color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50',
              mb: 2,
            }}>
              Your cart is empty
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto', color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary' }}>
              Discover amazing products and start building your perfect collection today.
            </Typography>
            <Button 
              variant="contained" 
              component={Link} 
              href="/products"
              size="large"
              startIcon={<Inventory2 />}
              sx={{ 
                background: 'linear-gradient(135deg, #a29278, #8b7d65)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #8b7d65, #6d5d4a)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 30px rgba(162, 146, 120, 0.4)',
                },
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                transition: 'all 0.3s ease',
              }}
            >
              Start Shopping
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: theme.palette.mode === 'dark' ? '#000000' : '#f8f9fa',
    }}>
      {/* Hero Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #a29278 0%, #8b7d65 100%)',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\\"60\\" height=\\"60\\" viewBox=\\"0 0 60 60\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cg fill=\\"none\\" fill-rule=\\"evenodd\\"%3E%3Cg fill=\\"%23ffffff\\" fill-opacity=\\"0.05\\"%3E%3Cpath d=\\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
        }} />
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
          <Breadcrumbs 
            separator={<NavigateNext fontSize="small" />} 
            aria-label="breadcrumb"
            sx={{ mb: 3 }}
          >
            <Link href="/" passHref>
              <Typography color="white" sx={{ 
                '&:hover': { textDecoration: 'underline' },
                opacity: 0.9,
                fontWeight: 500,
              }}>
                Home
              </Typography>
            </Link>
            <Typography color="white" sx={{ fontWeight: 600 }}>Cart</Typography>
          </Breadcrumbs>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 60,
              height: 60,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShoppingCart sx={{ fontSize: 30, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h3" component="h1" sx={{ 
                fontWeight: 800, 
                color: 'white',
                mb: 1,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}>
                Shopping Cart
              </Typography>
              <Chip 
                label={`${cart.length} ${cart.length === 1 ? 'Item' : 'Items'}`} 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  fontWeight: 600,
                }} 
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        <Grid container spacing={{ xs: 3, md: 4, lg: 6 }} style={{justifyContent: 'center'}}>
          {/* Cart Items */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ 
              mb: { xs: 4, lg: 0 },
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: theme.palette.mode === 'dark' ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.1)',
              bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'background.paper',
            }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #a29278 0%, #8b7d65 100%)',
                px: 3,
                py: 2,
              }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  Cart Items
                </Typography>
              </Box>
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead sx={{ 
                    bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8f9fa',
                    '& .MuiTableCell-head': {
                      fontWeight: 600,
                      color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50',
                      borderBottom: theme.palette.mode === 'dark' ? '2px solid #333333' : '2px solid #e9ecef',
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      whiteSpace: 'nowrap',
                    }
                  }}>
                    <TableRow>
                      <TableCell sx={{ minWidth: { xs: 280, md: 320 } }}>Product</TableCell>
                      <TableCell align="center" sx={{ minWidth: 80 }}>Price</TableCell>
                      <TableCell align="center" sx={{ minWidth: 120 }}>Quantity</TableCell>
                      <TableCell align="right" sx={{ minWidth: 100 }}>Subtotal</TableCell>
                      <TableCell align="right" sx={{ minWidth: 80 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.map((item, index) => (
                      <TableRow 
                        key={`${item._id}-${item.color}-${item.size}`}
                        sx={{
                          '&:hover': {
                            bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8f9fa',
                          },
                          borderLeft: index % 2 === 0 ? '4px solid #a29278' : '4px solid #8b7d65',
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ 
                              position: 'relative', 
                              width: 90, 
                              height: 90, 
                              mr: 3,
                              borderRadius: 2,
                              overflow: 'hidden',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            }}>
                              <Image 
                                src={item.image} 
                                alt={item.name}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="90px"
                              />
                            </Box>
                            <Box>
                              <Typography variant="h6" component="h3" sx={{ 
                                fontWeight: 600,
                                mb: 1,
                                color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50',
                              }}>
                                <Link href={`/product/${item.slug}`} passHref>
                                  <Box component="span" sx={{ 
                                    color: 'inherit', 
                                    '&:hover': { 
                                      color: '#a29278',
                                      textDecoration: 'underline',
                                    } 
                                  }}>
                                    {item.name}
                                  </Box>
                                </Link>
                              </Typography>
                              {(item.color || item.size) && (
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                  {item.color && (
                                    <Chip 
                                      label={`Color: ${item.color}`}
                                      size="small"
                                      sx={{ 
                                        bgcolor: theme.palette.mode === 'dark' ? '#333333' : '#f1f3f4',
                                        color: theme.palette.mode === 'dark' ? '#CCCCCC' : '#5f6368',
                                        fontSize: '0.75rem',
                                      }}
                                    />
                                  )}
                                  {item.size && (
                                    <Chip 
                                      label={`Size: ${item.size}`}
                                      size="small"
                                      sx={{ 
                                        bgcolor: theme.palette.mode === 'dark' ? '#333333' : '#f1f3f4',
                                        color: theme.palette.mode === 'dark' ? '#CCCCCC' : '#5f6368',
                                        fontSize: '0.75rem',
                                      }}
                                    />
                                  )}
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="h6" sx={{ 
                            fontWeight: 700,
                            color: '#a29278',
                          }}>
                            ${item.price.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8f9fa',
                            borderRadius: 2,
                            p: 0.5,
                            width: 'fit-content',
                            mx: 'auto',
                          }}>
                            <IconButton 
                              size="small" 
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              sx={{
                                bgcolor: item.quantity <= 1 ? 'transparent' : '#a29278',
                                color: item.quantity <= 1 ? (theme.palette.mode === 'dark' ? '#666666' : 'text.disabled') : 'white',
                                '&:hover': {
                                  bgcolor: item.quantity <= 1 ? 'transparent' : '#8b7d65',
                                },
                                width: 32,
                                height: 32,
                              }}
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                            <Typography
                              variant="h6"
                              sx={{ 
                                mx: 2,
                                minWidth: 24,
                                textAlign: 'center',
                                fontWeight: 700,
                                color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50',
                              }}
                            >
                              {item.quantity}
                            </Typography>
                            <IconButton 
                              size="small" 
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              sx={{
                                bgcolor: '#a29278',
                                color: 'white',
                                '&:hover': {
                                  bgcolor: '#8b7d65',
                                },
                                width: 32,
                                height: 32,
                              }}
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h6" sx={{ 
                            fontWeight: 800,
                            color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50',
                            fontSize: '1.1rem',
                          }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            onClick={() => removeFromCart(item._id)}
                            sx={{
                              bgcolor: theme.palette.mode === 'dark' ? '#442222' : '#fee',
                              color: '#d32f2f',
                              '&:hover': {
                                bgcolor: theme.palette.mode === 'dark' ? '#663333' : '#ffcdd2',
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s ease',
                            }}
                            size="small"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 3,
              gap: 2,
              flexWrap: 'wrap',
            }}>
              <Button 
                variant="contained" 
                component={Link} 
                href="/products"
                startIcon={<ShoppingCart />}
                sx={{
                  background: 'linear-gradient(135deg, #a29278, #8b7d65)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #8b7d65, #6d5d4a)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(162, 146, 120, 0.4)',
                  },
                  px: 3,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                }}
              >
                Continue Shopping
              </Button>
              
              <Button 
                variant="outlined" 
                color="error" 
                onClick={clearCart}
                startIcon={<Delete />}
                sx={{
                  borderColor: '#d32f2f',
                  color: '#d32f2f',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? '#331111' : '#ffebee',
                    borderColor: '#c62828',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(211, 47, 47, 0.2)',
                  },
                  px: 3,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                }}
              >
                Clear Cart
              </Button>
            </Box>
          </Grid>
          
          {/* Order Summary */}
          <Grid item xs={12} lg={4}>
            <Card sx={{
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: theme.palette.mode === 'dark' ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.1)',
              position: 'sticky',
              top: 20,
              bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'background.paper',
            }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                px: 3,
                py: 3,
              }}>
                <Typography variant="h5" sx={{ 
                  color: 'white', 
                  fontWeight: 800,
                  textAlign: 'center',
                }}>
                  Order Summary
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 2,
                    p: 2,
                    bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8f9fa',
                    borderRadius: 2,
                  }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'text.primary' }}>Subtotal</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50' }}>
                      ${cartTotal.toFixed(2)}
                    </Typography>
                  </Box>
                  
                  {couponDiscount > 0 && (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mb: 2,
                      p: 2,
                      bgcolor: theme.palette.mode === 'dark' ? '#1a2a1a' : '#e8f5e8',
                      borderRadius: 2,
                    }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'text.primary' }}>Discount</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50' }}>
                        -${couponDiscount.toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                  
                  {/* Shipping Options */}
                  {!couponFreeShipping && baseShippingCost > 0 && shippingOptions.length > 1 && (
                    <Box sx={{ 
                      mb: 2,
                      p: 2,
                      bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8f9fa',
                      borderRadius: 2,
                    }}>
                      <FormControl component="fieldset" fullWidth>
                        <FormLabel 
                          component="legend" 
                          sx={{ 
                            fontWeight: 600, 
                            color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50',
                            mb: 1,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocalShipping fontSize="small" />
                            Shipping Options
                          </Box>
                        </FormLabel>
                        <RadioGroup
                          value={currentShipping?._id || ''}
                          onChange={handleShippingChange}
                        >
                          {shippingOptions.map((option) => (
                            <FormControlLabel
                              key={option._id || option.name}
                              value={option._id || option.name}
                              control={<Radio sx={{ color: '#a29278', '&.Mui-checked': { color: '#a29278' } }} />}
                              label={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50' }}>
                                      {option.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary' }}>
                                      {option.estimatedDays} days
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#a29278' }}>
                                    ${option.price.toFixed(2)}
                                  </Typography>
                                </Box>
                              }
                              sx={{ 
                                width: '100%', 
                                m: 0, 
                                p: 1,
                                borderRadius: 1,
                                '&:hover': {
                                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                },
                              }}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  )}
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 2,
                    p: 2,
                    bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8f9fa',
                    borderRadius: 2,
                  }}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'text.primary' }}>Shipping</Typography>
                      {couponFreeShipping && (
                        <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 500 }}>
                          Free shipping applied by coupon
                        </Typography>
                      )}
                      {!couponFreeShipping && currentShipping && baseShippingCost > 0 && (
                        <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary', display: 'block' }}>
                          {currentShipping.name} - {currentShipping.estimatedDays} days
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: shippingCost === 0 ? '#4caf50' : (theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50') }}>
                      {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 3,
                    p: 2,
                    bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8f9fa',
                    borderRadius: 2,
                  }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'text.primary' }}>
                      Tax ({settingsData?.payment?.taxRate || 5}%)
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50' }}>
                      ${taxAmount.toFixed(2)}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 3, borderColor: theme.palette.mode === 'dark' ? '#333333' : 'rgba(0,0,0,0.1)' }} />
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    p: 2,
                    background: 'linear-gradient(135deg, #a29278, #8b7d65)',
                    borderRadius: 2,
                    color: 'white',
                  }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.4 }}>Total</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900 }}>
                      ${finalTotal.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              
                {/* Coupon Code */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50' }}>
                    Promo Code
                  </Typography>
                  
                  {/* Applied Coupon Display */}
                  {appliedCoupon && (
                    <Box sx={{ 
                      mb: 2, 
                      p: 2, 
                      bgcolor: theme.palette.mode === 'dark' ? '#1a2a1a' : '#e8f5e8',
                      borderRadius: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#4caf50' }}>
                          {appliedCoupon.code}
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary' }}>
                          {appliedCoupon.description}
                        </Typography>
                        {couponFreeShipping && (
                          <Typography variant="caption" sx={{ display: 'block', color: '#4caf50', fontWeight: 500 }}>
                            Free shipping included
                          </Typography>
                        )}
                      </Box>
                      <Button
                        size="small"
                        onClick={handleRemoveCoupon}
                        sx={{ 
                          color: '#d32f2f',
                          minWidth: 'auto',
                          px: 1,
                          '&:hover': {
                            bgcolor: theme.palette.mode === 'dark' ? '#441111' : '#ffebee',
                          },
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                  )}
                  
                  {/* Coupon Input */}
                  {!appliedCoupon && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        size="small"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        fullWidth
                        error={!!couponError}
                        helperText={couponError}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleApplyCoupon();
                          }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'white',
                            '&.Mui-focused': {
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#a29278',
                                borderWidth: 2,
                              },
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.mode === 'dark' ? '#333333' : '#e0e0e0',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary',
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#a29278',
                          },
                          '& .MuiFormHelperText-root': {
                            color: theme.palette.mode === 'dark' ? '#FF6B6B' : '#d32f2f',
                          },
                        }}
                      />
                      <Button 
                        variant="contained" 
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim()}
                        sx={{ 
                          whiteSpace: 'nowrap',
                          background: 'linear-gradient(135deg, #a29278, #8b7d65)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #8b7d65, #6d5d4a)',
                          },
                          '&:disabled': {
                            background: theme.palette.mode === 'dark' ? '#333333' : '#e0e0e0',
                            color: theme.palette.mode === 'dark' ? '#666666' : 'rgba(0, 0, 0, 0.26)',
                          },
                          borderRadius: 2,
                          px: 3,
                        }}
                      >
                        Apply
                      </Button>
                    </Box>
                  )}
                </Box>
              
                {/* Checkout Button */}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth 
                  component={Link}
                  href={user ? '/checkout' : '/login?redirect=/checkout'}
                  sx={{ 
                    background: 'linear-gradient(135deg, #a29278, #8b7d65)',
                    '&:hover': { 
                      background: 'linear-gradient(135deg, #8b7d65, #6d5d4a)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(162, 146, 120, 0.4)',
                    },
                    py: 2,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    transition: 'all 0.3s ease',
                  }}
                >
                  Proceed to Checkout
                </Button>
                
                {/* Free Shipping Notice */}
                {settingsData?.shipping?.enableFreeShipping && cartTotal < (settingsData?.shipping?.freeShippingThreshold || 100) && (
                  <Alert 
                    severity="info" 
                    sx={{ 
                      mt: 3,
                      borderRadius: 2,
                      bgcolor: theme.palette.mode === 'dark' ? '#1a2a3a' : '#e3f2fd',
                      '& .MuiAlert-icon': {
                        color: theme.palette.mode === 'dark' ? '#64b5f6' : '#1976d2',
                      },
                      color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'inherit',
                    }}
                  >
                    Add <strong>${((settingsData?.shipping?.freeShippingThreshold || 100) - cartTotal).toFixed(2)} more</strong> to qualify for FREE shipping!
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}