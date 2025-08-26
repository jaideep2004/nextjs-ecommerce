'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { styled, keyframes } from '@mui/material/styles';
import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Visibility,
  AddShoppingCart,
} from '@mui/icons-material';
import { useThemeContext } from '@/theme';

// 4th Dimensional Keyframes
const hyperdimensionalFloat = keyframes`
  0% { 
    transform: perspective(2000px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px) scale3d(1, 1, 1);
    filter: brightness(1) saturate(1) hue-rotate(0deg);
    box-shadow: 
      0 12px 35px rgba(0, 0, 0, 0.12),
      0 0 40px rgba(162, 146, 120, 0.15),
      inset 0 2px 0 rgba(255, 255, 255, 0.1);
  }
  25% { 
    transform: perspective(2000px) rotateX(5deg) rotateY(8deg) rotateZ(2deg) translateZ(30px) scale3d(1.03, 1.03, 1.1);
    filter: brightness(1.08) saturate(1.2) hue-rotate(5deg);
    box-shadow: 
      0 25px 60px rgba(0, 0, 0, 0.18),
      0 0 70px rgba(162, 146, 120, 0.3),
      0 0 100px rgba(255, 215, 0, 0.15),
      inset 0 2px 0 rgba(255, 255, 255, 0.2);
  }
  50% { 
    transform: perspective(2000px) rotateX(-3deg) rotateY(12deg) rotateZ(-1deg) translateZ(45px) scale3d(1.05, 1.05, 1.15);
    filter: brightness(1.12) saturate(1.3) hue-rotate(8deg);
    box-shadow: 
      0 35px 80px rgba(0, 0, 0, 0.22),
      0 0 90px rgba(212, 192, 158, 0.4),
      0 0 140px rgba(255, 215, 0, 0.2),
      inset 0 2px 0 rgba(255, 255, 255, 0.25);
  }
  75% { 
    transform: perspective(2000px) rotateX(7deg) rotateY(-5deg) rotateZ(3deg) translateZ(25px) scale3d(1.02, 1.02, 1.08);
    filter: brightness(1.06) saturate(1.15) hue-rotate(3deg);
    box-shadow: 
      0 20px 50px rgba(0, 0, 0, 0.16),
      0 0 60px rgba(162, 146, 120, 0.25),
      0 0 90px rgba(255, 215, 0, 0.12),
      inset 0 2px 0 rgba(255, 255, 255, 0.15);
  }
  100% { 
    transform: perspective(2000px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px) scale3d(1, 1, 1);
    filter: brightness(1) saturate(1) hue-rotate(0deg);
    box-shadow: 
      0 12px 35px rgba(0, 0, 0, 0.12),
      0 0 40px rgba(162, 146, 120, 0.15),
      inset 0 2px 0 rgba(255, 255, 255, 0.1);
  }
`;

const quantumGlow = keyframes`
  0%, 100% { 
    box-shadow: 
      0 0 40px rgba(162, 146, 120, 0.3),
      0 0 80px rgba(212, 192, 158, 0.2),
      0 0 120px rgba(255, 215, 0, 0.1),
      0 15px 45px rgba(0, 0, 0, 0.15);
    filter: drop-shadow(0 0 30px rgba(162, 146, 120, 0.4));
  }
  33% { 
    box-shadow: 
      0 0 60px rgba(162, 146, 120, 0.5),
      0 0 120px rgba(212, 192, 158, 0.35),
      0 0 180px rgba(255, 215, 0, 0.2),
      0 25px 70px rgba(0, 0, 0, 0.2);
    filter: drop-shadow(0 0 50px rgba(212, 192, 158, 0.6));
  }
  66% { 
    box-shadow: 
      0 0 80px rgba(162, 146, 120, 0.6),
      0 0 160px rgba(212, 192, 158, 0.45),
      0 0 240px rgba(255, 215, 0, 0.25),
      0 35px 90px rgba(0, 0, 0, 0.25);
    filter: drop-shadow(0 0 70px rgba(255, 215, 0, 0.5));
  }
`;

const cosmicRipple = keyframes`
  0% {
    transform: scale(0.9) rotate(0deg);
    opacity: 0;
    border-radius: 50%;
  }
  25% {
    transform: scale(1.1) rotate(90deg);
    opacity: 0.4;
    border-radius: 40%;
  }
  50% {
    transform: scale(1.3) rotate(180deg);
    opacity: 0.7;
    border-radius: 30%;
  }
  75% {
    transform: scale(1.6) rotate(270deg);
    opacity: 0.4;
    border-radius: 25%;
  }
  100% {
    transform: scale(2.2) rotate(360deg);
    opacity: 0;
    border-radius: 20%;
  }
`;

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  minWidth: '260px',
  maxWidth: '300px',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '20px',
  transformStyle: 'preserve-3d',
  background: theme.palette.mode === 'light' 
    ? `linear-gradient(145deg, 
        rgba(255, 255, 255, 0.98) 0%, 
        rgba(250, 250, 250, 0.95) 25%,
        rgba(245, 245, 245, 0.92) 50%,
        rgba(250, 250, 250, 0.95) 75%,
        rgba(255, 255, 255, 0.98) 100%
      )`
    : `linear-gradient(145deg, 
        rgba(30, 30, 30, 0.98) 0%, 
        rgba(35, 35, 35, 0.95) 25%,
        rgba(40, 40, 40, 0.92) 50%,
        rgba(35, 35, 35, 0.95) 75%,
        rgba(30, 30, 30, 0.98) 100%
      )`,
  border: '2px solid transparent',
  backgroundClip: 'padding-box',
  boxShadow: theme.palette.mode === 'light'
    ? `0 10px 30px rgba(0, 0, 0, 0.1), 
       0 0 20px rgba(162, 146, 120, 0.12),
       0 0 0 2px rgba(162, 146, 120, 0.08),
       inset 0 1px 0 rgba(255, 255, 255, 0.15)`
    : `0 10px 30px rgba(0, 0, 0, 0.3), 
       0 0 20px rgba(162, 146, 120, 0.15),
       0 0 0 2px rgba(162, 146, 120, 0.12),
       inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
  transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '130%',
    height: '130%',
    background: 'conic-gradient(from 0deg, rgba(162, 146, 120, 0.1), rgba(212, 192, 158, 0.15), rgba(255, 215, 0, 0.08), rgba(162, 146, 120, 0.1))',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%) scale(0)',
    transition: 'all 0.8s ease',
    zIndex: -1,
    filter: 'blur(15px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-10px',
    left: '-10px',
    right: '-10px',
    bottom: '-10px',
    background: `
      linear-gradient(45deg, 
        rgba(162, 146, 120, 0.08) 0%, 
        rgba(212, 192, 158, 0.12) 25%,
        rgba(255, 215, 0, 0.06) 50%,
        rgba(212, 192, 158, 0.12) 75%,
        rgba(162, 146, 120, 0.08) 100%
      )
    `,
    borderRadius: '32px',
    opacity: 0,
    transition: 'all 0.6s ease',
    zIndex: -2,
    filter: 'blur(3px)',
  },
  '&:hover': {
    transform: 'perspective(1500px) translateY(-15px) rotateX(8deg) rotateY(3deg) scale(1.05)',
    boxShadow: theme.palette.mode === 'light'
      ? `0 25px 50px rgba(0, 0, 0, 0.15),
         0 0 40px rgba(162, 146, 120, 0.3),
         0 0 80px rgba(212, 192, 158, 0.2),
         0 0 120px rgba(255, 215, 0, 0.1),
         0 0 0 3px rgba(162, 146, 120, 0.4),
         inset 0 2px 0 rgba(255, 255, 255, 0.25)`
      : `0 25px 50px rgba(0, 0, 0, 0.4),
         0 0 40px rgba(162, 146, 120, 0.4),
         0 0 80px rgba(212, 192, 158, 0.3),
         0 0 120px rgba(255, 215, 0, 0.15),
         0 0 0 3px rgba(162, 146, 120, 0.5),
         inset 0 2px 0 rgba(255, 255, 255, 0.1)`,
    animation: `${hyperdimensionalFloat} 4s ease-in-out infinite`,
    '&::before': {
      transform: 'translate(-50%, -50%) scale(1.1) rotate(180deg)',
      animation: `${cosmicRipple} 2.5s ease-out infinite`,
    },
    '&::after': {
      opacity: 1,
      animation: `${quantumGlow} 3s ease-in-out infinite`,
    },
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
  height: '250px',
  backgroundColor: theme.palette.mode === 'light' ? '#F5F5F5' : '#2a2a2a',
  overflow: 'hidden',
  borderRadius: '18px 18px 0 0',
  transformStyle: 'preserve-3d',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 30% 30%, rgba(162, 146, 120, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(212, 192, 158, 0.12) 0%, transparent 50%),
      linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, transparent 40%, rgba(162, 146, 120, 0.1) 100%)
    `,
    zIndex: 2,
    opacity: 0,
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    filter: 'blur(1px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '80%',
    height: '80%',
    background: 'conic-gradient(from 45deg, rgba(162, 146, 120, 0.1), rgba(212, 192, 158, 0.15), rgba(255, 215, 0, 0.08), rgba(162, 146, 120, 0.1))',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
    transition: 'all 0.8s ease',
    zIndex: 1,
    filter: 'blur(8px)',
    opacity: 0,
  },
  '&:hover::before': {
    opacity: 1,
    filter: 'blur(0.5px)',
  },
  '&:hover::after': {
    opacity: 0.6,
    transform: 'translate(-50%, -50%) scale(1.2) rotate(180deg)',
  },
  '& img': {
    transition: 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    transformStyle: 'preserve-3d',
  },
  '&:hover img': {
    transform: 'perspective(800px) scale(1.1) rotateZ(3deg) rotateY(5deg)',
    filter: 'brightness(1.1) contrast(1.15) saturate(1.2) hue-rotate(2deg)',
  },
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
  background: theme.palette.mode === 'light'
    ? 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))'
    : 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
  padding: theme.spacing(1.5),
  opacity: 0,
  transform: 'translateY(20px)',
  transition: 'all 0.3s ease',
  display: 'flex',
  justifyContent: 'center',
  zIndex: 2,
}));

const StyledAddToCartButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  fontWeight: 700,
  fontSize: '0.9rem',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  padding: theme.spacing(1.5, 3),
  minHeight: '40px',
  whiteSpace: 'nowrap',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  transformStyle: 'preserve-3d',
  position: 'relative',
  overflow: 'hidden',
  background: `
    linear-gradient(135deg, 
      #8b7355 0%, 
      #a29278 25%, 
      #c4a876 50%, 
      #d4c09e 75%, 
      #a29278 100%
    )
  `,
  backgroundSize: '200% auto',
  color: 'white',
  boxShadow: `
    0 6px 20px rgba(162, 146, 120, 0.3),
    0 0 15px rgba(212, 192, 158, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.15)
  `,
  border: '1px solid rgba(162, 146, 120, 0.2)',
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.4s ease',
  },
  '&:hover': {
    backgroundPosition: '100% 0',
    transform: 'perspective(800px) translateY(-2px) rotateX(3deg) scale(1.03) translateZ(15px)',
    boxShadow: `
      0 10px 30px rgba(162, 146, 120, 0.5),
      0 0 25px rgba(212, 192, 158, 0.3),
      0 0 50px rgba(255, 215, 0, 0.15),
      inset 0 2px 0 rgba(255, 255, 255, 0.2)
    `,
    border: '1px solid rgba(162, 146, 120, 0.4)',
    filter: 'drop-shadow(0 2px 6px rgba(139, 115, 85, 0.2))',
    '&::before': {
      left: '100%',
    },
  },
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
  const router = useRouter();
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/product/${product.slug}`, { scroll: false });
                    }}
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
                  size="medium"
                  startIcon={<AddShoppingCart sx={{ fontSize: '1rem' }} />}
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                >
                  Add to Cart
                </StyledAddToCartButton>
              </StyledCardActions>
            </>
          )}
        </ProductImageContainer>

        <CardContent sx={(theme) => ({ 
          flexGrow: 1, 
          pt: 2.5,
          px: 2.5,
          pb: 2,
          background: theme.palette.mode === 'light'
            ? `linear-gradient(135deg, 
                rgba(255, 255, 255, 0.95) 0%, 
                rgba(250, 250, 250, 0.9) 50%,
                rgba(245, 245, 245, 0.85) 100%
              )`
            : `linear-gradient(135deg, 
                rgba(45, 45, 45, 0.95) 0%, 
                rgba(40, 40, 40, 0.9) 50%,
                rgba(35, 35, 35, 0.85) 100%
              )`,
          borderRadius: '0 0 18px 18px',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              linear-gradient(135deg, 
                rgba(162, 146, 120, 0.03) 0%, 
                rgba(212, 192, 158, 0.05) 50%,
                rgba(255, 215, 0, 0.02) 100%
              )
            `,
            borderRadius: '0 0 18px 18px',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            zIndex: -1,
          },
          '&:hover::before': {
            opacity: 1,
          },
          '&:hover': {
            background: theme.palette.mode === 'light'
              ? `linear-gradient(135deg, 
                  rgba(162, 146, 120, 0.06) 0%, 
                  rgba(212, 192, 158, 0.08) 50%,
                  rgba(255, 215, 0, 0.04) 100%
                )`
              : `linear-gradient(135deg, 
                  rgba(162, 146, 120, 0.08) 0%, 
                  rgba(212, 192, 158, 0.1) 50%,
                  rgba(255, 215, 0, 0.06) 100%
                )`,
            transform: 'translateZ(10px)',
          }
        })}>
          <Typography 
            variant="subtitle1" 
            component="h2" 
            fontWeight={600}
            gutterBottom 
            sx={(theme) => ({
              fontSize: '1.1rem',
              letterSpacing: '0.3px',
              lineHeight: 1.3,
              height: '2.6rem',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              transition: 'all 0.3s ease',
              color: theme.palette.text.primary,
              '&:hover': {
                color: '#8b7355',
                textShadow: '0 2px 4px rgba(139, 115, 85, 0.2)',
                transform: 'translateZ(5px)',
              }
            })}
          >
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
                <Typography 
                  variant="h6" 
                  component="span" 
                  fontWeight="bold"
                  sx={(theme) => ({
                    fontSize: '1.3rem',
                    background: 'linear-gradient(135deg, #8b7355, #c4a876, #d4c09e)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateZ(8px) scale(1.03)',
                      filter: 'drop-shadow(0 1px 3px rgba(139, 115, 85, 0.2))',
                    }
                  })}
                >
                  {formatPrice(product.price * (1 - product.discount / 100))}
                </Typography>
                <Typography 
                  variant="body2" 
                  component="span" 
                  color="text.secondary" 
                  sx={{ 
                    textDecoration: 'line-through',
                    fontSize: '0.9rem'
                  }}
                >
                  {formatPrice(product.price)}
                </Typography>
              </Stack>
            ) : (
              <Typography 
                variant="h6" 
                component="span" 
                fontWeight="bold"
                sx={(theme) => ({
                  fontSize: '1.3rem',
                  color: '#8b7355',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #8b7355, #c4a876, #d4c09e)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    transform: 'translateZ(8px) scale(1.03)',
                    filter: 'drop-shadow(0 1px 3px rgba(139, 115, 85, 0.2))',
                  }
                })}
              >
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