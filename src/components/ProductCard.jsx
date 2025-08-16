'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  IconButton,
  Button,
  Chip,
  Tooltip,
  CardActionArea,
  CardActions,
  Badge,
} from '@mui/material';
import { ShoppingCart, Favorite, FavoriteBorder, Visibility, LocalMall } from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  borderRadius: '12px',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 30px rgba(0, 0, 0, 0.1)',
    '& .MuiCardActions-root': {
      opacity: 1,
      transform: 'translateY(0)',
    },
    '& .product-image': {
      transform: 'scale(1.08)',
    },
  },
}));

const DiscountBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  fontWeight: 'bold',
  zIndex: 2,
  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  animation: `${pulse} 2s infinite ease-in-out`,
}));

const QuickActionButtons = styled(CardActions)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(5px)',
  padding: theme.spacing(1.5),
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(1),
  opacity: 0,
  transform: 'translateY(20px)',
  transition: 'opacity 0.3s ease, transform 0.3s ease',
  zIndex: 3,
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: '125%',
  overflow: 'hidden',
  backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#333',
  '& .product-image': {
    transition: 'transform 0.5s ease',
  },
}));

const StockBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 10,
  left: 10,
  fontWeight: 'bold',
  zIndex: 2,
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'white',
  color: theme.palette.primary.main,
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    transform: 'scale(1.1)',
  },
}));

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  const { user } = useAuth();
  
  // Check if product is in wishlist on component mount
  useEffect(() => {
    if (user && product) {
      const checkWishlist = async () => {
        try {
          const res = await axios.get('/api/wishlist');
          const wishlistItems = res.data.wishlist || [];
          const isInWishlist = wishlistItems.some(item => 
            item.product?._id === product._id || item.productId === product._id
          );
          setIsFavorite(isInWishlist);
        } catch (error) {
          console.error('Error checking wishlist status:', error);
        }
      };
      
      checkWishlist();
    }
  }, [user, product]);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, '', '', user);
  };

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login?redirect=/products');
      return;
    }
    
    try {
      if (isFavorite) {
        // Remove from wishlist
        await axios.delete(`/api/wishlist/${product._id}`);
      } else {
        // Add to wishlist
        await axios.post('/api/wishlist', { productId: product._id });
      }
      
      // Toggle state after successful API call
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Wishlist operation failed:', error);
    }
  };

  // Calculate discounted price
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <StyledCard>
      <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
        <ImageWrapper>
          <CardMedia
            component={Image}
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="product-image"
          />
          
          {product.discount > 0 && (
            <DiscountBadge label={`${product.discount}% OFF`} size="small" />
          )}
          
          {product.countInStock === 0 && (
            <StockBadge 
              label="Out of Stock" 
              color="error" 
              size="small" 
              variant="filled"
            />
          )}
        </ImageWrapper>

        <QuickActionButtons>
          <Tooltip title="Add to cart" arrow>
            <ActionButton 
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
            >
              <ShoppingCart />
            </ActionButton>
          </Tooltip>
          
          <Tooltip title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'} arrow>
            <ActionButton onClick={toggleFavorite}>
              {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </ActionButton>
          </Tooltip>
          
          <Tooltip title="Quick view" arrow>
            <ActionButton component={Link} href={`/product/${product.slug}`}>
              <Visibility />
            </ActionButton>
          </Tooltip>
        </QuickActionButtons>
      </Link>

      <CardContent sx={{ flexGrow: 1, pb: 1, pt: 2 }}>
        <Typography
          variant="subtitle1"
          component="h2"
          sx={{
            fontWeight: 'bold',
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            height: '3em',
          }}
        >
          {product.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Rating value={product.rating} precision={0.5} size="small" readOnly />
          <Typography variant="body2" sx={{ ml: 0.5, color: 'text.secondary' }}>
            ({product.numReviews})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h6"
            component="span"
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            ${discountedPrice.toFixed(2)}
          </Typography>
          {product.discount > 0 && (
            <Typography
              variant="body2"
              component="span"
              sx={{ ml: 1, textDecoration: 'line-through', color: 'text.secondary' }}
            >
              ${product.price.toFixed(2)}
            </Typography>
          )}
        </Box>
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<LocalMall />}
          onClick={handleAddToCart}
          disabled={product.countInStock === 0}
          sx={{
            borderRadius: '50px',
            py: 1,
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
            boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 6px 15px rgba(99, 102, 241, 0.4)',
              transform: 'translateY(-2px)',
            },
            '&.Mui-disabled': {
              bgcolor: 'action.disabledBackground',
              color: 'action.disabled',
            },
          }}
        >
          {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </Box>
    </StyledCard>
  );
};

export default ProductCard;