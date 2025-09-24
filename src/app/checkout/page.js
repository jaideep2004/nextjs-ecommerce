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
import { useSettings } from '@/contexts/SettingsContext';
import { getSettings, calculateTax, getAvailablePaymentMethods } from '@/utils/settings';
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
  useTheme,
} from '@mui/material';
import {
  NavigateNext,
  LocalShipping,
  Payment,
  CheckCircle,
} from '@mui/icons-material';

// Step components
const ShippingForm = ({ formData, setFormData, user, errors, setErrors }) => {
  const theme = useTheme();
  // Countries with their states
  const countriesWithStates = {
    'United States': [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 
      'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 
      'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 
      'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 
      'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 
      'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 
      'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ],
    'Canada': [
      'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
      'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
      'Quebec', 'Saskatchewan', 'Yukon'
    ],
    'United Kingdom': [
      'England', 'Scotland', 'Wales', 'Northern Ireland'
    ],
    'Australia': [
      'Australian Capital Territory', 'New South Wales', 'Northern Territory', 'Queensland',
      'South Australia', 'Tasmania', 'Victoria', 'Western Australia'
    ],
    'India': [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
      'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
      'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
      'Uttarakhand', 'West Bengal'
    ]
  };
  
  const countries = Object.keys(countriesWithStates);
  const availableStates = countriesWithStates[formData.country] || [];
  
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
    
    // Clear state when country changes
    if (name === 'country') {
      setFormData(prev => ({ ...prev, [name]: value, state: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear errors for the field being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'Full name is required';
        else if (value.trim().length < 2) error = 'Full name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone number is required';
        else if (!/^[\d\s()+-]{10,15}$/.test(value.replace(/[\s()-]/g, ''))) error = 'Please enter a valid phone number';
        break;
      case 'address':
        if (!value.trim()) error = 'Address is required';
        else if (value.trim().length < 5) error = 'Please enter a complete address';
        break;
      case 'city':
        if (!value.trim()) error = 'City is required';
        break;
      case 'state':
        if (!value.trim()) error = 'State/Province is required';
        break;
      case 'zipCode':
        if (!value.trim()) error = 'ZIP/Postal code is required';
        else if (formData.country === 'United States' && !/^\d{5}(-\d{4})?$/.test(value)) {
          error = 'Please enter a valid US ZIP code';
        } else if (formData.country === 'Canada' && !/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(value)) {
          error = 'Please enter a valid Canadian postal code (e.g., A1A 1A1)';
        }
        break;
      case 'country':
        if (!value.trim()) error = 'Country is required';
        break;
    }
    
    return error;
  };
  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  
  return (
    <Box sx={{ 
      background: theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #1a1a1a 0%, #111111 100%)' : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      p: 4,
      borderRadius: 3,
      border: theme.palette.mode === 'dark' ? '1px solid #333333' : '1px solid #e0e0e0',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box sx={{
          width: 50,
          height: 50,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #a29278, #8b7d65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 2,
        }}>
          <LocalShipping sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50' }}>
          Shipping Address
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.fullName}
            helperText={errors.fullName}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'white',
                borderRadius: 2,
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
            onBlur={handleBlur}
            error={!!errors.email}
            helperText={errors.email}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'white',
                borderRadius: 2,
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
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.phone}
            helperText={errors.phone}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'white',
                borderRadius: 2,
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
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.address}
            helperText={errors.address}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'white',
                borderRadius: 2,
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
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.city}
            helperText={errors.city}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'white',
                borderRadius: 2,
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
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors.state} style={{minWidth: '155px'}}>
            <InputLabel 
              id="state-select-label"
              sx={{
                '&.Mui-focused': {
                  color: '#a29278',
                },
                color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary',
              }}
            >
              State/Province
            </InputLabel>
            <Select
              labelId="state-select-label"
              name="state"
              value={formData.state}
              label="State/Province"
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!availableStates.length}
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'white',
                borderRadius: 2,
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#a29278',
                    borderWidth: 2,
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.mode === 'dark' ? '#333333' : '#e0e0e0',
                },
                '& .MuiSelect-select': {
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50',
                },
              }}
            >
              {availableStates.map((state) => (
                <MenuItem key={state} value={state} sx={{ color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50' }}>
                  {state}
                </MenuItem>
              ))}
            </Select>
            {errors.state && (
              <Typography variant="caption" color={theme.palette.mode === 'dark' ? '#FF6B6B' : 'error'} sx={{ mt: 0.5, ml: 1.5 }}>
                {errors.state}
              </Typography>
            )}
            {!availableStates.length && (
              <Typography variant="caption" sx={{ mt: 0.5, ml: 1.5, color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary' }}>
                Please select a country first
              </Typography>
            )}
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
            onBlur={handleBlur}
            error={!!errors.zipCode}
            helperText={errors.zipCode || (formData.country === 'Canada' ? 'Format: A1A 1A1' : formData.country === 'United States' ? 'Format: 12345 or 12345-6789' : '')}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'white',
                borderRadius: 2,
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
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors.country}>
            <InputLabel 
              id="country-select-label"
              sx={{
                '&.Mui-focused': {
                  color: '#a29278',
                },
                color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary',
              }}
            >
              Country
            </InputLabel>
            <Select
              labelId="country-select-label"
              name="country"
              value={formData.country}
              label="Country"
              onChange={handleChange}
              onBlur={handleBlur}
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'white',
                borderRadius: 2,
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#a29278',
                    borderWidth: 2,
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.mode === 'dark' ? '#333333' : '#e0e0e0',
                },
                '& .MuiSelect-select': {
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50',
                },
              }}
            >
              {countries.map((country) => (
                <MenuItem key={country} value={country} sx={{ color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50' }}>
                  {country}
                </MenuItem>
              ))}
            </Select>
            {errors.country && (
              <Typography variant="caption" color={theme.palette.mode === 'dark' ? '#FF6B6B' : 'error'} sx={{ mt: 0.5, ml: 1.5 }}>
                {errors.country}
              </Typography>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ 
            p: 2, 
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(162, 146, 120, 0.1)' : 'rgba(162, 146, 120, 0.1)',
            borderRadius: 2,
            border: theme.palette.mode === 'dark' ? '1px solid rgba(162, 146, 120, 0.3)' : '1px solid rgba(162, 146, 120, 0.3)',
          }}>
            <FormControlLabel
              control={
                <Checkbox 
                  sx={{
                    color: '#a29278',
                    '&.Mui-checked': {
                      color: '#a29278',
                    },
                  }}
                  name="saveAddress" 
                  checked={formData.saveAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, saveAddress: e.target.checked }))}
                />
              }
              label={
                <Typography sx={{ fontWeight: 500, color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50' }}>
                  Save this address for future orders
                </Typography>
              }
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const ReviewAndPayment = ({ formData, setFormData, cart, cartTotal, shippingCost, taxAmount, finalTotal, onPayPalSuccess, onPayPalError, onPlaceOrder, loading, availablePaymentMethods }) => {
  const [paymentMethod, setPaymentMethod] = useState(availablePaymentMethods.length > 0 ? availablePaymentMethods[0].id : 'paypal');
  const theme = useTheme();
  
  // Update payment method when available methods change
  useEffect(() => {
    if (availablePaymentMethods.length > 0 && !availablePaymentMethods.find(method => method.id === paymentMethod)) {
      setPaymentMethod(availablePaymentMethods[0].id);
      setFormData(prev => ({ ...prev, paymentMethod: availablePaymentMethods[0].id }));
    }
  }, [availablePaymentMethods, paymentMethod, setFormData]);
  
  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
    setFormData(prev => ({ ...prev, paymentMethod: e.target.value }));
  };
  
  const handlePlaceOrderClick = () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
    // For PayPal, the payment will be handled by PayPal button
    if (paymentMethod === 'paypal') {
      // PayPal button will handle the payment
      return;
    }
    
    // For COD, place order directly
    if (paymentMethod === 'cod') {
      onPlaceOrder();
    }
  };
  
  return (
    <Box sx={{ 
      background: theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #1a1a1a 0%, #111111 100%)' : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      p: 4,
      borderRadius: 3,
      border: theme.palette.mode === 'dark' ? '1px solid #333333' : '1px solid #e0e0e0',
      maxWidth: '1300px'
    }}>
      <Grid container spacing={4}>
        {/* Order Summary */}
        <Grid item xs={12} md={8} style={{ flex:1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box sx={{
              width: 50,
              height: 50,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #2c3e50, #34495e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}>
              <CheckCircle sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50' }}>
              Review Your Order
            </Typography>
          </Box>
          
          {/* Cart Items */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'background.paper' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'text.primary' }}>
              Order Items
            </Typography>
            <List>
              {cart.map((item) => (
                <ListItem key={`${item._id}-${item.color}-${item.size}`} sx={{ py: 2, px: 0 }}>
                  <ListItemAvatar>
                    <Avatar 
                      variant="square" 
                      sx={{ width: 60, height: 60, borderRadius: 1 }}
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
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'text.primary' }}>
                        {item.name}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        {item.color && `Color: ${item.color}`}
                        {item.color && item.size && ' | '}
                        {item.size && `Size: ${item.size}`}
                        <br />
                        <Typography component="span" sx={{ fontWeight: 600, color: '#a29278' }}>
                          ${item.price.toFixed(2)} × {item.quantity}
                        </Typography>
                      </Box>
                    }
                    sx={{ ml: 2, color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary' }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
          
          {/* Shipping Address */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'background.paper' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'text.primary' }}>
              Shipping Address
            </Typography>
            <Box sx={{ 
              p: 2, 
              bgcolor: theme.palette.mode === 'dark' ? '#111111' : '#f8f9fa',
              borderRadius: 2,
              border: theme.palette.mode === 'dark' ? '1px solid #333333' : '1px solid #e9ecef'
            }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'text.primary' }}>
                {formData.fullName}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary' }}>
                {formData.address}<br />
                {formData.city}, {formData.state} {formData.zipCode}<br />
                {formData.country}<br />
                Phone: {formData.phone}<br />
                Email: {formData.email}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Payment & Summary */}
        <Grid item xs={12} md={4} style={{ flex:1 }}>
          {/* Payment Method Selection */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'background.paper' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'text.primary' }}>
              Payment Method
            </Typography>
            
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <RadioGroup
                value={paymentMethod}
                onChange={handlePaymentChange}
              >
                {availablePaymentMethods.map((method) => (
                  <Box key={method.id} sx={{ 
                    mb: 2, 
                    p: 2,
                    borderRadius: 2,
                    border: paymentMethod === method.id ? '2px solid #a29278' : (theme.palette.mode === 'dark' ? '1px solid #333333' : '1px solid #e0e0e0'),
                    transition: 'all 0.3s ease',
                    bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'inherit',
                  }}>
                    <FormControlLabel 
                      value={method.id} 
                      control={<Radio sx={{ color: '#a29278', '&.Mui-checked': { color: '#a29278' } }} />} 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography sx={{ mr: 2, fontWeight: 600, color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'text.primary' }}>
                            {method.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary' }}>
                            {method.description}
                          </Typography>
                        </Box>
                      } 
                    />
                  </Box>
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>
          
          {/* Order Summary */}
          <Paper sx={{ p: 3, borderRadius: 2, bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'background.paper' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'text.primary' }}>
              Order Summary
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" sx={{ color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary' }}>Subtotal</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'text.primary' }}>
                  ${cartTotal.toFixed(2)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" sx={{ color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary' }}>Shipping</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: shippingCost === 0 ? '#4caf50' : (theme.palette.mode === 'dark' ? '#FFFFFF' : 'text.primary') }}>
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" sx={{ color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary' }}>
                  Tax ({Math.round(taxAmount / cartTotal * 100) || 5}%)
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'text.primary' }}>
                  ${taxAmount.toFixed(2)}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2, borderColor: theme.palette.mode === 'dark' ? '#333333' : 'rgba(0,0,0,0.1)' }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'text.primary' }}>Total</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#a29278' }}>
                  ${finalTotal.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            
            {/* Place Order Button */}
            {paymentMethod === 'paypal' ? (
              <Box>
                <Typography variant="body2" sx={{ mb: 2, textAlign: 'center', color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary' }}>
                  Click below to complete payment with PayPal
                </Typography>
                <PayPalButton 
                  amount={finalTotal} 
                  cart={cart}
                  shippingData={{
                    fullName: formData.fullName,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                    country: formData.country,
                    phone: formData.phone,
                    email: formData.email
                  }}
                  formData={formData}
                  onSuccess={onPayPalSuccess}
                  onError={onPayPalError}
                />
              </Box>
            ) : (
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handlePlaceOrderClick}
                disabled={loading}
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
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Place Order'
                )}
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
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
        {formData.paymentMethod === 'cod' && 'Cash on Delivery'}
      </Typography>
    </Box>
  );
};

export default function CheckoutPage() {
  // Steps for the checkout process
  const steps = ['Shipping', 'Review & Payment'];

  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { settings, loading: settingsLoading } = useSettings();
  const theme = useTheme();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  // State for PayPal client ID
  const [paypalClientId, setPaypalClientId] = useState('test');
  // Add state for available payment methods
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState([]);
  // Form validation errors
  const [errors, setErrors] = useState({});
  
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

  // Update PayPal client ID and payment methods when settings change
  useEffect(() => {
    if (!settingsLoading && settings) {
      if (settings?.payment?.paypalClientId) {
        setPaypalClientId(settings.payment.paypalClientId);
      }
      
      // Set available payment methods based on settings
      const methods = getAvailablePaymentMethods(settings);
      setAvailablePaymentMethods(methods);
      
      // Set default payment method based on available methods
      if (methods.length > 0 && !formData.paymentMethod) {
        setFormData(prev => ({
          ...prev,
          paymentMethod: methods[0].id
        }));
      }
    }
  }, [settings, settingsLoading, formData.paymentMethod]);

  // Handle PayPal payment success
  const handlePayPalSuccess = (data) => {
    console.log('PayPal payment successful:', data);
    setCompletedOrderId(data.orderId);
    setOrderComplete(true);
    setActiveStep(steps.length);
    setPaymentProcessing(false);
  };
  
  // Handle PayPal payment error
  const handlePayPalError = (error) => {
    console.error('PayPal payment error:', error);
    setError('Payment failed. Please try again.');
    setPaymentProcessing(false);
  };

  // Effect to clear cart when order is complete
  useEffect(() => {
    if (orderComplete && completedOrderId) {
      clearCart();
    }
  }, [orderComplete, completedOrderId]); // Removed clearCart from dependencies to prevent infinite loop
  
  // Shipping cost calculation based on settings
  const shippingCost = settings?.shipping?.enableFreeShipping && cartTotal > (settings?.shipping?.freeShippingThreshold || 100) 
    ? 0 
    : (settings?.shipping?.flatRateShipping || 10);
  
  // Tax calculation based on settings
  const taxAmount = calculateTax(cartTotal, settings);
  
  // Final total
  const finalTotal = cartTotal + shippingCost + taxAmount;
  
  // Handle next step
  const handleNext = () => {
    if (!validateStep()) {
      return;
    }
    
    // Go directly to review step (step 1) after shipping (step 0)
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Validate current step
  const validateStep = () => {
    const newErrors = {};
    
    if (activeStep === 0) {
      // Validate shipping form
      const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
      
      for (const field of requiredFields) {
        if (!formData[field] || !formData[field].toString().trim()) {
          newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        }
      }
      
      // Email validation
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      // Phone validation
      if (formData.phone && !/^[\d\s()+-]{10,15}$/.test(formData.phone.replace(/[\s()-]/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number';
      }
      
      // ZIP code validation based on country
      if (formData.zipCode) {
        if (formData.country === 'United States' && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
          newErrors.zipCode = 'Please enter a valid US ZIP code';
        } else if (formData.country === 'Canada' && !/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(formData.zipCode)) {
          newErrors.zipCode = 'Please enter a valid Canadian postal code (e.g., A1A 1A1)';
        }
      }
      
      setErrors(newErrors);
      
      if (Object.keys(newErrors).length > 0) {
        setError('Please fill in all required fields correctly');
        return false;
      }
    }
    
    setError('');
    return true;
  };
  
  // Handle place order (for non-PayPal payments)
  const handlePlaceOrder = async () => {
    // For PayPal, the order creation and payment is handled directly in PayPal component
    if (formData.paymentMethod === 'paypal') {
      setError('Please complete PayPal payment above.');
      return;
    }
    
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
      
      // For non-PayPal methods, order is complete
      setCompletedOrderId(data.data._id);
      setOrderComplete(true);
      setActiveStep(steps.length);
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
        return <ShippingForm formData={formData} setFormData={setFormData} user={user} errors={errors} setErrors={setErrors} />;
      case 1:
        return (
          <ReviewAndPayment 
            formData={formData} 
            setFormData={setFormData} 
            cart={cart}
            cartTotal={cartTotal}
            shippingCost={shippingCost}
            taxAmount={taxAmount}
            finalTotal={finalTotal}
            onPayPalSuccess={handlePayPalSuccess}
            onPayPalError={handlePayPalError}
            onPlaceOrder={handlePlaceOrder}
            loading={loading}
            availablePaymentMethods={availablePaymentMethods}
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
              <Link href="/cart" passHref>
                <Typography color="white" sx={{ 
                  '&:hover': { textDecoration: 'underline' },
                  opacity: 0.9,
                  fontWeight: 500,
                }}>
                  Cart
                </Typography>
              </Link>
              <Typography color="white" sx={{ fontWeight: 600 }}>Checkout</Typography>
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
                <Payment sx={{ fontSize: 30, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h3" component="h1" sx={{ 
                  fontWeight: 800, 
                  color: 'white',
                  mb: 1,
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                }}>
                  Secure Checkout
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 500,
                }}>
                  Complete your order safely and securely
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 4 }}>
      
        <Paper sx={{ 
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          boxShadow: theme.palette.mode === 'dark' ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.1)',
          border: theme.palette.mode === 'dark' ? '1px solid #333333' : '1px solid #e0e0e0',
          bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'background.paper',
        }}>
        <Stepper 
          activeStep={activeStep} 
          sx={{ 
            mb: 4,
            '& .MuiStepLabel-root .Mui-completed': {
              color: '#a29278',
            },
            '& .MuiStepLabel-root .Mui-active': {
              color: '#a29278',
            },
            '& .MuiStep-root': {
              '& .MuiStepIcon-root': {
                '&.Mui-completed': {
                  color: '#a29278',
                },
                '&.Mui-active': {
                  color: '#a29278',
                },
              },
            },
          }}
        >
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
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Box sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 10px 30px rgba(76, 175, 80, 0.3)',
            }}>
              <CheckCircle sx={{ fontSize: 50, color: 'white' }} />
            </Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50', mb: 2 }}>
              Thank you for your order!
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: theme.palette.mode === 'dark' ? '#CCCCCC' : '#5f6368', maxWidth: 600, mx: 'auto' }}>
              Your order number is <strong>#{completedOrderId}</strong>. We have emailed your order confirmation,
              and will send you an update when your order has shipped.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                component={Link} 
                href="/"
                size="large"
                sx={{ 
                  background: 'linear-gradient(135deg, #a29278, #8b7d65)',
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #8b7d65, #6d5d4a)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(162, 146, 120, 0.4)',
                  },
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                }}
              >
                Continue Shopping
              </Button>
              <Button 
                variant="outlined" 
                component={Link} 
                href={`/customer/orders/${completedOrderId}`}
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: '#a29278',
                  color: '#a29278',
                  '&:hover': {
                    borderColor: '#8b7d65',
                    color: '#8b7d65',
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(162, 146, 120, 0.1)' : 'rgba(162, 146, 120, 0.05)',
                    transform: 'translateY(-2px)',
                  },
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                }}
              >
                View Order
              </Button>
            </Box>
          </Box>
        ) : (
          // Checkout steps
          <Box>
            {error && (
              <Alert severity="error" sx={{ mb: 3, bgcolor: theme.palette.mode === 'dark' ? '#331111' : '#ffebee', color: theme.palette.mode === 'dark' ? '#FF6B6B' : '#d32f2f' }}>
                {error}
              </Alert>
            )}
            
            {getStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
              {activeStep !== 0 && (
                <Button 
                  onClick={handleBack} 
                  size="large"
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    color: theme.palette.mode === 'dark' ? '#CCCCCC' : '#5f6368',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                    },
                  }}
                >
                  Back
                </Button>
              )}
              
              {/* Show Next button only for step 0 (Shipping) */}
              {activeStep === 0 && (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading}
                  size="large"
                  sx={{ 
                    background: 'linear-gradient(135deg, #a29278, #8b7d65)',
                    '&:hover': { 
                      background: 'linear-gradient(135deg, #8b7d65, #6d5d4a)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(162, 146, 120, 0.4)',
                    },
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    '&:disabled': {
                      background: theme.palette.mode === 'dark' ? '#333333' : '#e0e0e0',
                      color: theme.palette.mode === 'dark' ? '#666666' : '#9e9e9e',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Continue to Review & Payment'
                  )}
                </Button>
              )}
            </Box>
          </Box>
        )}
        </Paper>
        </Container>
      </Box>
      </PayPalScriptProvider>
  );
}