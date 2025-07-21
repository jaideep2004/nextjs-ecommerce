'use client';

import { useState, useEffect } from 'react';
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
  InputAdornment,
  Alert,
  Breadcrumbs,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  NavigateNext,
  LocalShipping,
  Payment,
  CheckCircle,
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
      <Container maxWidth="lg" sx={{ py: 6 }}>
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
          <Typography color="text.primary">Cart</Typography>
        </Breadcrumbs>
        
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingCart sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Looks like you haven&apos;t added anything to your cart yet.
          </Typography>
          <Button 
            variant="contained" 
            component={Link} 
            href="/products"
            sx={{ 
              bgcolor: '#8D6E63',
              '&:hover': { bgcolor: '#6D4C41' },
              px: 4,
              py: 1.5,
            }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
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
        <Typography color="text.primary">Cart</Typography>
      </Breadcrumbs>
      
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Shopping Cart
      </Typography>
      
      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} lg={8}>
          <TableContainer component={Paper} sx={{ mb: { xs: 4, lg: 0 } }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="center">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={`${item._id}-${item.color}-${item.size}`}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ position: 'relative', width: 80, height: 80, mr: 2 }}>
                          <Image 
                            src={item.image} 
                            alt={item.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="80px"
                          />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 'medium' }}>
                            <Link href={`/product/${item.slug}`} passHref>
                              <Box component="span" sx={{ color: 'inherit', '&:hover': { color: 'primary.main' } }}>
                                {item.name}
                              </Box>
                            </Link>
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
                    <TableCell align="center">
                      <Typography variant="body1">
                        ${item.price.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <TextField
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value > 0) {
                              handleQuantityChange(item._id, value);
                            }
                          }}
                          inputProps={{ 
                            min: 1, 
                            style: { textAlign: 'center' } 
                          }}
                          sx={{ width: 60, mx: 1 }}
                          size="small"
                        />
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        color="error" 
                        onClick={() => removeFromCart(item._id)}
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
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button 
              variant="outlined" 
              component={Link} 
              href="/products"
              startIcon={<ShoppingCart />}
            >
              Continue Shopping
            </Button>
            
            <Button 
              variant="outlined" 
              color="error" 
              onClick={clearCart}
              startIcon={<Delete />}
            >
              Clear Cart
            </Button>
          </Box>
        </Grid>
        
        {/* Order Summary */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Order Summary
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">${cartTotal.toFixed(2)}</Typography>
              </Box>
              
              {couponDiscount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Discount</Typography>
                  <Typography variant="body1" color="error">
                    -${couponDiscount.toFixed(2)}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Shipping</Typography>
                <Typography variant="body1">
                  {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Tax (7%)</Typography>
                <Typography variant="body1">${taxAmount.toFixed(2)}</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  ${finalTotal.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            
            {/* Coupon Code */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Apply Coupon Code
              </Typography>
              <Box sx={{ display: 'flex' }}>
                <TextField
                  size="small"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  fullWidth
                  error={!!couponError}
                  helperText={couponError}
                />
                <Button 
                  variant="outlined" 
                  onClick={handleApplyCoupon}
                  sx={{ ml: 1, whiteSpace: 'nowrap' }}
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
                bgcolor: '#8D6E63',
                '&:hover': { bgcolor: '#6D4C41' },
                py: 1.5,
              }}
            >
              Proceed to Checkout
            </Button>
            
            {/* Free Shipping Notice */}
            {cartTotal < 100 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Add ${(100 - cartTotal).toFixed(2)} more to qualify for FREE shipping!
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}