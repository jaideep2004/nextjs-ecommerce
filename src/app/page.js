
'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';
import axios from 'axios';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/products/ProductGrid';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch featured products
        const featuredRes = await axios.get('/api/products?featured=true&limit=8');
        console.log('Featured products response:', featuredRes.data);
        
        // Fetch new arrivals
        const newArrivalsRes = await axios.get('/api/products?sort=-createdAt&limit=8');
        console.log('New arrivals response:', newArrivalsRes.data);
        
        // Handle different response structures
        const featuredData = featuredRes.data.products || featuredRes.data.data?.products || [];
        const newArrivalsData = newArrivalsRes.data.products || newArrivalsRes.data.data?.products || [];
        
        setFeaturedProducts(featuredData);
        setNewArrivals(newArrivalsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false); 
      }
    };
    
    // Fetch wishlist items if user is logged in
    const fetchWishlist = async () => {
      if (user) {
        try {
          const res = await axios.get('/api/wishlist');
          const items = res.data.wishlist || [];
          setWishlistItems(items.map(item => item.product || { _id: item.productId }));
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        }
      }
    };

    fetchProducts();
    fetchWishlist();
  }, [user]);
  
  const handleAddToCart = (product) => {
    addToCart(product, 1, '', '', user);
  };
  
  const handleAddToWishlist = async (product) => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login?redirect=/');
      return;
    }
    
    try {
      await axios.post('/api/wishlist', { productId: product._id });
      setWishlistItems(prev => [...prev, product]);
    } catch (error) {
      console.error('Add to wishlist failed:', error);
    }
  };
  
  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axios.delete(`/api/wishlist/${productId}`);
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
    } catch (error) {
      console.error('Remove from wishlist failed:', error);
    }
  };

  return (
    <Box>
      <Hero />
      
      <Container maxWidth="lg">
        <Box sx={{ py: 6 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
            Featured Products
          </Typography>
          
          <ProductGrid 
            products={featuredProducts} 
            loading={loading} 
            error={error}
            wishlistItems={wishlistItems}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onRemoveFromWishlist={handleRemoveFromWishlist}
          />
          
          <Divider sx={{ my: 6 }} />
          
          <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
            New Arrivals
          </Typography>
          
          <ProductGrid 
            products={newArrivals} 
            loading={loading} 
            error={error}
            wishlistItems={wishlistItems}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onRemoveFromWishlist={handleRemoveFromWishlist}
          />
        </Box>
      </Container>
    </Box>
  );
}
