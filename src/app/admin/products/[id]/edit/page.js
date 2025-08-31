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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import { useAuth } from '@/contexts/AuthContext';

export default function EditProductPage({ params }) {
  const { id } = params;
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && (!user || !user.isAdmin)) {
      router.push(`/login?redirect=/admin/products/${id}/edit`);
      return;
    }

    // Fetch product and categories
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch product
        const productRes = await axios.get(`/api/products/${id}`);
        setProduct(productRes.data.data);
        
        // Fetch categories
        const categoriesRes = await axios.get('/api/categories');
        setCategories(categoriesRes.data.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.isAdmin) {
      fetchData();
    }
  }, [id, user, authLoading, router]);

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

  if (!product) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>Product not found</Alert>
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
              <Typography color="text.primary">Edit Product: {product.name}</Typography>
            </Breadcrumbs>
          </Paper>
          
          <ProductForm product={product} categories={categories} isEdit={true} />
        </Container>
      </Box>
    </Box>
  );
}