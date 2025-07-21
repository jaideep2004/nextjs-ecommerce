'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, Breadcrumbs, Link as MuiLink, Alert, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import ProductForm from '@/components/admin/ProductForm';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';

export default function EditProductPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;
  
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push(`/login?redirect=/admin/products/edit/${productId}`);
      return;
    }

    // Fetch product and categories
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching product details for ID:', productId);
        
        // Fetch product details
        const { data: productData } = await axios.get(`/api/admin/products/${productId}`);
        console.log('Product data received:', productData);
        
        // Fetch categories
        const { data: categoriesData } = await axios.get('/api/categories');
        console.log('Categories data received:', categoriesData);
        
        setProduct(productData);
        setCategories(categoriesData.categories || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'admin' && productId) {
      fetchData();
    }
  }, [user, authLoading, router, productId]);

  if (authLoading || loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">Product not found</Alert>
      </Container>
    );
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
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
              <Link href="/admin/dashboard" passHref>
                <MuiLink underline="hover" color="inherit">
                  Dashboard
                </MuiLink>
              </Link>
              <Link href="/admin/products" passHref>
                <MuiLink underline="hover" color="inherit">
                  Products
                </MuiLink>
              </Link>
              <Typography color="text.primary">Edit Product</Typography>
            </Breadcrumbs>
          </Paper>
          
          <ProductForm product={product} categories={categories} isEdit={true} />
        </Container>
      </Box>
    </Box>
  );
}