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
  CircularProgress,
  Alert,
  Breadcrumbs,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  NavigateNext,
  TrendingUp,
  ShoppingBag,
  People,
  AttachMoney,
} from '@mui/icons-material';
import AdminSidebar from '@/components/admin/AdminSidebar';

// Sample chart component (replace with actual chart library)
const SalesChart = ({ data }) => {
  return (
    <Box sx={{ height: 300, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Sales Trend
      </Typography>
      <Box sx={{ 
        height: '80%', 
        display: 'flex', 
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        mt: 2
      }}>
        {data.map((item, index) => (
          <Box 
            key={index}
            sx={{
              width: '8%',
              height: `${item.value}%`,
              bgcolor: '#8D6E63',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              position: 'relative',
              '&:hover': {
                bgcolor: '#6D4C41',
              },
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                position: 'absolute', 
                top: '-20px', 
                width: '100%', 
                textAlign: 'center' 
              }}
            >
              ${item.value * 100}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                position: 'absolute', 
                bottom: '-20px', 
                width: '100%', 
                textAlign: 'center' 
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Sample analytics card component
const AnalyticsCard = ({ title, value, icon, color, subtitle }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'medium', mb: 1 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
          <Box sx={{ 
            p: 1, 
            borderRadius: 1, 
            bgcolor: `${color}.light`,
            color: `${color}.main`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function AdminAnalytics() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  
  // Redirect if user is not admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/admin/analytics');
      } else if (!user.isAdmin) {
        router.push('/');
      }
    }
  }, [user, authLoading, router]);
  
  // Sample data - in a real app, this would come from an API
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!user || !user.isAdmin) return;
      
      try {
        setLoading(true);
        // In a real app, you would fetch data from an API
        // const res = await fetch('/api/admin/analytics');
        // const data = await res.json();
        
        // For now, we'll use sample data
        const sampleData = {
          salesTotal: 12580.45,
          salesGrowth: 12.5,
          ordersTotal: 142,
          ordersGrowth: 8.3,
          customersTotal: 89,
          customersGrowth: 15.2,
          conversionRate: 3.2,
          salesByMonth: [
            { label: 'Jan', value: 5.2 },
            { label: 'Feb', value: 4.8 },
            { label: 'Mar', value: 6.3 },
            { label: 'Apr', value: 5.9 },
            { label: 'May', value: 7.1 },
            { label: 'Jun', value: 8.5 },
            { label: 'Jul', value: 7.8 },
            { label: 'Aug', value: 8.2 },
            { label: 'Sep', value: 9.3 },
            { label: 'Oct', value: 8.7 },
            { label: 'Nov', value: 9.1 },
            { label: 'Dec', value: 10.5 },
          ],
          topProducts: [
            { name: 'Product A', sales: 42, revenue: 2100 },
            { name: 'Product B', sales: 38, revenue: 1900 },
            { name: 'Product C', sales: 31, revenue: 1550 },
            { name: 'Product D', sales: 28, revenue: 1400 },
            { name: 'Product E', sales: 25, revenue: 1250 },
          ],
          topCategories: [
            { name: 'Category A', sales: 85, revenue: 4250 },
            { name: 'Category B', sales: 64, revenue: 3200 },
            { name: 'Category C', sales: 52, revenue: 2600 },
          ],
        };
        
        setAnalyticsData(sampleData);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err.message || 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [user]);
  
  if (authLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#8D6E63' }} />
      </Container>
    );
  }
  
  if (!user || !user.isAdmin) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Breadcrumbs 
              separator={<NavigateNext fontSize="small" />} 
              aria-label="breadcrumb"
              sx={{ mb: 2 }}
            >
              <Typography 
                component={Link} 
                href="/" 
                color="inherit" 
                sx={{ '&:hover': { textDecoration: 'underline' } }}
              >
                Home
              </Typography>
              <Typography 
                component={Link} 
                href="/admin/dashboard" 
                color="inherit" 
                sx={{ '&:hover': { textDecoration: 'underline' } }}
              >
                Admin Dashboard
              </Typography>
              <Typography color="text.primary">Analytics</Typography>
            </Breadcrumbs>
          </Paper>
          
          <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
            Sales Analytics
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#8D6E63' }} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          ) : (
            <>
              {/* Analytics Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <AnalyticsCard 
                    title="Total Sales" 
                    value={`$${analyticsData.salesTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                    icon={<AttachMoney />} 
                    color="success"
                    subtitle={`${analyticsData.salesGrowth > 0 ? '+' : ''}${analyticsData.salesGrowth}% from last month`}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <AnalyticsCard 
                    title="Total Orders" 
                    value={analyticsData.ordersTotal} 
                    icon={<ShoppingBag />} 
                    color="info"
                    subtitle={`${analyticsData.ordersGrowth > 0 ? '+' : ''}${analyticsData.ordersGrowth}% from last month`}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <AnalyticsCard 
                    title="Total Customers" 
                    value={analyticsData.customersTotal} 
                    icon={<People />} 
                    color="warning"
                    subtitle={`${analyticsData.customersGrowth > 0 ? '+' : ''}${analyticsData.customersGrowth}% from last month`}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <AnalyticsCard 
                    title="Conversion Rate" 
                    value={`${analyticsData.conversionRate}%`} 
                    icon={<TrendingUp />} 
                    color="error"
                    subtitle="Visitors who completed purchase"
                  />
                </Grid>
              </Grid>
              
              {/* Sales Chart */}
              <Paper sx={{ p: 2, mb: 4 }}>
                <SalesChart data={analyticsData.salesByMonth} />
              </Paper>
              
              {/* Top Products and Categories */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Top Selling Products
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {analyticsData.topProducts.map((product, index) => (
                      <Box key={index} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">{product.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.sales} sales | ${product.revenue}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Top Categories
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {analyticsData.topCategories.map((category, index) => (
                      <Box key={index} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">{category.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {category.sales} sales | ${category.revenue}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
}