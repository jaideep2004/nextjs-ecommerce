'use client';

import React from 'react';
import { useState, useEffect } from 'react';

import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  ShoppingBag,
  People,
  AttachMoney,
  Assessment,
  LocalShipping,
  CheckCircle,
} from '@mui/icons-material';

// Enhanced Analytics Stat Card Component
const StatCard = ({ title, value, icon, color, percentChange, changeType, isLoading = false }) => {
  const gradients = {
    success: 'linear-gradient(135deg, #4caf50, #66bb6a)',
    info: 'linear-gradient(135deg, #2196f3, #42a5f5)',
    warning: 'linear-gradient(135deg, #ff9800, #ffb74d)',
    error: 'linear-gradient(135deg, #f44336, #e57373)',
    primary: 'linear-gradient(135deg, #8D6E63, #a1887f)',
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        position: 'relative',
        overflow: 'visible',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardContent sx={{ position: 'relative', p: 3 }}>
        {/* Background Icon */}
        <Box 
          sx={{
            position: 'absolute',
            top: -10,
            right: -10,
            width: 80,
            height: 80,
            background: gradients[color] || gradients.primary,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          }}
        >
          {React.cloneElement(icon, { 
            sx: { 
              fontSize: 32, 
              color: 'white',
            } 
          })}
        </Box>

        <Box sx={{ pr: 6 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: '#6c757d',
              fontWeight: 600,
              mb: 1,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '0.75rem',
            }}
          >
            {title}
          </Typography>
          
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              color: '#2c3e50',
              mb: 2,
              fontSize: '2rem',
            }}
          >
            {value}
          </Typography>
          
          {percentChange !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {changeType === 'increase' ? (
                <TrendingUp sx={{ color: '#4caf50', mr: 0.5, fontSize: 20 }} />
              ) : (
                <Assessment sx={{ color: '#f44336', mr: 0.5, fontSize: 20 }} />
              )}
              <Typography 
                variant="body2" 
                sx={{
                  color: changeType === 'increase' ? '#4caf50' : '#f44336',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                {percentChange}% from last month
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const theme = useTheme();

  // Fetch analytics data from API
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Fetch real analytics data from dashboard API
        const response = await axios.get('/api/admin/dashboard');
        console.log('Analytics data received:', response.data);
        
        let apiData;
        if (response.data && response.data.data) {
          apiData = response.data.data;
        } else if (response.data) {
          apiData = response.data;
        } else {
          throw new Error('Unexpected API response format');
        }
        
        // Transform API data with enhanced analytics
        const formattedData = {
          totalSales: apiData.totalSales || 0,
          totalOrders: apiData.totalOrders || 0,
          totalCustomers: apiData.totalUsers || 0,
          conversionRate: ((apiData.totalOrders || 0) / Math.max((apiData.totalUsers || 1), 1) * 100).toFixed(1),
          salesGrowth: 15.2, // Mock data for demo
          ordersGrowth: 8.7,
          customersGrowth: 12.4,
          recentOrders: apiData.recentOrders || [],
          lowStockProducts: apiData.lowStockProducts || [],
        };
        
        setAnalyticsData(formattedData);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err.message || 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, []);
  
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
           sx={{ fontWeight: 700, color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50' }}
        >
          Sales Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your store's performance and key business metrics
        </Typography>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#2196f3' }} size={48} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : (
        <>
          {/* Analytics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard 
                title="Total Sales" 
                value={`$${analyticsData.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                icon={<AttachMoney />} 
                color="success"
                percentChange={analyticsData.salesGrowth}
                changeType="increase"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard 
                title="Total Orders" 
                value={analyticsData.totalOrders} 
                icon={<ShoppingBag />} 
                color="info"
                percentChange={analyticsData.ordersGrowth}
                changeType="increase"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard 
                title="Total Customers" 
                value={analyticsData.totalCustomers} 
                icon={<People />} 
                color="warning"
                percentChange={analyticsData.customersGrowth}
                changeType="increase"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard 
                title="Conversion Rate" 
                value={`${analyticsData.conversionRate}%`} 
                icon={<TrendingUp />} 
                color="primary"
              />
            </Grid>
          </Grid>
          
          <Grid container spacing={4}>
            {/* Recent Orders Summary */}
            <Grid item xs={12} lg={6}  sx={{flex: { xs: 1, md: 1 } }}>
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', mb: 3 }}>
                  Recent Activity
                </Typography>
                {analyticsData.recentOrders && analyticsData.recentOrders.length > 0 ? (
                  <Box>
                    {analyticsData.recentOrders.slice(0, 5).map((order, index) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none' }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Order #{order._id?.substring(0, 8)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.user?.name || 'Unknown'} • {new Date(order.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2196f3' }}>
                          ${order.totalPrice?.toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                    No recent orders found
                  </Typography>
                )}
              </Paper>
            </Grid>
            
            {/* Low Stock Alert */}
            <Grid item xs={12} lg={6} sx={{flex: { xs: 1, md: 1 } }}>
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', mb: 3 }}>
                  Inventory Alert
                </Typography>
                {analyticsData.lowStockProducts && analyticsData.lowStockProducts.length > 0 ? (
                  <Box>
                    {analyticsData.lowStockProducts.slice(0, 5).map((product, index) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none' }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {product.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ${product.price?.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600, 
                              color: product.countInStock <= 5 ? '#f44336' : '#ff9800'
                            }}
                          >
                            {product.countInStock} left
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                    All products are well stocked
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}