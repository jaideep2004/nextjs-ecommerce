'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Breadcrumbs,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Rating,
  Divider,
} from '@mui/material';
import {
  NavigateNext,
  ArrowBack,
  Delete,
  ShoppingCart,
  Favorite,
} from '@mui/icons-material';

export default function Wishlist() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  
  // Redirect if user is not logged in
  useEffect(() => {
    if (!authLoading && !user && typeof window !== 'undefined') {
      router.push('/login?redirect=/customer/wishlist');
    }
  }, [user, authLoading, router]);
  
  // Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data } = await axios.get('/api/wishlist');
        setWishlist(data.wishlist || []);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError(err.response?.data?.message || 'Failed to load wishlist');
        // Set empty wishlist to prevent undefined errors
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWishlist();
  }, [user]);
  
  // Remove from wishlist
  const handleRemoveFromWishlist = async (productId) => {
    try {
      setActionLoading(prev => ({ ...prev, [productId]: true }));
      
      await axios.delete(`/api/wishlist/${productId}`);
      
      // Update local state
      setWishlist(wishlist.filter(item => item._id !== productId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      // Show error toast or message
    } finally {
      setActionLoading(prev => ({ ...prev, [productId]: false }));
    }
  };
  
  // Add to cart
  const handleAddToCart = async (product) => {
    try {
      setActionLoading(prev => ({ ...prev, [`cart-${product._id}`]: true }));
      
      // Add to cart using context
      await addToCart({
        _id: product._id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        quantity: 1,
      });
      
      // Optionally remove from wishlist after adding to cart
      // await handleRemoveFromWishlist(product._id);
    } catch (err) {
      console.error('Error adding to cart:', err);
      // Show error toast or message
    } finally {
      setActionLoading(prev => ({ ...prev, [`cart-${product._id}`]: false }));
    }
  };
  
  if (authLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#8D6E63' }} />
      </Container>
    );
  }
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
        <Link href="/customer/dashboard" passHref>
          <Typography color="inherit" sx={{ '&:hover': { textDecoration: 'underline' } }}>
            My Account
          </Typography>
        </Link>
        <Typography color="text.primary">Wishlist</Typography>
      </Breadcrumbs>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button 
          component={Link} 
          href="/customer/dashboard"
          startIcon={<ArrowBack />}
          sx={{ mr: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          My Wishlist
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#8D6E63' }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : wishlist.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Favorite sx={{ fontSize: 60, color: '#D1C4E9', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Your wishlist is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Add items to your wishlist to save them for later.
            </Typography>
            <Button 
              component={Link} 
              href="/products" 
              variant="contained"
              sx={{ 
                bgcolor: '#8D6E63',
                '&:hover': { bgcolor: '#6D4C41' },
              }}
            >
              Explore Products
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {wishlist.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <Link href={`/product/${product.slug}`} passHref>
                    <Box sx={{ position: 'relative', paddingTop: '100%' }}>
                      <CardMedia
                        component="img"
                        image={product.image || '/images/placeholder.png'}
                        alt={product.name}
                        sx={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  </Link>
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Link href={`/product/${product.slug}`} passHref>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        sx={{ 
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          color: 'text.primary',
                          '&:hover': { color: '#8D6E63' },
                        }}
                      >
                        {product.name}
                      </Typography>
                    </Link>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={product.rating} precision={0.5} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.numReviews})
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                        ${product.price.toFixed(2)}
                      </Typography>
                      
                      {product.oldPrice && product.oldPrice > product.price && (
                        <Typography 
                          variant="body2" 
                          component="span" 
                          sx={{ 
                            textDecoration: 'line-through', 
                            color: 'text.secondary',
                            ml: 1,
                          }}
                        >
                          ${product.oldPrice.toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                  
                  <Divider />
                  
                  <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={() => handleAddToCart(product)}
                      disabled={actionLoading[`cart-${product._id}`] || product.countInStock === 0}
                      sx={{ 
                        bgcolor: '#8D6E63',
                        '&:hover': { bgcolor: '#6D4C41' },
                        flexGrow: 1,
                        mr: 1,
                      }}
                    >
                      {actionLoading[`cart-${product._id}`] ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                      ) : product.countInStock === 0 ? (
                        'Out of Stock'
                      ) : (
                        'Add to Cart'
                      )}
                    </Button>
                    
                    <IconButton 
                      color="error" 
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      disabled={actionLoading[product._id]}
                    >
                      {actionLoading[product._id] ? (
                        <CircularProgress size={24} sx={{ color: '#f44336' }} />
                      ) : (
                        <Delete />
                      )}
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
}