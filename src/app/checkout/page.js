'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import PayPalButton from '@/components/payment/PayPalButton';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Alert,
  Breadcrumbs,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
} from '@mui/material';
import {
  NavigateNext,
  LocalShipping,
  Payment,
  CheckCircle,
} from '@mui/icons-material';

// Step components
const ShippingForm = ({ formData, setFormData, user }) => {
  // Countries list (simplified)
  const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'India'];
  
  // States list (simplified for US)
  const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  
  // Pre-fill form with user data if available
  useEffect(() => {
    if (user && user.address) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address.street || prev.address,
        city: user.address.city || prev.city,
        state: user.address.state || prev.state,
        zipCode: user.address.zipCode || prev.zipCode,
        country: user.address.country || prev.country,
      }));
    }
  }, [user, setFormData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Shipping Address
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel id="state-select-label">State</InputLabel>
            <Select
              labelId="state-select-label"
              name="state"
              value={formData.state}
              label="State"
              onChange={handleChange}
            >
              {states.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="ZIP / Postal code"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel id="country-select-label">Country</InputLabel>
            <Select
              labelId="country-select-label"
              name="country"
              value={formData.country}
              label="Country"
              onChange={handleChange}
            >
              {countries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox 
                color="primary" 
                name="saveAddress" 
                checked={formData.saveAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, saveAddress: e.target.checked }))}
              />
            }
            label="Save this address for future orders"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

const PaymentForm = ({ formData, setFormData, finalTotal, orderId, setPaymentProcessing, setPaymentSuccess, setPaymentError }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePayPalSuccess = (data) => {
    setPaymentProcessing(false);
    setPaymentSuccess(true);
    console.log('PayPal payment successful:', data);
  };
  
  const handlePayPalError = (error) => {
    setPaymentProcessing(false);
    setPaymentError('Payment failed. Please try again.');
    console.error('PayPal payment error:', error);
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      
      <FormControl component="fieldset" sx={{ width: '100%' }}>
        <RadioGroup
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          <Paper sx={{ mb: 2, p: 2 }}>
            <FormControlLabel 
              value="paypal" 
              control={<Radio />} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 2 }}>PayPal</Typography>
                  <Image 
                    src="/images/paypal-logo.png" 
                    alt="PayPal" 
                    width={80} 
                    height={30} 
                  />
                </Box>
              } 
            />
            {formData.paymentMethod === 'paypal' && orderId && (
              <Box sx={{ mt: 2, ml: 4 }}>
                <PayPalButton 
                  amount={finalTotal} 
                  orderId={orderId}
                  onSuccess={handlePayPalSuccess}
                  onError={handlePayPalError}
                />
              </Box>
            )}
          </Paper>
          
          <Paper sx={{ mb: 2, p: 2 }}>
            <FormControlLabel 
              value="stripe" 
              control={<Radio />} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 2 }}>Credit Card</Typography>
                  <Image 
                    src="/images/credit-cards.png" 
                    alt="Credit Cards" 
                    width={120} 
                    height={30} 
                  />
                </Box>
              } 
            />
          </Paper>
          
          <Paper sx={{ p: 2 }}>
            <FormControlLabel 
              value="cod" 
              control={<Radio />} 
              label="Cash on Delivery" 
            />
          </Paper>
        </RadioGroup>
      </FormControl>
      
      {formData.paymentMethod === 'stripe' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Credit card payment will be processed securely on the next step.
        </Alert>
      )}
    </Box>
  );
};

const ReviewOrder = ({ formData, cart, cartTotal, shippingCost, taxAmount, finalTotal }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      
      <List sx={{ mb: 3 }}>
        {cart.map((item) => (
          <ListItem key={`${item._id}-${item.color}-${item.size}`} sx={{ py: 1, px: 0 }}>
            <ListItemAvatar>
              <Avatar 
                variant="square" 
                sx={{ width: 60, height: 60 }}
              >
                <Image 
                  src={item.image} 
                  alt={item.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="60px"
                />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={item.name}
              secondary={
                <>
                  {item.color && `Color: ${item.color}`}
                  {item.color && item.size && ' | '}
                  {item.size && `Size: ${item.size}`}
                </>
              }
              sx={{ ml: 2 }}
            />
            <Typography variant="body2">
              {item.quantity} x ${item.price.toFixed(2)}
            </Typography>
          </ListItem>
        ))}
        
        <Divider sx={{ my: 2 }} />
        
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Subtotal" />
          <Typography variant="body1">${cartTotal.toFixed(2)}</Typography>
        </ListItem>
        
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Shipping" />
          <Typography variant="body1">
            {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
          </Typography>
        </ListItem>
        
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Tax (7%)" />
          <Typography variant="body1">${taxAmount.toFixed(2)}</Typography>
        </ListItem>
        
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            ${finalTotal.toFixed(2)}
          </Typography>
        </ListItem>
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" gutterBottom>
        Shipping
      </Typography>
      
      <Typography gutterBottom>{formData.fullName}</Typography>
      <Typography gutterBottom>{formData.address}</Typography>
      <Typography gutterBottom>
        {formData.city}, {formData.state} {formData.zipCode}
      </Typography>
      <Typography gutterBottom>{formData.country}</Typography>
      <Typography gutterBottom>{formData.phone}</Typography>
      <Typography gutterBottom>{formData.email}</Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      
      <Typography gutterBottom>
        {formData.paymentMethod === 'paypal' && 'PayPal'}
        {formData.paymentMethod === 'stripe' && 'Credit Card'}
        {formData.paymentMethod === 'cod' && 'Cash on Delivery'}
      </Typography>
    </Box>
  );
};

export default function CheckoutPage() {
  // Steps for the checkout process
  const steps = ['Shipping', 'Payment', 'Review Order'];

  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  // State for PayPal client ID
  const [paypalClientId, setPaypalClientId] = useState('test');
  
  // Form data state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    saveAddress: true,
    paymentMethod: 'paypal',
  });
  
  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !orderComplete) {
      router.push('/cart');
    }
  }, [cart, router, orderComplete]);
  
  // Redirect if user is not logged in
  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, router]);

  // Fetch PayPal client ID from settings
  useEffect(() => {
    const fetchPaypalSettings = async () => {
      try {
        const response = await axios.get('/api/settings');
        if (response.data?.data?.payment?.paypalClientId) {
          setPaypalClientId(response.data.data.payment.paypalClientId);
        }
      } catch (err) {
        console.error('Error fetching PayPal settings:', err);
        // Continue with default test client ID
      }
    };

    fetchPaypalSettings();
  }, []);

  // Effect to handle payment success
  useEffect(() => {
    if (paymentSuccess && orderId) {
      // Clear cart and set order complete
      clearCart();
      setOrderComplete(true);
      setActiveStep(steps.length);
    }
  }, [paymentSuccess, orderId, clearCart, steps]);
  
  // Shipping cost calculation (simplified for demo)
  const shippingCost = cartTotal > 100 ? 0 : 10;
  
  // Tax calculation (simplified for demo)
  const taxRate = 0.07; // 7%
  const taxAmount = cartTotal * taxRate;
  
  // Final total
  const finalTotal = cartTotal + shippingCost + taxAmount;
  
  // Handle next step
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Validate current step
  const validateStep = () => {
    if (activeStep === 0) {
      // Validate shipping form
      const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
      for (const field of requiredFields) {
        if (!formData[field]) {
          setError(`Please fill in all required fields`);
          return false;
        }
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
      
      // Basic phone validation
      const phoneRegex = /^\d{10,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/[\s()-]/g, ''))) {
        setError('Please enter a valid phone number');
        return false;
      }
    } else if (activeStep === 1) {
      // Validate payment form
      if (!formData.paymentMethod) {
        setError('Please select a payment method');
        return false;
      }
    }
    
    setError('');
    return true;
  };
  
  // Handle place order
  const handlePlaceOrder = async () => {
    
    setLoading(true);
    setError('');
    
    try {
      // Get authentication token from cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      
      // Set up headers with authentication token
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Prepare order data
      const orderData = {
        orderItems: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          color: item.color || '',
          size: item.size || '',
          product: item._id,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: cartTotal,
        shippingPrice: shippingCost,
        taxPrice: taxAmount,
        totalPrice: finalTotal,
      };
      
      // Send order to API
      const response = await axios.post('/api/orders', orderData, { headers });
      
      const data = response.data;
      
      // Save address if requested
      if (formData.saveAddress) {
        await axios.put('/api/auth/update', {
          address: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
        }, { headers });
      }
      
      // Set order ID for payment processing
      setOrderId(data.data._id);
      
      // If payment method is not PayPal, complete the order
      if (formData.paymentMethod !== 'paypal') {
        // Clear cart and set order complete
        clearCart();
        setOrderComplete(true);
        setActiveStep(steps.length);
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.response?.data?.message || err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Render step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <ShippingForm formData={formData} setFormData={setFormData} user={user} />;
      case 1:
        return (
          <PaymentForm 
            formData={formData} 
            setFormData={setFormData} 
            finalTotal={finalTotal}
            orderId={orderId}
            setPaymentProcessing={setPaymentProcessing}
            setPaymentSuccess={setPaymentSuccess}
            setPaymentError={setPaymentError}
          />
        );
      case 2:
        return (
          <ReviewOrder 
            formData={formData} 
            cart={cart} 
            cartTotal={cartTotal} 
            shippingCost={shippingCost} 
            taxAmount={taxAmount} 
            finalTotal={finalTotal} 
          />
        );
      default:
        return 'Unknown step';
    }
  };
  
  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#8D6E63' }} />
      </Container>
    );
  }

  return (
    <PayPalScriptProvider options={{ "client-id": paypalClientId }}>
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
          <Link href="/cart" passHref>
            <Typography color="inherit" sx={{ '&:hover': { textDecoration: 'underline' } }}>
              Cart
            </Typography>
          </Link>
          <Typography color="text.primary">Checkout</Typography>
        </Breadcrumbs>
        
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          Checkout
        </Typography>
      
      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => {
            const stepProps = {};
            const labelProps = {};
            
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        
        {activeStep === steps.length ? (
          // Order complete
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Thank you for your order!
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Your order number is #{orderId}. We have emailed your order confirmation,
              and will send you an update when your order has shipped.
            </Typography>
            <Button 
              variant="contained" 
              component={Link} 
              href="/"
              sx={{ 
                bgcolor: '#8D6E63',
                '&:hover': { bgcolor: '#6D4C41' },
                px: 4,
                py: 1.5,
                mr: 2,
              }}
            >
              Continue Shopping
            </Button>
            <Button 
              variant="outlined" 
              component={Link} 
              href={`/customer/orders/${orderId}`}
              sx={{ px: 4, py: 1.5 }}
            >
              View Order
            </Button>
          </Box>
        ) : (
          // Checkout steps
          <Box>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {getStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
              )}
              
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
                sx={{ 
                  bgcolor: '#8D6E63',
                  '&:hover': { bgcolor: '#6D4C41' },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : activeStep === steps.length - 1 ? (
                  'Place Order'
                ) : (
                  'Next'
                )}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
      </Container>
      </PayPalScriptProvider>
  );
}