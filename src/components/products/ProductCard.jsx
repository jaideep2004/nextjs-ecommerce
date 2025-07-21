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
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Visibility,
} from '@mui/icons-material';

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
    <Card 
      elevation={elevation} 
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        transform: isHovered ? 'translateY(-4px)' : 'none',
        ...sx
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
        <Box sx={{ position: 'relative', paddingTop: '100%' }}>
          {loading && (
            <Skeleton 
              variant="rectangular" 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
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
            <Chip
              label={`${product.discount}% OFF`}
              color="error"
              size="small"
              sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                fontWeight: 'bold',
              }}
            />
          )}
          {product.isNew && (
            <Chip
              label="NEW"
              color="primary"
              size="small"
              sx={{
                position: 'absolute',
                top: product.discount > 0 ? 45 : 10,
                left: 10,
                fontWeight: 'bold',
              }}
            />
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, pt: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom noWrap>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={product.rating || 0} precision={0.5} size="small" readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              ({product.numReviews || 0})
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {product.discount > 0 ? (
              <>
                <Typography variant="h6" component="span" color="error.main">
                  {formatPrice(product.price * (1 - product.discount / 100))}
                </Typography>
                <Typography 
                  variant="body2" 
                  component="span" 
                  color="text.secondary" 
                  sx={{ ml: 1, textDecoration: 'line-through' }}
                >
                  {formatPrice(product.price)}
                </Typography>
              </>
            ) : (
              <Typography variant="h6" component="span">
                {formatPrice(product.price)}
              </Typography>
            )}
          </Box>
          
          {product.countInStock === 0 && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Out of Stock
            </Typography>
          )}
        </CardContent>
      </Link>

      {showActions && (
        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
          >
            Add to Cart
          </Button>
          
          <Box>
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
          </Box>
        </CardActions>
      )}
    </Card>
  );
}