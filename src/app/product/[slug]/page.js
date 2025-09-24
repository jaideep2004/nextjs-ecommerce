'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import ProductGrid from '@/components/products/ProductGrid';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Chip,
  Rating,
  Divider,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  LocalShipping,
  Security,
  Refresh,
  Add as AddIcon,
  Remove as RemoveIcon,
  Share as ShareIcon,
} from '@mui/icons-material';

export default function ProductPage() {
  const params = useParams();
  const { slug } = params;
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [activeImage, setActiveImage] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/products/slug/${slug}`);
      
      const productData = res.data.data;
      setProduct(productData);
      
      // Set default color and size if available
      if (productData.colors && productData.colors.length > 0) {
        setSelectedColor(productData.colors[0]);
      }
      
      if (productData.sizes && productData.sizes.length > 0) {
        setSelectedSize(productData.sizes[0]);
      }

      // Set gallery active image
      const imgs = [
        productData.image,
        ...(Array.isArray(productData.images) ? productData.images : []),
      ].filter(Boolean);
      setActiveImage(imgs[0] || '/images/placeholder.png');
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [slug]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const { user } = useAuth();
  const router = useRouter();
  
  const handleAddToCart = () => {
    if (product) {
      // Check if the product has colors but none is selected
      if (product.colors?.length > 0 && !selectedColor) {
        toast.error('Please select a color');
        return;
      }
      
      // Check if the product has sizes but none is selected
      if (product.sizes?.length > 0 && !selectedSize) {
        toast.error('Please select a size');
        return;
      }
      
      const success = addToCart(
        product,
        quantity,
        selectedColor,
        selectedSize,
        user
      );
      
      if (success) {
        // Optional: Show a success message or navigate to cart
        // router.push('/cart');
      }
    }
  };
  
  const handleAddToWishlist = async (product) => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push(`/login?redirect=/product/${slug}`);
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
      toast.success('Added to wishlist');
    } catch (error) {
      console.error('Add to wishlist failed:', error);
      toast.error('Failed to add to wishlist');
      if (error.response?.status === 401) {
        router.push(`/login?redirect=/product/${slug}`);
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
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Remove from wishlist failed:', error);
      toast.error('Failed to remove from wishlist');
      if (error.response?.status === 401) {
        router.push(`/login?redirect=/product/${slug}`);
      }
    }
  };

  // Fetch product data
  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug, fetchProduct]);
  
  // Fetch related products when product category is available
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (product?.category) {
        try {
          const res = await axios.get(`/api/products?category=${product.category}&limit=4&exclude=${product._id}`);
          console.log('Related products response:', res.data);
          
          // Handle different response structures
          const productsData = res.data.products || res.data.data?.products || [];
          setRelatedProducts(productsData.filter(p => p._id !== product._id).slice(0, 4));
        } catch (err) {
          console.error('Error fetching related products:', err);
        }
      }
    };
    
    fetchRelatedProducts();
  }, [product]);
  
  // Fetch wishlist items if user is logged in
  useEffect(() => {
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
          if (error.response?.status === 401) {
            router.push(`/login?redirect=/product/${slug}`);
          }
        }
      }
    };
    
    fetchWishlist();
  }, [user, router, slug]);
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#8D6E63' }} />
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }
  
  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="info">Product not found</Alert>
      </Container>
    );
  }
  
  // Calculate discounted price
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  // Build gallery images
  const galleryImages = [
    product.image,
    ...(Array.isArray(product.images) ? product.images : []),
  ].filter(Boolean);

  const isInWishlist = wishlistItems.some((w) => w._id === product._id);
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={8} sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
        {/* Product Gallery */}
        <Grid item xs={12} md={6} sx={{ minWidth: { xs: 'auto', md: '450px' }, width: '100%', flex:{xs:'none', md:'1'} }}>
          <Paper elevation={2} sx={{ position: 'relative', height: { xs: 360, md: 520 }, overflow: 'hidden', borderRadius: 2 }}>
            {product.discount > 0 && (
              <Chip 
                label={`${product.discount}% OFF`} 
                color="error" 
                sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1, fontWeight: 'bold' }}
              />
            )}
            <Box
              sx={{ position: 'absolute', inset: 0 }}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setZoomOrigin({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) });
              }}
            >
              <Image 
                src={activeImage || galleryImages[0] || '/images/placeholder.png'} 
                alt={product.name}
                fill
                style={{ 
                  objectFit: 'cover',
                  transform: isZoomed ? 'scale(2)' : 'scale(1)',
                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                  transition: 'transform 120ms ease-out',
                  willChange: 'transform',
                  cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                }}
                sizes="(max-width: 600px) 100vw, 600px"
                priority
              />
            </Box>
          </Paper>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
      <Stack direction="row" spacing={1.5} sx={{ mt: 1.5, overflowX: 'auto', pb: 1 }}>
              {galleryImages.map((img) => (
                <Box
                  key={img}
                  onClick={() => setActiveImage(img)}
                  sx={{
                    position: 'relative',
        width: { xs: 64, md: 88 },
        height: { xs: 64, md: 88 },
                    flex: '0 0 auto',
                    borderRadius: 2,
                    border: (theme) => `2px solid ${activeImage === img ? theme.palette.primary.main : 'transparent'}`,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    boxShadow: activeImage === img ? 3 : 0,
                  }}
                >
                  <Image src={img} alt={`${product.name} thumb`} fill style={{ objectFit: 'cover' }} />
                </Box>
              ))}
            </Stack>
          )}
        </Grid>
        
        {/* Product Details */}
        <Grid item xs={12} md={6}  sx={{flex:{xs:'none', md:'1'}}}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating} precision={0.5} readOnly />
            <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
              ({product.numReviews} reviews)
            </Typography>
          </Box>

          {/* Price */}
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 2 }}>
            <Typography variant="h4" component="span" sx={{ fontWeight: 800, color: 'primary.main' }}>
              ${discountedPrice.toFixed(2)}
            </Typography>
            {product.discount > 0 && (
              <Typography variant="h6" component="span" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                ${product.price.toFixed(2)}
              </Typography>
            )}
          </Box>

          {/* Blurb */}
          <Typography variant="body1" sx={{ mb: 3 }}>
            {product.description}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Product Options (swatches, chips, quantity) */}
          <Stack spacing={2.5} sx={{ mb: 3 }}>
            {product.colors?.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Color</Typography>
                <Stack direction="row" spacing={1.25}>
                  {product.colors.map((c) => (
                    <Tooltip key={c} title={c} arrow>
                      <IconButton
                        onClick={() => setSelectedColor(c)}
                        size="small"
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          border: (theme) => `2px solid ${selectedColor === c ? theme.palette.primary.main : theme.palette.divider}`,
                          bgcolor: '#fff',
                          p: 0.2,
                        }}
                        aria-label={`select color ${c}`}
                      >
                        <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: c }} />
                      </IconButton>
                    </Tooltip>
                  ))}
                </Stack>
              </Box>
            )}

            {product.sizes?.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Size</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {product.sizes.map((s) => (
                    <Chip
                      key={s}
                      label={s}
                      clickable
                      color={selectedSize === s ? 'primary' : 'default'}
                      variant={selectedSize === s ? 'filled' : 'outlined'}
                      onClick={() => setSelectedSize(s)}
                      sx={{ borderRadius: 1 }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Quantity</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton size="small" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="decrease">
                  <RemoveIcon />
                </IconButton>
                <Box sx={{ px: 2, py: 0.75, border: 1, borderColor: 'divider', borderRadius: 1, minWidth: 44, textAlign: 'center' }}>{quantity}</Box>
                <IconButton size="small" onClick={() => setQuantity((q) => Math.min(q + 1, product.countInStock || q + 1))} aria-label="increase">
                  <AddIcon />
                </IconButton>
              </Stack>
            </Box>
          </Stack>

          {/* CTA Row */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              sx={{
                flex: 1,
                py: 1.25,
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: 2,
                '&:hover': { filter: 'brightness(0.95)' },
              }}
            >
              {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={isInWishlist ? <Favorite /> : <FavoriteBorder />}
              onClick={() => (isInWishlist ? handleRemoveFromWishlist(product._id) : handleAddToWishlist(product))}
              sx={{ flexShrink: 0, py: 1.25 }}
            >
              {isInWishlist ? 'Wishlisted' : 'Add to Wishlist'}
            </Button>
            <IconButton aria-label="share" sx={{ border: 1, borderColor: 'divider', borderRadius: 1.5 }}>
              <ShareIcon />
            </IconButton>
          </Stack>

          {/* Product Meta */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>SKU:</strong> {product._id}
            </Typography>
            {product.brand && (
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Brand:</strong> {product.brand}
              </Typography>
            )}
            {product.category && (
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Category:</strong> {String(product.category.name || product.category)}
              </Typography>
            )}
          </Box>

          {/* Perks */}
          <Stack direction="row" spacing={1.5} sx={{ mt: 1 }} flexWrap="wrap">
            <Chip icon={<LocalShipping />} label="Free Shipping" variant="outlined" />
            <Chip icon={<Security />} label="Secure Payment" variant="outlined" />
            <Chip icon={<Refresh />} label="30-Day Returns" variant="outlined" />
          </Stack>
        </Grid>
      </Grid>

      {/* Product Tabs */}
      <Paper sx={{ mt: 6, borderRadius: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          centered
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': { py: 2 },
            '& .Mui-selected': { color: '#8D6E63' },
            '& .MuiTabs-indicator': { backgroundColor: '#8D6E63' },
          }}
        >
          <Tab label="Description" />
          <Tab label="Additional Information" />
          <Tab label={`Reviews (${product.numReviews})`} />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Typography variant="body1">
              {product.description}
            </Typography>
          )}
          
          {tabValue === 1 && (
            <Grid container spacing={2}>
              {[{ label: 'Fabric', value: product.fabric },
                { label: 'Occasion', value: product.occasion },
                { label: 'Style', value: product.style },
                { label: 'Brand', value: product.brand },
                { label: 'Category', value: product.category?.name || product.category },
              ].filter((row) => row.value).map((row) => (
                <Grid key={row.label} item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{row.label}</Typography>
                    <Typography variant="body2" color="text.secondary">{row.value}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
          
          {tabValue === 2 && (
            <Box>
              {product.numReviews > 0 ? (
                <Typography variant="body2">
                  Reviews will be displayed here. This would typically fetch reviews from the API.
                </Typography>
              ) : (
                <Typography variant="body2">
                  No reviews yet. Be the first to review this product.
                </Typography>
              )}
              <Button 
                variant="contained" 
                sx={{ 
                  mt: 2,
                  bgcolor: '#8D6E63',
                  '&:hover': { bgcolor: '#6D4C41' },
                }}
              >
                Write a Review
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
            Related Products
          </Typography>
          
          <ProductGrid 
            products={relatedProducts}
            wishlistItems={wishlistItems}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onRemoveFromWishlist={handleRemoveFromWishlist}
            gridProps={{ spacing: 3 }}
          />
        </Box>
      )}
    </Container>
  );
}