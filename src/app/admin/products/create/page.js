'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';

import { useRouter } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import AdminSidebar from '@/components/admin/AdminSidebar';
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
      router.push('/login?redirect=/admin/products/create');
      return;
    }

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data.categories || []);
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">{error}</Typography>
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
              <MuiLink component={NextLink} href="/admin/dashboard" underline="hover" color="inherit">
                Dashboard
              </MuiLink>
              <MuiLink component={NextLink} href="/admin/products" underline="hover" color="inherit">
                Products
              </MuiLink>
              <Typography color="text.primary">Create New Product</Typography>
            </Breadcrumbs>
          </Paper>
          
          <ProductForm categories={categories} isEdit={false} />
        </Container>
      </Box>
    </Box>
  );
}