'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Box,
  Rating,
  Chip,
  Tooltip,
  Skeleton,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Visibility,
  AddShoppingCart,
} from '@mui/icons-material';
import { useThemeContext } from '@/theme';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
  '&:hover .MuiCardActions-root': {
    opacity: 1,
    transform: 'translateY(0)',
  },
  '&:hover .quick-actions': {
    opacity: 1,
    transform: 'translateX(0)',
  },
}));

const ProductImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: '100%', // 1:1 aspect ratio
  backgroundColor: theme.palette.mode === 'light' ? '#F5F5F5' : '#333333',
  overflow: 'hidden',
}));

const DiscountBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  left: 0,
  background: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  padding: '4px 12px',
  fontWeight: 'bold',
  zIndex: 2,
  borderTopRightRadius: theme.shape.borderRadius,
  borderBottomRightRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}));

const NewBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 50,
  left: 0,
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: '4px 12px',
  fontWeight: 'bold',
  zIndex: 2,
  borderTopRightRadius: theme.shape.borderRadius,
  borderBottomRightRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}));

const QuickActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  opacity: 0,
  transform: 'translateX(20px)',
  transition: 'all 0.3s ease',
  zIndex: 3,
  '& .MuiIconButton-root': {
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.1)',
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
}));

const StyledCardActions = styled(CardActions)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
  padding: theme.spacing(1.5),
  opacity: 0,
  transform: 'translateY(20px)',
  transition: 'all 0.3s ease',
  display: 'flex',
  justifyContent: 'center',
  zIndex: 2,
}));

const StyledAddToCartButton = styled(Button)(({ theme }) => ({
  borderRadius: 50,
  fontWeight: 'bold',
  padding: theme.spacing(1, 3),
  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
  },
  textTransform: 'none',
}));

export default function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  inWishlist = false,
  showActions = true,
  elevation = 1,
  sx = {},
}) {
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const { mode } = useThemeContext();

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (onAddToCart) onAddToCart(product);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (inWishlist && onRemoveFromWishlist) {
      onRemoveFromWishlist(product._id);
    } else if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <StyledCard 
      elevation={elevation} 
      sx={sx}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
        <ProductImageContainer>
          {loading && (
            <Skeleton 
              variant="rectangular" 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
              }} 
            />
          )}
          <Image
            src={product.image || (product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png')}
            alt={product.name}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
            style={{ 
              objectFit: 'cover',
              opacity: loading ? 0 : 1,
              transition: 'opacity 0.3s ease-in-out',
            }}
            onLoad={handleImageLoad}
          />
          
          {product.discount > 0 && (
            <DiscountBadge>
              {product.discount}% OFF
            </DiscountBadge>
          )}
          
          {product.isNew && (
            <NewBadge>
              NEW
            </NewBadge>
          )}
          
          {showActions && (
            <>
              <QuickActions className="quick-actions">
                <Tooltip title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}>
                  <IconButton 
                    onClick={handleWishlistToggle} 
                    size="small"
                    color={inWishlist ? "error" : "default"}
                    aria-label={inWishlist ? "remove from wishlist" : "add to wishlist"}
                  >
                    {inWishlist ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Quick view">
                  <IconButton 
                    component={Link} 
                    href={`/product/${product.slug}`} 
                    size="small"
                    aria-label="quick view"
                  >
                    <Visibility />
                  </IconButton>
                </Tooltip>
              </QuickActions>
              
              <StyledCardActions className="MuiCardActions-root">
                <StyledAddToCartButton
                  variant="contained"
                  size="small"
                  startIcon={<AddShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                  color="secondary"
                >
                  Add to Cart
                </StyledAddToCartButton>
              </StyledCardActions>
            </>
          )}
        </ProductImageContainer>

        <CardContent sx={{ flexGrow: 1, pt: 2 }}>
          <Typography variant="subtitle1" component="h2" fontWeight="medium" gutterBottom noWrap>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={product.rating || 0} precision={0.5} size="small" readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5, fontSize: '0.75rem' }}>
              ({product.numReviews || 0})
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {product.discount > 0 ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h6" component="span" color="error.main" fontWeight="bold">
                  {formatPrice(product.price * (1 - product.discount / 100))}
                </Typography>
                <Typography 
                  variant="body2" 
                  component="span" 
                  color="text.secondary" 
                  sx={{ textDecoration: 'line-through' }}
                >
                  {formatPrice(product.price)}
                </Typography>
              </Stack>
            ) : (
              <Typography variant="h6" component="span" fontWeight="bold">
                {formatPrice(product.price)}
              </Typography>
            )}
          </Box>
          
          {product.countInStock === 0 && (
            <Chip 
              label="Out of Stock" 
              color="error" 
              size="small" 
              sx={{ mt: 1 }}
              variant="outlined"
            />
          )}
        </CardContent>
      </Link>
    </StyledCard>
  );
}