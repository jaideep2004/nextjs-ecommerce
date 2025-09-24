'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  Grid,
  Divider,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  LocalOffer,
  CalendarToday,
  TrendingUp,
  Person,
  ShoppingCart,
  LocalShipping,
} from '@mui/icons-material';
import { format } from 'date-fns';

export default function AdminCouponsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percentage',
    value: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    validFrom: '',
    validUntil: '',
    usageLimit: '',
    usageLimitPerUser: '',
    isActive: true,
    applicableProducts: [],
    excludedProducts: [],
    applicableCategories: [],
    excludedCategories: [],
  });

  // Check authentication and admin role
  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push('/login');
      return;
    }
  }, [user, loading, router]);

  // Fetch coupons
  useEffect(() => {
    if (user && user.isAdmin) {
      fetchCoupons();
    }
  }, [user]);

  const fetchCoupons = async () => {
    try {
      setLoadingCoupons(true);
      const response = await fetch('/api/coupons', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCoupons(data.coupons || []);
      } else {
        setError(data.message || 'Failed to fetch coupons');
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setError('Failed to fetch coupons');
    } finally {
      setLoadingCoupons(false);
    }
  };

  const handleOpenDialog = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        minOrderAmount: coupon.minOrderAmount || '',
        maxDiscountAmount: coupon.maxDiscountAmount || '',
        validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : '',
        validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : '',
        usageLimit: coupon.usageLimit || '',
        usageLimitPerUser: coupon.usageLimitPerUser || '',
        isActive: coupon.isActive,
        applicableProducts: coupon.applicableProducts || [],
        excludedProducts: coupon.excludedProducts || [],
        applicableCategories: coupon.applicableCategories || [],
        excludedCategories: coupon.excludedCategories || [],
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        description: '',
        type: 'percentage',
        value: '',
        minOrderAmount: '',
        maxDiscountAmount: '',
        validFrom: '',
        validUntil: '',
        usageLimit: '',
        usageLimitPerUser: '',
        isActive: true,
        applicableProducts: [],
        excludedProducts: [],
        applicableCategories: [],
        excludedCategories: [],
      });
    }
    setOpenDialog(true);
    setError('');
    setSuccess('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCoupon(null);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.code || !formData.description || !formData.value) {
        setError('Please fill in all required fields');
        return;
      }

      const method = editingCoupon ? 'PUT' : 'POST';
      const url = editingCoupon ? `/api/coupons/${editingCoupon._id}` : '/api/coupons';

      const requestData = {
        ...formData,
        value: parseFloat(formData.value),
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : undefined,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : undefined,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        usageLimitPerUser: formData.usageLimitPerUser ? parseInt(formData.usageLimitPerUser) : undefined,
        validFrom: formData.validFrom ? new Date(formData.validFrom) : undefined,
        validUntil: formData.validUntil ? new Date(formData.validUntil) : undefined,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(editingCoupon ? 'Coupon updated successfully!' : 'Coupon created successfully!');
        fetchCoupons();
        setTimeout(() => {
          handleCloseDialog();
        }, 1500);
      } else {
        setError(data.message || 'Failed to save coupon');
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
      setError('Failed to save coupon');
    }
  };

  const handleDelete = async (couponId) => {
    if (!confirm('Are you sure you want to delete this coupon?')) {
      return;
    }

    try {
      const response = await fetch(`/api/coupons/${couponId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        setSuccess('Coupon deleted successfully!');
        fetchCoupons();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete coupon');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      setError('Failed to delete coupon');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getCouponStatusChip = (coupon) => {
    const now = new Date();
    const validFrom = coupon.validFrom ? new Date(coupon.validFrom) : null;
    const validUntil = coupon.validUntil ? new Date(coupon.validUntil) : null;

    if (!coupon.isActive) {
      return <Chip label="Inactive" color="default" size="small" />;
    }

    if (validFrom && now < validFrom) {
      return <Chip label="Scheduled" color="info" size="small" />;
    }

    if (validUntil && now > validUntil) {
      return <Chip label="Expired" color="error" size="small" />;
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return <Chip label="Used Up" color="warning" size="small" />;
    }

    return <Chip label="Active" color="success" size="small" />;
  };

  const formatCouponValue = (coupon) => {
    if (coupon.type === 'percentage') {
      return `${coupon.value}%`;
    } else if (coupon.type === 'fixed_amount') {
      return `$${coupon.value}`;
    } else if (coupon.type === 'free_shipping') {
      return 'Free Shipping';
    }
    return coupon.value;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50' }}>
            Coupon Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: 'linear-gradient(135deg, #a29278, #8b7d65)',
              '&:hover': {
                background: 'linear-gradient(135deg, #8b7d65, #6d5d4a)',
              },
            }}
          >
            Create Coupon
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8f9fa' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocalOffer sx={{ color: '#a29278', fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50' }}>
                      {coupons.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Coupons
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8f9fa' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TrendingUp sx={{ color: '#4caf50', fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50' }}>
                      {coupons.filter(c => c.isActive).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Coupons
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8f9fa' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ShoppingCart sx={{ color: '#2196f3', fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50' }}>
                      {coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Usage
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8f9fa' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CalendarToday sx={{ color: '#ff9800', fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50' }}>
                      {coupons.filter(c => {
                        const now = new Date();
                        const validUntil = c.validUntil ? new Date(c.validUntil) : null;
                        return validUntil && now > validUntil;
                      }).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Expired Coupons
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Coupons Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ bgcolor: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type & Value</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Usage</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Valid Until</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingCoupons ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography>Loading coupons...</Typography>
                    </TableCell>
                  </TableRow>
                ) : coupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">No coupons found</Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog()}
                        sx={{ mt: 2 }}
                      >
                        Create Your First Coupon
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  coupons.map((coupon) => (
                    <TableRow key={coupon._id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {coupon.code}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {coupon.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {coupon.type === 'free_shipping' && <LocalShipping fontSize="small" />}
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCouponValue(coupon)}
                          </Typography>
                        </Box>
                        {coupon.minOrderAmount && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Min: ${coupon.minOrderAmount}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {getCouponStatusChip(coupon)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {coupon.usedCount || 0}
                          {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                        </Typography>
                        {coupon.usageLimitPerUser && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Per user: {coupon.usageLimitPerUser}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {coupon.validUntil ? (
                          <Typography variant="body2">
                            {format(new Date(coupon.validUntil), 'MMM dd, yyyy')}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No expiry
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(coupon)}
                              sx={{ color: '#2196f3' }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(coupon._id)}
                              sx={{ color: '#f44336' }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
        </DialogTitle>
        <DialogContent>
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

          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Coupon Code *"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                placeholder="e.g., WELCOME10"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Coupon Type *</InputLabel>
                <Select
                  value={formData.type}
                  label="Coupon Type *"
                  onChange={(e) => handleInputChange('type', e.target.value)}
                >
                  <MenuItem value="percentage">Percentage Discount</MenuItem>
                  <MenuItem value="fixed_amount">Fixed Amount</MenuItem>
                  <MenuItem value="free_shipping">Free Shipping</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description *"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="e.g., Welcome discount for new customers"
                multiline
                rows={2}
              />
            </Grid>
            
            {formData.type !== 'free_shipping' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={formData.type === 'percentage' ? 'Percentage Value *' : 'Fixed Amount *'}
                  type="number"
                  value={formData.value}
                  onChange={(e) => handleInputChange('value', e.target.value)}
                  InputProps={{
                    endAdornment: formData.type === 'percentage' ? '%' : '$',
                  }}
                />
              </Grid>
            )}
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  />
                }
                label="Active"
              />
            </Grid>

            {/* Conditions */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Conditions
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Order Amount"
                type="number"
                value={formData.minOrderAmount}
                onChange={(e) => handleInputChange('minOrderAmount', e.target.value)}
                InputProps={{ startAdornment: '$' }}
              />
            </Grid>
            
            {formData.type === 'percentage' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maximum Discount Amount"
                  type="number"
                  value={formData.maxDiscountAmount}
                  onChange={(e) => handleInputChange('maxDiscountAmount', e.target.value)}
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
            )}

            {/* Validity */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Validity & Usage
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valid From"
                type="date"
                value={formData.validFrom}
                onChange={(e) => handleInputChange('validFrom', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valid Until"
                type="date"
                value={formData.validUntil}
                onChange={(e) => handleInputChange('validUntil', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Usage Limit"
                type="number"
                value={formData.usageLimit}
                onChange={(e) => handleInputChange('usageLimit', e.target.value)}
                placeholder="Leave empty for unlimited"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Usage Limit Per User"
                type="number"
                value={formData.usageLimitPerUser}
                onChange={(e) => handleInputChange('usageLimitPerUser', e.target.value)}
                placeholder="Leave empty for unlimited"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #a29278, #8b7d65)',
              '&:hover': {
                background: 'linear-gradient(135deg, #8b7d65, #6d5d4a)',
              },
            }}
          >
            {editingCoupon ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
