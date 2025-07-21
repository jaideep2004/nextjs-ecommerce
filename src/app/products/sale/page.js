'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Breadcrumbs,
} from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import ProductGrid from '@/components/products/ProductGrid';

export default function SalePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/products?onSale=true');
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching sale products:', err);
        setError(err.response?.data?.message || 'Failed to load sale products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSaleProducts();
  }, []);
  
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
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
        <Link href="/products" passHref>
          <Typography color="inherit" sx={{ '&:hover': { textDecoration: 'underline' } }}>
            Products
          </Typography>
        </Link>
        <Typography color="text.primary">Sale</Typography>
      </Breadcrumbs>
      
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Products on Sale
      </Typography>
      
      {error ? (
        <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
      ) : (
        <ProductGrid 
          products={products} 
          loading={loading} 
          emptyMessage="No sale products found"
        />
      )}
    </Container>
  );
}