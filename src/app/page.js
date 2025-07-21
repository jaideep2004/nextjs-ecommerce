

'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';
import axios from 'axios';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch featured products
        const featuredRes = await axios.get('/api/products?featured=true&limit=8');
        
        // Fetch new arrivals
        const newArrivalsRes = await axios.get('/api/products?sort=createdAt:desc&limit=8');
        
        setFeaturedProducts(featuredRes.data.data.products);
        setNewArrivals(newArrivalsRes.data.data.products);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false); 
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box>
      <Hero />
      
      <Container maxWidth="lg">
        <Box sx={{ py: 6 }}>
          <ProductGrid 
            products={featuredProducts} 
            loading={loading} 
            error={error}
            title="Featured Products"
          />
          
          <Divider sx={{ my: 6 }} />
          
          <ProductGrid 
            products={newArrivals} 
            loading={loading} 
            error={error}
            title="New Arrivals"
          />
        </Box>
      </Container>
    </Box>
  );
}
