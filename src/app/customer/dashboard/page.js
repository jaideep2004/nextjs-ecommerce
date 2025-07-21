'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
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
} from '@mui/material';
import {
  Person,
  ShoppingBag,
  Favorite,
  LocationOn,
  VpnKey,
  NavigateNext,
  Edit,
  Save,
  Cancel,
} from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import { Add } from '@mui/icons-material';

// Profile Information Component
const ProfileInfo = ({ user, onUpdate }) => {
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
        <Typography variant="h6" component="h2">
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
            />
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

// Address Component
const AddressInfo = ({ user, onUpdate }) => {
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
        <Typography variant="h6" component="h2">
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
      <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/orders?limit=5');
        
        if (!res.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await res.json();
        setOrders(data.orders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
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
      <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
        Recent Orders
      </Typography>
      
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell component="th" scope="row">
                  #{order._id.substring(0, 8)}
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
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

export default function CustomerDashboard() {
  const router = useRouter();
  const { user, loading: authLoading, logout, updateUserData } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  
  // Redirect if user is not logged in
  useEffect(() => {
    if (!authLoading && !user && typeof window !== 'undefined') {
      router.push('/login?redirect=/customer/dashboard');
    }
  }, [user, authLoading, router]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
        <Typography color="text.primary">My Account</Typography>
      </Breadcrumbs>
      
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        My Account
      </Typography>
      
      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, mb: { xs: 3, md: 0 } }}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#8D6E63' }}>
                <Person fontSize="large" />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {user.email}
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={logout}
                fullWidth
              >
                Log Out
              </Button>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <List component="nav" sx={{ p: 0 }}>
              <ListItem 
                button 
                selected={tabValue === 0}
                onClick={() => setTabValue(0)}
              >
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              
              <ListItem 
                button 
                selected={tabValue === 1}
                onClick={() => setTabValue(1)}
              >
                <ListItemIcon>
                  <ShoppingBag />
                </ListItemIcon>
                <ListItemText primary="Orders" />
              </ListItem>
              
              <ListItem 
                button 
                selected={tabValue === 2}
                onClick={() => setTabValue(2)}
              >
                <ListItemIcon>
                  <LocationOn />
                </ListItemIcon>
                <ListItemText primary="Addresses" />
              </ListItem>
              
              <ListItem 
                button 
                selected={tabValue === 3}
                onClick={() => setTabValue(3)}
              >
                <ListItemIcon>
                  <VpnKey />
                </ListItemIcon>
                <ListItemText primary="Password" />
              </ListItem>
              
              <ListItem 
                button 
                component={Link}
                href="/customer/wishlist"
              >
                <ListItemIcon>
                  <Favorite />
                </ListItemIcon>
                <ListItemText primary="Wishlist" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3 }}>
            {/* Mobile Tabs */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 3 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant="scrollable"
                scrollButtons="auto"
                sx={{ 
                  borderBottom: 1, 
                  borderColor: 'divider',
                  '& .Mui-selected': { color: '#8D6E63' },
                  '& .MuiTabs-indicator': { backgroundColor: '#8D6E63' },
                }}
              >
                <Tab label="Profile" />
                <Tab label="Orders" />
                <Tab label="Addresses" />
                <Tab label="Password" />
              </Tabs>
            </Box>
            
            {/* Tab Content */}
            {tabValue === 0 && (
              <ProfileInfo user={user} onUpdate={updateUserData} />
            )}
            
            {tabValue === 1 && (
              <RecentOrders />
            )}
            
            {tabValue === 2 && (
              <AddressInfo user={user} onUpdate={updateUserData} />
            )}
            
            {tabValue === 3 && (
              <PasswordChange />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}