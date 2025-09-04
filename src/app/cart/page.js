'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
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
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  NavigateNext,
  ShoppingBag,
  Inventory2,
} from '@mui/icons-material';

export default function CartPage() {
  const { cart, updateCartItemQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  
  // Shipping cost calculation (simplified for demo)
  const shippingCost = cartTotal > 100 ? 0 : 10;
  
  // Tax calculation (simplified for demo)
  const taxRate = 0.07; // 7%
  const taxAmount = (cartTotal - couponDiscount) * taxRate;
  
  // Final total
  const finalTotal = cartTotal - couponDiscount + shippingCost + taxAmount;
  
  // Handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItemQuantity(productId, newQuantity);
  };
  
  // Handle coupon application
  const handleApplyCoupon = () => {
    // This would typically validate the coupon with an API call
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setCouponDiscount(cartTotal * 0.1); // 10% discount
      setCouponError('');
    } else if (couponCode.toUpperCase() === 'FREESHIP') {
      // This would set shipping to free, but we already have free shipping over $100
      setCouponError('This coupon is only valid for orders under $100');
    } else {
      setCouponDiscount(0);
      setCouponError('Invalid coupon code');
    }
  };
  
  if (!cart || cart.length === 0) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #a29278 0%, #8b7d65 100%)',
        py: 6 
      }}>
        <Container maxWidth="lg">
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
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
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
              color: '#2c3e50',
              mb: 2,
            }}>
              Your cart is empty
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
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
      bgcolor: '#f8f9fa',
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
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
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

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ 
              mb: { xs: 4, lg: 0 },
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
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
              <TableContainer>
                <Table>
                  <TableHead sx={{ 
                    bgcolor: '#f8f9fa',
                    '& .MuiTableCell-head': {
                      fontWeight: 600,
                      color: '#2c3e50',
                      borderBottom: '2px solid #e9ecef',
                    }
                  }}>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">Price</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.map((item, index) => (
                      <TableRow 
                        key={`${item._id}-${item.color}-${item.size}`}
                        sx={{
                          '&:hover': {
                            bgcolor: '#f8f9fa',
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
                                color: '#2c3e50',
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
                                        bgcolor: '#f1f3f4',
                                        color: '#5f6368',
                                        fontSize: '0.75rem',
                                      }}
                                    />
                                  )}
                                  {item.size && (
                                    <Chip 
                                      label={`Size: ${item.size}`}
                                      size="small"
                                      sx={{ 
                                        bgcolor: '#f1f3f4',
                                        color: '#5f6368',
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
                            bgcolor: '#f8f9fa',
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
                                color: item.quantity <= 1 ? 'text.disabled' : 'white',
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
                                color: '#2c3e50',
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
                            color: '#2c3e50',
                            fontSize: '1.1rem',
                          }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            onClick={() => removeFromCart(item._id)}
                            sx={{
                              bgcolor: '#fee',
                              color: '#d32f2f',
                              '&:hover': {
                                bgcolor: '#ffcdd2',
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
                    bgcolor: '#ffebee',
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
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              position: 'sticky',
              top: 20,
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
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                  }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>Subtotal</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                      ${cartTotal.toFixed(2)}
                    </Typography>
                  </Box>
                  
                  {couponDiscount > 0 && (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mb: 2,
                      p: 2,
                      bgcolor: '#e8f5e8',
                      borderRadius: 2,
                    }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>Discount</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50' }}>
                        -${couponDiscount.toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 2,
                    p: 2,
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                  }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>Shipping</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: shippingCost === 0 ? '#4caf50' : '#2c3e50' }}>
                      {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 3,
                    p: 2,
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                  }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>Tax (7%)</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                      ${taxAmount.toFixed(2)}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    p: 3,
                    background: 'linear-gradient(135deg, #a29278, #8b7d65)',
                    borderRadius: 2,
                    color: 'white',
                  }}>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>Total</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900 }}>
                      ${finalTotal.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              
                {/* Coupon Code */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#2c3e50' }}>
                    Promo Code
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      fullWidth
                      error={!!couponError}
                      helperText={couponError}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                    <Button 
                      variant="contained" 
                      onClick={handleApplyCoupon}
                      sx={{ 
                        whiteSpace: 'nowrap',
                        background: 'linear-gradient(135deg, #a29278, #8b7d65)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #8b7d65, #6d5d4a)',
                        },
                        borderRadius: 2,
                        px: 3,
                      }}
                    >
                      Apply
                    </Button>
                  </Box>
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
                {cartTotal < 100 && (
                  <Alert 
                    severity="info" 
                    sx={{ 
                      mt: 3,
                      borderRadius: 2,
                      bgcolor: '#e3f2fd',
                      '& .MuiAlert-icon': {
                        color: '#1976d2',
                      },
                    }}
                  >
                    Add <strong>${(100 - cartTotal).toFixed(2)} more</strong> to qualify for FREE shipping!
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