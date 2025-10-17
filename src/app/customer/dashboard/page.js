'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeContext } from '@/theme';
import Link from 'next/link';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  Person,
  ShoppingBag,
  LocationOn,
  VpnKey,
  NavigateNext,
  Edit,
  Save,
  Cancel,
  Add,
  AttachMoney,
  TrendingUp,
} from '@mui/icons-material';
import CustomerSidebar from '@/components/customer/CustomerSidebar';

// Profile Information Component
const ProfileInfo = ({ user, onUpdate }) => {
  const { theme } = useThemeContext();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const data = await response.json();
      setSuccess('Profile updated successfully');
      setEditing(false);
      
      // Update user context
      if (onUpdate) {
        onUpdate(data);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h6" 
          component="h2"
          sx={{
            color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
          }}
        >
          Profile Information
        </Typography>
        
        {!editing ? (
          <Button 
            startIcon={<Edit />} 
            onClick={() => setEditing(true)}
            size="small"
          >
            Edit
          </Button>
        ) : (
          <Box>
            <Button 
              startIcon={<Cancel />} 
              onClick={() => setEditing(false)}
              size="small"
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button 
              startIcon={<Save />} 
              onClick={handleSubmit}
              size="small"
              variant="contained"
              disabled={loading}
              sx={{ 
                bgcolor: '#8D6E63',
                '&:hover': { bgcolor: '#6D4C41' },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </Box>
        )}
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!editing}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'white',
                  '& fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#333333' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'rgba(0, 0, 0, 0.6)',
                },
                '& .MuiInputBase-input': {
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editing}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'white',
                  '& fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#333333' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'rgba(0, 0, 0, 0.6)',
                },
                '& .MuiInputBase-input': {
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!editing}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'white',
                  '& fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#333333' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'rgba(0, 0, 0, 0.6)',
                },
                '& .MuiInputBase-input': {
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                },
              }}
            />
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

// Address Component
const AddressInfo = ({ user, onUpdate }) => {
  const { theme } = useThemeContext();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // States list (simplified for US)
  const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  
  // Countries list (simplified)
  const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'India'];
  
  useEffect(() => {
    if (user && user.address) {
      setFormData({
        street: user.address.street || '',
        city: user.address.city || '',
        state: user.address.state || '',
        zipCode: user.address.zipCode || '',
        country: user.address.country || '',
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update address');
      }
      
      const data = await response.json();
      setSuccess('Address updated successfully');
      setEditing(false);
      
      // Update user context
      if (onUpdate) {
        onUpdate(data);
      }
    } catch (err) {
      console.error('Error updating address:', err);
      setError(err.message || 'Failed to update address');
    } finally {
      setLoading(false);
    }
  };
  
  const hasAddress = user && user.address && user.address.street;
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h6" 
          component="h2"
          sx={{
            color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
          }}
        >
          Address Information
        </Typography>
        
        {!editing ? (
          <Button 
            startIcon={hasAddress ? <Edit /> : <Add />} 
            onClick={() => setEditing(true)}
            size="small"
          >
            {hasAddress ? 'Edit' : 'Add'}
          </Button>
        ) : (
          <Box>
            <Button 
              startIcon={<Cancel />} 
              onClick={() => setEditing(false)}
              size="small"
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button 
              startIcon={<Save />} 
              onClick={handleSubmit}
              size="small"
              variant="contained"
              disabled={loading}
              sx={{ 
                bgcolor: '#8D6E63',
                '&:hover': { bgcolor: '#6D4C41' },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </Box>
        )}
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      {!editing && hasAddress ? (
        <Box>
          <Typography variant="body1">{user.address.street}</Typography>
          <Typography variant="body1">
            {user.address.city}, {user.address.state} {user.address.zipCode}
          </Typography>
          <Typography variant="body1">{user.address.country}</Typography>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                name="street"
                value={formData.street}
                onChange={handleChange}
                disabled={!editing}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'white',
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? '#333333' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'rgba(0, 0, 0, 0.6)',
                  },
                  '& .MuiInputBase-input': {
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!editing}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'white',
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? '#333333' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'rgba(0, 0, 0, 0.6)',
                  },
                  '& .MuiInputBase-input': {
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State/Province"
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={!editing}
                required
                select
                SelectProps={{ native: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'white',
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? '#333333' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'rgba(0, 0, 0, 0.6)',
                  },
                  '& .MuiInputBase-input': {
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                  },
                }}
              >
                <option value=""></option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ZIP / Postal Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                disabled={!editing}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'white',
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? '#333333' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'rgba(0, 0, 0, 0.6)',
                  },
                  '& .MuiInputBase-input': {
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={!editing}
                required
                select
                SelectProps={{ native: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'white',
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? '#333333' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'rgba(0, 0, 0, 0.6)',
                  },
                  '& .MuiInputBase-input': {
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                  },
                }}
              >
                <option value=""></option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </form>
      )}
    </Box>
  );
};

// Password Change Component
const PasswordChange = () => {
  const { theme } = useThemeContext();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          password: formData.newPassword,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update password');
      }
      
      setSuccess('Password updated successfully');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.error('Error updating password:', err);
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box>
      <Typography 
        variant="h6" 
        component="h2" 
        sx={{ 
          mb: 3,
          color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
        }}
      >
        Change Password
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current Password"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'white',
                  '& fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#333333' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'rgba(0, 0, 0, 0.6)',
                },
                '& .MuiInputBase-input': {
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'white',
                  '& fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#333333' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'rgba(0, 0, 0, 0.6)',
                },
                '& .MuiInputBase-input': {
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : 'white',
                  '& fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#333333' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#a29278' : '#a29278',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'rgba(0, 0, 0, 0.6)',
                },
                '& .MuiInputBase-input': {
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
              sx={{ 
                bgcolor: '#8D6E63',
                '&:hover': { bgcolor: '#6D4C41' },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Update Password'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

// Recent Orders Component
const RecentOrders = () => {
  const { theme } = useThemeContext();
  const { api } = useAuth(); // Get the authenticated API client
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Use the authenticated API client instead of fetch
        const response = await api.get('/orders?limit=5');
        
        // Handle both data formats and ensure orders is always an array
        const ordersData = response.data?.data?.orders || response.data?.orders || [];
        setOrders(ordersData);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [api]); // Add api as dependency
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress sx={{ color: '#8D6E63' }} />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }
  
  if (orders?.length === 0) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography variant="body1" color="text.secondary">
          You haven't placed any orders yet.
        </Typography>
        <Button 
          component={Link} 
          href="/products" 
        
          variant="contained"
          size="small"
          sx={{ 
            mt: 2,
            bgcolor: '#8D6E63',
            '&:hover': { bgcolor: '#6D4C41' },
          }}
        >
          Start Shopping
        </Button>
      </Box>
    );
  }
  
  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Processing':
        return 'info';
      case 'Shipped':
        return 'primary';
      case 'Delivered':
        return 'success';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };
  
  return (
    <Box>
      <Typography 
        variant="h6" 
        component="h2" 
        sx={{ 
          mb: 3,
          color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
        }}
      >
        Recent Orders
      </Typography>
      
      <TableContainer 
        component={Paper} 
        sx={{ 
          mb: 3,
          bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'white',
          boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
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
                Order ID
              </TableCell>
              <TableCell 
                sx={{ 
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                }}
              >
                Date
              </TableCell>
              <TableCell 
                align="right" 
                sx={{ 
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                }}
              >
                Total
              </TableCell>
              <TableCell 
                align="center" 
                sx={{ 
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                }}
              >
                Status
              </TableCell>
              <TableCell 
                align="right" 
                sx={{ 
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell 
                  component="th" 
                  scope="row"
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                  }}
                >
                  #{order._id.substring(0, 8)}
                </TableCell>
                <TableCell 
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'inherit' 
                  }}
                >
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell 
                  align="right" 
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' 
                  }}
                >
                  ${order.totalPrice.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={order.status} 
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Button 
                    component={Link} 
                    href={`/customer/orders/${order._id}`}
                    size="small"
                    sx={{
                      color: theme.palette.mode === 'dark' ? '#a29278' : 'primary.main',
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Button 
        component={Link} 
        href="/customer/orders"
        variant="outlined"
      >
        View All Orders
      </Button>
    </Box>
  );
};

// Dashboard Stat Card Component for Customer
const CustomerStatCard = ({ title, value, icon, color, description }) => {
  const { theme } = useThemeContext();
  
  return (
    <Card sx={{ 
      height: '100%',
      bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'white',
      color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography 
              variant="subtitle2" 
              gutterBottom
              sx={{ 
                color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary' 
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit',
              }}
            >
              {value}
            </Typography>
            {description && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary' 
                }}
              >
                {description}
              </Typography>
            )}
          </Box>
          <Box 
            sx={{ 
              p: 1.5, 
              borderRadius: '50%', 
              bgcolor: theme.palette.mode === 'dark' ? `${color}.dark` : `${color}.light`,
              color: theme.palette.mode === 'dark' ? '#FFFFFF' : `${color}.main`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function CustomerDashboard() {
  const router = useRouter();
  const { user, loading: authLoading, updateProfile, api } = useAuth(); // Add api from useAuth
  const { theme } = useThemeContext();
  const [activeTab, setActiveTab] = useState('profile');
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistItems: 0,
    pendingOrders: 0,
  });
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Redirect if user is not logged in
  useEffect(() => {
    // Add a small delay to allow NextAuth to fully synchronize
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Check if we're still loading authentication state
    if (authLoading || initialLoad) {
      return;
    }
    
    // If no user after loading is complete, redirect to login
    if (!user && typeof window !== 'undefined') {
      router.push('/login?redirect=/customer/dashboard');
    }
  }, [user, authLoading, router, initialLoad]);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user) return;
      
      try {
        // Fetch user orders to calculate stats using authenticated API client
        const ordersRes = await api.get('/orders');
        const ordersData = ordersRes.data?.data?.orders || ordersRes.data?.orders || [];
          
        const totalSpent = ordersData.reduce((sum, order) => sum + order.totalPrice, 0);
        const pendingOrders = ordersData.filter(order => order.orderStatus === 'Pending').length;
          
        setDashboardStats({
          totalOrders: ordersData.length,
          totalSpent,
          pendingOrders,
          wishlistItems: 0, // We'll update this when we fetch wishlist
        });
        
        // Fetch wishlist items count using authenticated API client
        const wishlistRes = await api.get('/wishlist');
        const wishlistData = wishlistRes.data?.data?.wishlist || wishlistRes.data?.wishlist || [];
        setDashboardStats(prev => ({
          ...prev,
          wishlistItems: wishlistData.length,
        }));
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };
    
    fetchDashboardStats();
  }, [user, api]); // Add api as dependency
  
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
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
    <Box sx={{ display: 'flex' }}>
      <CustomerSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: theme.palette.mode === 'dark' ? '#000000' : '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Paper 
            sx={{ 
              p: 2, 
              mb: 3,
              bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'white',
              boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
              <Link href="/" passHref>
                <Typography 
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? '#a29278' : 'inherit',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                    cursor: 'pointer',
                  }}
                >
                  Home
                </Typography>
              </Link>
              <Typography 
                sx={{ 
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'text.primary' 
                }}
              >
                My Account
              </Typography>
            </Breadcrumbs>
          </Paper>

          {/* Dashboard Overview - only show for profile tab */}
          {activeTab === 'profile' && (
            <>
              {/* Page Header */}
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50',
                    mb: 1,
                  }}
                >
                  Welcome back, {user?.name?.split(' ')[0] || 'Customer'}!
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary' 
                  }}
                >
                  Manage your account, orders, and preferences
                </Typography>
              </Box>

              {/* Stats Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} lg={3} style={{minWidth: '240px'}}>
                  <CustomerStatCard 
                    title="Total Orders" 
                    value={dashboardStats.totalOrders} 
                    icon={<ShoppingBag />} 
                    color="info"
                    description="Lifetime orders"
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={3} style={{minWidth: '240px'}}>
                  <CustomerStatCard 
                    title="Total Spent" 
                    value={`$${dashboardStats.totalSpent.toFixed(2)}`} 
                    icon={<AttachMoney />} 
                    color="success"
                    description="Lifetime spending"
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={3} style={{minWidth: '240px'}}>
                  <CustomerStatCard 
                    title="Pending Orders" 
                    value={dashboardStats.pendingOrders} 
                    icon={<TrendingUp />} 
                    color="warning"
                    description="Awaiting processing"
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={3} style={{minWidth: '240px'}}>
                  <CustomerStatCard 
                    title="Wishlist Items" 
                    value={dashboardStats.wishlistItems} 
                    icon={<Person />} 
                    color="primary"
                    description="Saved for later"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={4}>
                {/* Quick Actions */}
                <Grid item xs={12} md={6}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2, 
                      boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
                      bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'white',
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50', 
                        mb: 3 
                      }}
                    >
                      Quick Actions
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        startIcon={<ShoppingBag />}
                        onClick={() => handleTabChange('orders')}
                        sx={{ justifyContent: 'flex-start' }}
                      >
                        View My Orders
                      </Button>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        startIcon={<LocationOn />}
                        onClick={() => handleTabChange('addresses')}
                        sx={{ justifyContent: 'flex-start' }}
                      >
                        Manage Addresses
                      </Button>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        startIcon={<VpnKey />}
                        onClick={() => handleTabChange('password')}
                        sx={{ justifyContent: 'flex-start' }}
                      >
                        Change Password
                      </Button>
                      <Button 
                        variant="contained" 
                        fullWidth 
                        component={Link}
                        href="/products"
                        sx={{ 
                          bgcolor: '#2196f3',
                          '&:hover': { bgcolor: '#1976d2' },
                        }}
                      >
                        Continue Shopping
                      </Button>
                    </Box>
                  </Paper>
                </Grid>

                {/* Recent Orders Summary */}
                <Grid item xs={12} md={6}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2, 
                      boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
                      bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'white',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50' 
                        }}
                      >
                        Recent Orders
                      </Typography>
                      <Button 
                        onClick={() => handleTabChange('orders')}
                        size="small"
                        variant="outlined"
                      >
                        View All
                      </Button>
                    </Box>
                    <RecentOrders />
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}

          {/* Tab Content - Only show for non-profile tabs */}
          {activeTab !== 'profile' && (
            <Box sx={{ mt: 4 }}>
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
                  bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'white',
                }}
              >
                {activeTab === 'profile' && (
                  <ProfileInfo user={user} onUpdate={updateProfile} /> // Add onUpdate prop
                )}

                {activeTab === 'addresses' && (
                  <AddressInfo user={user} onUpdate={updateProfile} />
                )}
                
                {activeTab === 'orders' && (
                  <RecentOrders /> 
                )}
                
                {activeTab === 'password' && (
                  <PasswordChange />
                )}
              </Paper>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
}