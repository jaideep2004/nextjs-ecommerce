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

const hyperdimensionalFloat = keyframes`
  0% { 
    transform: perspective(2000px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px) scale3d(1, 1, 1);
    filter: brightness(1) saturate(1) hue-rotate(0deg) blur(0px);
    box-shadow: 
      0 12px 35px rgba(0, 0, 0, 0.12),
      0 0 40px rgba(162, 146, 120, 0.15),
      inset 0 2px 0 rgba(255, 255, 255, 0.1);
  }
  25% { 
    transform: perspective(2000px) rotateX(5deg) rotateY(8deg) rotateZ(2deg) translateZ(30px) scale3d(1.03, 1.03, 1.1);
    filter: brightness(1.08) saturate(1.2) hue-rotate(5deg) blur(0.5px);
    box-shadow: 
      0 25px 60px rgba(0, 0, 0, 0.18),
      0 0 70px rgba(162, 146, 120, 0.3),
      0 0 100px rgba(255, 215, 0, 0.15),
      inset 0 2px 0 rgba(255, 255, 255, 0.2);
  }
  50% { 
    transform: perspective(2000px) rotateX(-3deg) rotateY(12deg) rotateZ(-1deg) translateZ(45px) scale3d(1.05, 1.05, 1.15);
    filter: brightness(1.12) saturate(1.3) hue-rotate(8deg) blur(0.8px);
    box-shadow: 
      0 35px 80px rgba(0, 0, 0, 0.22),
      0 0 90px rgba(212, 192, 158, 0.4),
      0 0 140px rgba(255, 215, 0, 0.2),
      inset 0 2px 0 rgba(255, 255, 255, 0.25);
  }
  75% { 
    transform: perspective(2000px) rotateX(7deg) rotateY(-5deg) rotateZ(3deg) translateZ(25px) scale3d(1.02, 1.02, 1.08);
    filter: brightness(1.06) saturate(1.15) hue-rotate(3deg) blur(0.3px);
    box-shadow: 
      0 20px 50px rgba(0, 0, 0, 0.16),
      0 0 60px rgba(162, 146, 120, 0.25),
      0 0 90px rgba(255, 215, 0, 0.12),
      inset 0 2px 0 rgba(255, 255, 255, 0.15);
  }
  100% { 
    transform: perspective(2000px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px) scale3d(1, 1, 1);
    filter: brightness(1) saturate(1) hue-rotate(0deg) blur(0px);
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

// Enhanced Card Styles for Featured Collections - 4th Dimensional
const EnhancedCard = styled(Card)(({ theme, enhanced }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  borderRadius: enhanced ? '28px' : '12px',
  overflow: 'hidden',
  transformStyle: 'preserve-3d',
  background: enhanced 
    ? `linear-gradient(145deg, 
        rgba(255, 255, 255, 0.98) 0%, 
        rgba(250, 250, 250, 0.95) 25%,
        rgba(245, 245, 245, 0.92) 50%,
        rgba(250, 250, 250, 0.95) 75%,
        rgba(255, 255, 255, 0.98) 100%
      )`
    : 'inherit',
  border: enhanced 
    ? '3px solid transparent'
    : 'none',
  backgroundClip: enhanced ? 'padding-box' : 'initial',
  boxShadow: enhanced 
    ? `0 15px 45px rgba(0, 0, 0, 0.12), 
       0 0 30px rgba(162, 146, 120, 0.15),
       0 0 0 3px rgba(162, 146, 120, 0.1),
       inset 0 2px 0 rgba(255, 255, 255, 0.2)`
    : '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  ...(enhanced && {
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
      transform: 'perspective(2000px) translateY(-25px) rotateX(12deg) rotateY(5deg) rotateZ(1deg) scale(1.08)',
      boxShadow: `
        0 40px 80px rgba(0, 0, 0, 0.2),
        0 0 60px rgba(162, 146, 120, 0.4),
        0 0 120px rgba(212, 192, 158, 0.3),
        0 0 180px rgba(255, 215, 0, 0.15),
        0 0 0 4px rgba(162, 146, 120, 0.5),
        inset 0 3px 0 rgba(255, 255, 255, 0.3),
        inset 0 -2px 0 rgba(162, 146, 120, 0.2)
      `,
      animation: `${hyperdimensionalFloat} 5s ease-in-out infinite`,
      '&::before': {
        transform: 'translate(-50%, -50%) scale(1.2) rotate(180deg)',
        animation: `${cosmicRipple} 3s ease-out infinite`,
      },
      '&::after': {
        opacity: 1,
        animation: `${quantumGlow} 4s ease-in-out infinite`,
      },
      '& .enhanced-image': {
        transform: 'perspective(1000px) scale(1.2) rotateZ(5deg) rotateY(8deg)',
        filter: 'brightness(1.15) contrast(1.2) saturate(1.3) hue-rotate(3deg)',
      },
      '& .enhanced-content': {
        background: `linear-gradient(135deg, 
          rgba(162, 146, 120, 0.08) 0%, 
          rgba(212, 192, 158, 0.12) 50%,
          rgba(255, 215, 0, 0.06) 100%
        )`,
        transform: 'translateZ(20px)',
      },
      '& .enhanced-title': {
        color: '#8b7355',
        textShadow: '0 3px 6px rgba(139, 115, 85, 0.3)',
        transform: 'translateZ(10px)',
      },
      '& .enhanced-price': {
        background: 'linear-gradient(135deg, #8b7355, #c4a876, #d4c09e)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        transform: 'translateZ(15px) scale(1.05)',
        filter: 'drop-shadow(0 2px 4px rgba(139, 115, 85, 0.3))',
      },
      '& .enhanced-button': {
        background: 'linear-gradient(135deg, #8b7355 0%, #c4a876 50%, #d4c09e 100%)',
        transform: 'translateZ(25px) translateY(-5px) scale(1.08)',
        boxShadow: '0 12px 35px rgba(139, 115, 85, 0.5)',
        filter: 'drop-shadow(0 4px 8px rgba(139, 115, 85, 0.3))',
      }
    }
  }),
  ...(!enhanced && {
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
    }
  })
}));

const EnhancedImageWrapper = styled(Box)(({ theme, enhanced }) => ({
  position: 'relative',
  paddingTop: enhanced ? '115%' : '125%',
  overflow: 'hidden',
  backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#333',
  borderRadius: enhanced ? '24px 24px 0 0' : '0',
  transformStyle: 'preserve-3d',
  ...(enhanced && {
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
    }
  }),
  '& .product-image, & .enhanced-image': {
    transition: 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    transformStyle: 'preserve-3d',
  },
}));

const EnhancedContent = styled(CardContent)(({ theme, enhanced }) => ({
  flexGrow: 1,
  padding: enhanced ? theme.spacing(4.5) : theme.spacing(2, 2, 1),
  transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  transformStyle: 'preserve-3d',
  position: 'relative',
  ...(enhanced && {
    background: `linear-gradient(135deg, 
      rgba(255, 255, 255, 0.95) 0%, 
      rgba(250, 250, 250, 0.9) 50%,
      rgba(245, 245, 245, 0.85) 100%
    )`,
    borderRadius: '0 0 24px 24px',
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
      borderRadius: '0 0 24px 24px',
      opacity: 0,
      transition: 'opacity 0.4s ease',
      zIndex: -1,
    },
    '&:hover::before': {
      opacity: 1,
    }
  })
}));

const EnhancedButton = styled(Button)(({ theme, enhanced }) => ({
  borderRadius: enhanced ? '18px' : '50px',
  padding: enhanced ? theme.spacing(2.5, 5) : theme.spacing(1, 2),
  fontWeight: enhanced ? 800 : 'bold',
  fontSize: enhanced ? '1.2rem' : '0.9rem',
  letterSpacing: enhanced ? '1px' : 'normal',
  textTransform: enhanced ? 'uppercase' : 'none',
  transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  transformStyle: 'preserve-3d',
  position: 'relative',
  overflow: 'hidden',
  ...(enhanced ? {
    background: `
      linear-gradient(135deg, 
        #8b7355 0%, 
        #a29278 25%, 
        #c4a876 50%, 
        #d4c09e 75%, 
        #a29278 100%
      )
    `,
    backgroundSize: '300% auto',
    color: 'white',
    boxShadow: `
      0 8px 25px rgba(162, 146, 120, 0.4),
      0 0 20px rgba(212, 192, 158, 0.2),
      inset 0 2px 0 rgba(255, 255, 255, 0.2)
    `,
    border: '2px solid rgba(162, 146, 120, 0.3)',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
      transition: 'left 0.6s ease',
    },
    '&:hover': {
      backgroundPosition: '100% 0',
      transform: 'perspective(1000px) translateY(-4px) rotateX(5deg) scale(1.05)',
      boxShadow: `
        0 15px 40px rgba(162, 146, 120, 0.6),
        0 0 40px rgba(212, 192, 158, 0.4),
        0 0 80px rgba(255, 215, 0, 0.2),
        inset 0 3px 0 rgba(255, 255, 255, 0.3)
      `,
      border: '2px solid rgba(162, 146, 120, 0.6)',
      '&::before': {
        left: '100%',
      },
    },
  } : {
    background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
    boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
    '&:hover': {
      boxShadow: '0 6px 15px rgba(99, 102, 241, 0.4)',
      transform: 'translateY(-2px)',
    },
  })
}));

const ProductCard = ({ product, enhanced = false, isInWishlist, onAddToCart, onAddToWishlist, onRemoveFromWishlist }) => {
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
    <EnhancedCard enhanced={enhanced}>
      <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
        <EnhancedImageWrapper enhanced={enhanced}>
          <CardMedia
            component={Image}
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className={enhanced ? "enhanced-image" : "product-image"}
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
        </EnhancedImageWrapper>

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

      <EnhancedContent enhanced={enhanced} className={enhanced ? "enhanced-content" : ""}>
        <Typography
          variant={enhanced ? "h6" : "subtitle1"}
          component="h2"
          className={enhanced ? "enhanced-title" : ""}
          sx={{
            fontWeight: enhanced ? 700 : 'bold',
            mb: enhanced ? 1 : 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            height: enhanced ? '4em' : '3em',
            fontSize: enhanced ? '1.4rem' : 'inherit',
            letterSpacing: enhanced ? '0.5px' : 'normal',
            transition: 'all 0.3s ease',
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

        <Box sx={{ display: 'flex', alignItems: 'center', mb: enhanced ? 2 : 0 }}>
          <Typography
            variant={enhanced ? "h4" : "h6"}
            component="span"
            className={enhanced ? "enhanced-price" : ""}
            sx={{ 
              fontWeight: 'bold', 
              color: enhanced ? '#8b7355' : 'primary.main',
              fontSize: enhanced ? '1.8rem' : 'inherit',
              transition: 'all 0.3s ease',
            }}
          >
            ${discountedPrice.toFixed(2)}
          </Typography>
          {product.discount > 0 && (
            <Typography
              variant="body2"
              component="span"
              sx={{ 
                ml: 1, 
                textDecoration: 'line-through', 
                color: 'text.secondary',
                fontSize: enhanced ? '1.1rem' : 'inherit'
              }}
            >
              ${product.price.toFixed(2)}
            </Typography>
          )}
        </Box>
      </EnhancedContent>

      <Box sx={{ p: enhanced ? 4 : 2, pt: 0 }}>
        <EnhancedButton
          variant="contained"
          fullWidth
          startIcon={<LocalMall />}
          onClick={onAddToCart ? () => onAddToCart(product) : handleAddToCart}
          disabled={product.countInStock === 0}
          enhanced={enhanced}
          className={enhanced ? "enhanced-button" : ""}
        >
          {product.countInStock === 0 ? 'Out of Stock' : (enhanced ? 'Add to Cart' : 'Add to Cart')}
        </EnhancedButton>
      </Box>
    </EnhancedCard>
  );
};

export default ProductCard;