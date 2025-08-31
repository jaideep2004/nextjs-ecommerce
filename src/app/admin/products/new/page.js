'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Breadcrumbs, 
  Link as MuiLink,
  CircularProgress,
  Alert
} from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import { useAuth } from '@/contexts/AuthContext';


export default function CreateProductPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && (!user || !user.isAdmin)) {
      router.push('/login?redirect=/admin/products/new');
      return;
    }

    // Fetch categories
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories for new product form');
        const response = await axios.get('/api/categories');
        console.log('Categories data received:', response.data);
        setCategories(response.data.data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.isAdmin) {
      fetchCategories();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#2196f3' }} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
          Create New Product
        </Typography>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={NextLink} href="/admin/dashboard" underline="hover" color="inherit">
            Dashboard
          </MuiLink>
          <MuiLink component={NextLink} href="/admin/products" underline="hover" color="inherit">
            Products
          </MuiLink>
          <Typography color="text.primary">Create New Product</Typography>
        </Breadcrumbs>
      </Box>
      
      {/* Product Form */}
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <ProductForm categories={categories} isEdit={false} />
      </Paper>
    </Container>
  );
}