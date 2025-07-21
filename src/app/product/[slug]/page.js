'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Alert,
  Breadcrumbs,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  LocalShipping,
  Security,
  Refresh,
  NavigateNext,
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
      await axios.post('/api/wishlist', { productId: product._id });
      setWishlistItems(prev => [...prev, product]);
      toast.success('Added to wishlist');
    } catch (error) {
      console.error('Add to wishlist failed:', error);
      toast.error('Failed to add to wishlist');
    }
  };
  
  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axios.delete(`/api/wishlist/${productId}`);
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Remove from wishlist failed:', error);
      toast.error('Failed to remove from wishlist');
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
          const res = await axios.get('/api/wishlist');
          const items = res.data.wishlist || [];
          setWishlistItems(items.map(item => item.product || { _id: item.productId }));
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        }
      }
    };
    
    fetchWishlist();
  }, [user]);
  
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
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
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
        <Link href={`/category/${product.category}`} passHref>
          <Typography color="inherit" sx={{ '&:hover': { textDecoration: 'underline' } }}>
            {product.category}
          </Typography>
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>
      
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ position: 'relative', height: 500, overflow: 'hidden' }}>
            {product.discount > 0 && (
              <Chip 
                label={`${product.discount}% OFF`} 
                color="error" 
                sx={{ 
                  position: 'absolute', 
                  top: 16, 
                  left: 16, 
                  zIndex: 1,
                  fontWeight: 'bold',
                }}
              />
            )}
            <Image 
              src={product.image || (product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png')} 
              alt={product.name}
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 600px) 100vw, 600px"
              priority
            />
          </Paper>
        </Grid>
        
        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating} precision={0.5} readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({product.numReviews} reviews)
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
            <Typography variant="h5" component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              ${discountedPrice.toFixed(2)}
            </Typography>
            {product.discount > 0 && (
              <Typography 
                variant="h6" 
                component="span" 
                sx={{ ml: 2, textDecoration: 'line-through', color: 'text.secondary' }}
              >
                ${product.price.toFixed(2)}
              </Typography>
            )}
          </Box>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            {product.description}
          </Typography>
          
          <Divider sx={{ mb: 3 }} />
          
          {/* Product Options */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="color-select-label">Color</InputLabel>
                  <Select
                    labelId="color-select-label"
                    value={selectedColor}
                    label="Color"
                    onChange={(e) => setSelectedColor(e.target.value)}
                  >
                    {product.colors.map((color) => (
                      <MenuItem key={color} value={color}>
                        {color}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            
            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="size-select-label">Size</InputLabel>
                  <Select
                    labelId="size-select-label"
                    value={selectedSize}
                    label="Size"
                    onChange={(e) => setSelectedSize(e.target.value)}
                  >
                    {product.sizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            
            {/* Quantity */}
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                InputProps={{ inputProps: { min: 1, max: product.countInStock } }}
                fullWidth
              />
            </Grid>
          </Grid>
          
          {/* Add to Cart Button */}
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            fullWidth
            sx={{ 
              mb: 2, 
              py: 1.5,
              bgcolor: '#8D6E63',
              '&:hover': { bgcolor: '#6D4C41' },
            }}
          >
            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
          
          {/* Wishlist Button */}
          <Button
            variant="outlined"
            size="large"
            startIcon={<Favorite />}
            fullWidth
            sx={{ mb: 3, py: 1.5 }}
          >
            Add to Wishlist
          </Button>
          
          {/* Product Meta */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>SKU:</strong> {product._id}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Category:</strong> {product.category}
            </Typography>
            {product.subcategory && (
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Subcategory:</strong> {product.subcategory}
              </Typography>
            )}
            {product.brand && (
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Brand:</strong> {product.brand}
              </Typography>
            )}
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Availability:</strong> {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
            </Typography>
          </Box>
          
          {/* Shipping Info */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <Chip icon={<LocalShipping />} label="Free Shipping" variant="outlined" />
            <Chip icon={<Security />} label="Secure Payment" variant="outlined" />
            <Chip icon={<Refresh />} label="30-Day Returns" variant="outlined" />
          </Box>
        </Grid>
      </Grid>
      
      {/* Product Tabs */}
      <Paper sx={{ mt: 6 }}>
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
              {product.fabric && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Fabric</Typography>
                  <Typography variant="body2">{product.fabric}</Typography>
                </Grid>
              )}
              {product.occasion && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Occasion</Typography>
                  <Typography variant="body2">{product.occasion}</Typography>
                </Grid>
              )}
              {product.style && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Style</Typography>
                  <Typography variant="body2">{product.style}</Typography>
                </Grid>
              )}
              {/* Add more product attributes as needed */}
            </Grid>
          )}
          
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Customer Reviews
              </Typography>
              
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