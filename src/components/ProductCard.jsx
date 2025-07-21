'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
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
} from '@mui/material';
import { ShoppingCart, Favorite, FavoriteBorder, Visibility } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
    '& .MuiCardActions-root': {
      opacity: 1,
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
  zIndex: 1,
}));

const QuickActionButtons = styled(CardActions)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);

  const { user } = useAuth();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, '', '', user);
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // Here you would typically call an API to add/remove from wishlist
  };

  // Calculate discounted price
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <StyledCard>
      {product.discount > 0 && (
        <DiscountBadge label={`${product.discount}% OFF`} size="small" />
      )}

      <CardActionArea component={Link} href={`/product/${product.slug}`}>
        <Box sx={{ position: 'relative', paddingTop: '125%' }}>
          <CardMedia
            component={Image}
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        </Box>

        <QuickActionButtons>
          <Tooltip title="Add to cart">
            <IconButton color="primary" onClick={handleAddToCart}>
              <ShoppingCart />
            </IconButton>
          </Tooltip>
          <Tooltip title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}>
            <IconButton color="primary" onClick={toggleFavorite}>
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Quick view">
            <IconButton color="primary" component={Link} href={`/product/${product.slug}`}>
              <Visibility />
            </IconButton>
          </Tooltip>
        </QuickActionButtons>

        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
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
            <Typography variant="body2" sx={{ ml: 0.5 }}>
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

          {product.countInStock === 0 && (
            <Chip
              label="Out of Stock"
              size="small"
              sx={{ mt: 1, backgroundColor: 'grey.500', color: 'white' }}
            />
          )}
        </CardContent>
      </CardActionArea>

      <Box sx={{ p: 1, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          disabled={product.countInStock === 0}
          sx={{
            bgcolor: '#8D6E63',
            '&:hover': { bgcolor: '#6D4C41' },
            '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' },
          }}
        >
          {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </Box>
    </StyledCard>
  );
};

export default ProductCard;