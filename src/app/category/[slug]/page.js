'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Rating,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { 
  NavigateNext, 
  ShoppingCart, 
  Favorite, 
  FavoriteBorder,
  Visibility,
  LocalOffer,
  Star
} from '@mui/icons-material';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulseGlow = keyframes`
  0%, 100% { 
    transform: scale(1);
    filter: brightness(1);
  }
  50% { 
    transform: scale(1.05);
    filter: brightness(1.2);
  }
`;

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: `${fadeIn} 0.6s ease forwards`,
  background: theme.palette.mode === 'light' 
    ? 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)'
    : 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)',
  boxShadow: theme.palette.mode === 'light'
    ? '0 8px 32px rgba(0, 0, 0, 0.1)'
    : '0 8px 32px rgba(0, 0, 0, 0.3)',
  '&:hover': {
    transform: 'translateY(-12px) scale(1.02)',
    boxShadow: theme.palette.mode === 'light'
      ? '0 20px 40px rgba(0, 0, 0, 0.15)'
      : '0 20px 40px rgba(0, 0, 0, 0.4)',
    '& .product-image': {
      transform: 'scale(1.1)',
    },
    '& .product-actions': {
      opacity: 1,
      transform: 'translateY(0)',
    },
    '& .discount-badge': {
      animation: `${pulseGlow} 1s ease-in-out infinite`,
    }
  }
}));

const CategoryHero = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: { xs: '50vh', md: '60vh' },
  minHeight: { xs: '350px', md: '400px' },
  display: 'flex',
  alignItems: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1,
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  marginBottom: theme.spacing(8),
  background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 30% 30%, rgba(162, 146, 120, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(212, 192, 158, 0.1) 0%, transparent 50%)
    `,
    zIndex: 1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)',
    zIndex: 2,
  }
}));

const ShimmerText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.primary.main} 100%)`,
  backgroundSize: '200% 100%',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${shimmer} 3s linear infinite`,
  display: 'inline-block',
}));

export default function CategoryPage() {
  const params = useParams();
  const { slug } = params;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });
  
  // Format the category name for display
  const formatCategoryName = (slug) => {
    if (!slug) return '';
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
    });
    
    if (!slug) return;
    
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        
        // First, find the category by slug to get its ObjectId
        const categoryRes = await axios.get('/api/categories');
        const categories = categoryRes.data.data?.categories || [];
        const foundCategory = categories.find(cat => 
          cat.slug === slug || 
          cat.name.toLowerCase().replace(/\s+/g, '-') === slug
        );
        
        if (!foundCategory) {
          setError('Category not found');
          setLoading(false);
          return;
        }
        
        setCategory(foundCategory);
        
        // Then fetch products using the category ObjectId
        const queryParams = new URLSearchParams();
        queryParams.append('page', pagination.page);
        queryParams.append('limit', 12);
        
        const productsRes = await axios.get(`/api/products?${queryParams.toString()}`);
        const allProducts = productsRes.data.data?.products || productsRes.data.products || [];
        
        // Filter products by category ObjectId on client side
        const categoryProducts = allProducts.filter(product => {
          if (typeof product.category === 'object') {
            return product.category._id === foundCategory._id;
          }
          return product.category === foundCategory._id;
        });
        
        setProducts(categoryProducts);
        setPagination({
          page: 1,
          pages: Math.ceil(categoryProducts.length / 12),
          total: categoryProducts.length,
        });
        
      } catch (err) {
        console.error('Error fetching category/products:', err);
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch wishlist if user is logged in
    const fetchWishlist = async () => {
      if (user) {
        try {
          // Get authentication token from cookies
          const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];
          
          // Set up headers with authentication token
          const headers = {};
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
          
          const res = await axios.get('/api/wishlist', { headers });
          const items = res.data.data?.wishlist || res.data.wishlist || [];
          setWishlistItems(items.map(item => item.product || { _id: item.productId }));
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        }
      }
    };
    
    fetchCategoryAndProducts();
    fetchWishlist();
  }, [slug, user]);
  
  const handleAddToCart = (product) => {
    addToCart(product, 1, '', '', user);
  };
  
  const handleAddToWishlist = async (product) => {
    if (!user) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    try {
      // Get authentication token from cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      
      // Set up headers with authentication token
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      await axios.post('/api/wishlist', { productId: product._id }, { headers });
      setWishlistItems(prev => [...prev, product]);
    } catch (error) {
      console.error('Add to wishlist failed:', error);
      if (error.response?.status === 401) {
        router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      }
    }
  };
  
  const handleRemoveFromWishlist = async (productId) => {
    try {
      // Get authentication token from cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      
      // Set up headers with authentication token
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      await axios.delete(`/api/wishlist/${productId}`, { headers });
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
    } catch (error) {
      console.error('Remove from wishlist failed:', error);
      if (error.response?.status === 401) {
        router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      }
    }
  };
  
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };
  
  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount / 100);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#8D6E63' }} size={60} />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Container>
    );
  }
  
  return (
    <Box>
      {/* Category Hero Section */}
      <CategoryHero>
        {category?.image && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0,
            }}
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </Box>
        )}
        
        <Container maxWidth="lg" sx={{ 
          position: 'relative', 
          zIndex: 2, 
          textAlign: 'center',
          px: { xs: 2, sm: 3 },
          py: { xs: 4, md: 6 }
        }}>
          <Box data-aos="fade-up" data-aos-delay="100">
            <Typography
              variant="overline"
              sx={{
                color: '#a29278',
                letterSpacing: '3px',
                fontSize: '1rem',
                fontWeight: 600,
                mb: 2,
                display: 'block',
              }}
            >
              Premium Collection
            </Typography>
            
            <ShimmerText
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '3rem', md: '4.5rem' },
                fontWeight: 600,
                mb: 3,
                lineHeight: 1.2,
              }}
            >
              {category?.name || 'Collection'}
            </ShimmerText>
            
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.95)',
                maxWidth: '800px',
                mx: 'auto',
                mb: 4,
                lineHeight: 1.7,
                fontSize: { xs: '1rem', md: '1.25rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {category?.description || `Explore our exclusive collection of premium quality ${category?.name?.toLowerCase()}. Each piece is crafted with attention to detail and authentic designs.`}
            </Typography>
            
            <Chip
              label={`${products.length} Products Available`}
              sx={{
                background: 'rgba(162, 146, 120, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(162, 146, 120, 0.3)',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 600,
                px: 2,
                py: 1,
                animation: `${float} 3s ease-in-out infinite`,
              }}
            />
          </Box>
        </Container>
      </CategoryHero>
      
      <Container maxWidth="lg" sx={{ pb: 8, px: { xs: 2, sm: 3 } }}>
        {/* Breadcrumbs */}
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 6 }}
          data-aos="fade-right"
        >
          <Link href="/" passHref>
            <Typography color="inherit" sx={{ '&:hover': { textDecoration: 'underline' } }}>
              Home
            </Typography>
          </Link>
          <Link href="/categories" passHref>
            <Typography color="inherit" sx={{ '&:hover': { textDecoration: 'underline' } }}>
              Categories
            </Typography>
          </Link>
          <Typography color="text.primary">{category?.name}</Typography>
        </Breadcrumbs>
        
        {/* Products Grid */}
        {products.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center' }} data-aos="fade-up">
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No products found in this category
            </Typography>
            <Button 
              component={Link} 
              href="/products" 
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #8D6E63, #A1887F)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #6D4C41, #8D6E63)',
                }
              }}
            >
              Browse All Products
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {products.map((product, index) => {
              const discountedPrice = product.discount > 0 
                ? calculateDiscountedPrice(product.price, product.discount)
                : product.price;
              const isWishlisted = isInWishlist(product._id);
              
              return (
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  lg={3} 
                  key={product._id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <StyledCard sx={{ '&:hover': { transform: 'translateY(-8px)' } }}>
                    {/* Product Image */}
                    <Box sx={{ 
                      position: 'relative', 
                      paddingTop: '100%',
                      overflow: 'hidden',
                      '&:hover img': {
                        transform: 'scale(1.05)'
                      }
                    }}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        style={{ 
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease-in-out'
                        }}
                      />
                      
                      {/* Discount Badge */}
                      {product.discount > 0 && (
                        <Chip
                          label={`${product.discount}% OFF`}
                          className="discount-badge"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            zIndex: 2,
                          }}
                        />
                      )}
                      
                      {/* Wishlist Button */}
                      <IconButton
                        onClick={() => isWishlisted 
                          ? handleRemoveFromWishlist(product._id)
                          : handleAddToWishlist(product)
                        }
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          background: 'rgba(255,255,255,0.9)',
                          backdropFilter: 'blur(10px)',
                          color: isWishlisted ? '#ff6b6b' : '#666',
                          zIndex: 2,
                          '&:hover': {
                            background: 'rgba(255,255,255,1)',
                            transform: 'scale(1.1)',
                          }
                        }}
                      >
                        {isWishlisted ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                      
                      {/* Product Actions Overlay */}
                      <Box
                        className="product-actions"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                          p: 2,
                          opacity: 0,
                          transform: 'translateY(20px)',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          gap: 1,
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<ShoppingCart />}
                          onClick={() => handleAddToCart(product)}
                          sx={{
                            flex: 1,
                            background: 'linear-gradient(135deg, #8D6E63, #A1887F)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #6D4C41, #8D6E63)',
                            }
                          }}
                        >
                          Add to Cart
                        </Button>
                        
                        <IconButton
                          component={Link}
                          href={`/product/${product.slug}`}
                          sx={{
                            background: 'rgba(255,255,255,0.9)',
                            color: '#333',
                            '&:hover': {
                              background: 'white',
                            }
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    {/* Product Content */}
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography
                        variant="h6"
                        component={Link}
                        href={`/product/${product.slug}`}
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: 'text.primary',
                          textDecoration: 'none',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          '&:hover': {
                            color: 'primary.main',
                          }
                        }}
                      >
                        {product.name}
                      </Typography>
                      
                      {/* Rating */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Rating 
                          value={product.rating} 
                          readOnly 
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          ({product.numReviews})
                        </Typography>
                      </Box>
                      
                      {/* Price */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            color: 'primary.main',
                          }}
                        >
                          £{discountedPrice.toFixed(2)}
                        </Typography>
                        
                        {product.discount > 0 && (
                          <Typography
                            variant="body2"
                            sx={{
                              textDecoration: 'line-through',
                              color: 'text.secondary',
                            }}
                          >
                            £{product.price.toFixed(2)}
                          </Typography>
                        )}
                      </Box>
                      
                      {/* Stock Status */}
                      <Chip
                        label={product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                        size="small"
                        color={product.countInStock > 0 ? 'success' : 'error'}
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </StyledCard>
                </Grid>
              );
            })}
          </Grid>
        )}
        
        {/* Back to Categories */}
        <Box sx={{ textAlign: 'center', mt: 8 }} data-aos="fade-up">
          <Button
            component={Link}
            href="/categories"
            variant="outlined"
            size="large"
            sx={{
              borderRadius: '50px',
              px: 4,
              py: 1.5,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
              }
            }}
          >
            Browse All Categories
          </Button>
        </Box>
      </Container>
    </Box>
  );
}