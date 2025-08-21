'use client';

import { Grid, Box, Typography, Pagination, CircularProgress } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import ProductCard from './ProductCard';
import { useEffect } from 'react';

// 4th Dimensional Animations - Enhanced
const dimensionalFloat = keyframes`
  0% { 
    transform: perspective(1500px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px) scale(1);
    box-shadow: 
      0 8px 25px rgba(0, 0, 0, 0.12),
      0 0 30px rgba(162, 146, 120, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    filter: brightness(1) saturate(1) hue-rotate(0deg);
  }
  20% { 
    transform: perspective(1500px) rotateX(3deg) rotateY(5deg) rotateZ(1deg) translateZ(15px) scale(1.02);
    box-shadow: 
      0 15px 40px rgba(0, 0, 0, 0.18),
      0 0 50px rgba(162, 146, 120, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    filter: brightness(1.05) saturate(1.1) hue-rotate(2deg);
  }
  40% { 
    transform: perspective(1500px) rotateX(-2deg) rotateY(8deg) rotateZ(-1deg) translateZ(25px) scale(1.03);
    box-shadow: 
      0 20px 50px rgba(0, 0, 0, 0.22),
      0 0 70px rgba(212, 192, 158, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    filter: brightness(1.08) saturate(1.15) hue-rotate(5deg);
  }
  60% { 
    transform: perspective(1500px) rotateX(4deg) rotateY(-3deg) rotateZ(2deg) translateZ(20px) scale(1.01);
    box-shadow: 
      0 18px 45px rgba(0, 0, 0, 0.2),
      0 0 60px rgba(162, 146, 120, 0.28),
      inset 0 1px 0 rgba(255, 255, 255, 0.18);
    filter: brightness(1.06) saturate(1.12) hue-rotate(3deg);
  }
  80% { 
    transform: perspective(1500px) rotateX(-1deg) rotateY(6deg) rotateZ(-0.5deg) translateZ(12px) scale(1.015);
    box-shadow: 
      0 12px 35px rgba(0, 0, 0, 0.16),
      0 0 45px rgba(212, 192, 158, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
    filter: brightness(1.03) saturate(1.08) hue-rotate(1deg);
  }
  100% { 
    transform: perspective(1500px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px) scale(1);
    box-shadow: 
      0 8px 25px rgba(0, 0, 0, 0.12),
      0 0 30px rgba(162, 146, 120, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    filter: brightness(1) saturate(1) hue-rotate(0deg);
  }
`;

const etherealGlow = keyframes`
  0%, 100% { 
    box-shadow: 
      0 0 30px rgba(162, 146, 120, 0.25),
      0 0 60px rgba(212, 192, 158, 0.15),
      0 0 90px rgba(255, 215, 0, 0.08),
      0 8px 25px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    filter: drop-shadow(0 0 20px rgba(162, 146, 120, 0.3));
  }
  25% { 
    box-shadow: 
      0 0 45px rgba(162, 146, 120, 0.4),
      0 0 80px rgba(212, 192, 158, 0.25),
      0 0 120px rgba(255, 215, 0, 0.12),
      0 15px 40px rgba(0, 0, 0, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    filter: drop-shadow(0 0 30px rgba(212, 192, 158, 0.4));
  }
  50% { 
    box-shadow: 
      0 0 60px rgba(162, 146, 120, 0.5),
      0 0 100px rgba(212, 192, 158, 0.35),
      0 0 150px rgba(255, 215, 0, 0.15),
      0 20px 50px rgba(0, 0, 0, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    filter: drop-shadow(0 0 40px rgba(255, 215, 0, 0.3));
  }
  75% { 
    box-shadow: 
      0 0 45px rgba(162, 146, 120, 0.4),
      0 0 80px rgba(212, 192, 158, 0.25),
      0 0 120px rgba(255, 215, 0, 0.12),
      0 15px 40px rgba(0, 0, 0, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    filter: drop-shadow(0 0 30px rgba(212, 192, 158, 0.4));
  }
`;

const cosmicPulse = keyframes`
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05) rotate(180deg);
    opacity: 1;
  }
`;

const dimensionalRipple = keyframes`
  0% {
    transform: scale(0.8) rotateZ(0deg);
    opacity: 0;
    border-radius: 50%;
  }
  50% {
    transform: scale(1.2) rotateZ(180deg);
    opacity: 0.6;
    border-radius: 30%;
  }
  100% {
    transform: scale(2) rotateZ(360deg);
    opacity: 0;
    border-radius: 20%;
  }
`;

const EnhancedGrid = styled(Grid)(({ theme, enhanced }) => ({
  position: 'relative',
  '& .MuiGrid-item': {
    transformStyle: 'preserve-3d',
    transition: 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    position: 'relative',
    ...(enhanced && {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, rgba(162, 146, 120, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%) scale(0)',
        transition: 'all 0.6s ease',
        zIndex: -1,
        pointerEvents: 'none',
      },
      '&:hover': {
        transform: 'translateY(-15px) scale(1.03)',
        zIndex: 20,
        '&::before': {
          transform: 'translate(-50%, -50%) scale(1.5)',
          animation: `${dimensionalRipple} 2s ease-out infinite`,
        },
        '& .product-card': {
          animation: `${dimensionalFloat} 4s ease-in-out infinite`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-8px',
            left: '-8px',
            right: '-8px',
            bottom: '-8px',
            background: `
              linear-gradient(45deg, 
                rgba(162, 146, 120, 0.15) 0%, 
                rgba(212, 192, 158, 0.2) 25%,
                rgba(255, 215, 0, 0.1) 50%,
                rgba(212, 192, 158, 0.2) 75%,
                rgba(162, 146, 120, 0.15) 100%
              )
            `,
            borderRadius: '20px',
            zIndex: -1,
            animation: `${etherealGlow} 3s ease-in-out infinite`,
            filter: 'blur(2px)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '120%',
            height: '120%',
            background: 'conic-gradient(from 0deg, rgba(162, 146, 120, 0.1), rgba(212, 192, 158, 0.15), rgba(255, 215, 0, 0.08), rgba(162, 146, 120, 0.1))',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            animation: `${cosmicPulse} 4s ease-in-out infinite`,
            zIndex: -2,
            filter: 'blur(10px)',
          }
        }
      },
      '&:nth-of-type(even):hover .product-card': {
        animationDirection: 'reverse',
      },
      '&:nth-of-type(3n):hover .product-card': {
        animationDelay: '0.5s',
      }
    })
  }
}));

const ProductGrid = ({ products, loading, error, title, pagination, onPageChange, enhanced = false, wishlistItems = [], onAddToCart, onAddToWishlist, onRemoveFromWishlist }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#8D6E63' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No products found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      {title && (
        <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
          {title}
        </Typography>
      )}

      <EnhancedGrid container spacing={enhanced ? 4 : 3} enhanced={enhanced}>
        {products.map((product, index) => (
          <Grid 
            item 
            key={product._id} 
            xs={12} 
            sm={6} 
            md={enhanced ? 4 : 4} 
            lg={enhanced ? 4 : 3}
            data-aos="fade-up"
            data-aos-delay={index % 4 * 100}
            sx={{
              ...(enhanced && {
                minHeight: '520px',
                display: 'flex',
                alignItems: 'stretch'
              })
            }}
          >
            <Box 
              className="product-card"
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transformStyle: 'preserve-3d',
                ...(enhanced && {
                  borderRadius: '20px',
                  overflow: 'hidden',
                  background: `
                    linear-gradient(135deg, 
                      rgba(255, 255, 255, 0.95) 0%, 
                      rgba(250, 250, 250, 0.9) 25%,
                      rgba(245, 245, 245, 0.85) 50%,
                      rgba(250, 250, 250, 0.9) 75%,
                      rgba(255, 255, 255, 0.95) 100%
                    )
                  `,
                  border: '3px solid transparent',
                  backgroundClip: 'padding-box',
                  transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  boxShadow: `
                    0 10px 30px rgba(0, 0, 0, 0.1),
                    0 0 20px rgba(162, 146, 120, 0.08),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `,
                  '&:hover': {
                    border: '3px solid rgba(162, 146, 120, 0.5)',
                    background: `
                      linear-gradient(135deg, 
                        rgba(255, 255, 255, 1) 0%, 
                        rgba(248, 248, 248, 0.95) 25%,
                        rgba(240, 240, 240, 0.9) 50%,
                        rgba(248, 248, 248, 0.95) 75%,
                        rgba(255, 255, 255, 1) 100%
                      )
                    `,
                    boxShadow: `
                      0 25px 60px rgba(0, 0, 0, 0.15),
                      0 0 40px rgba(162, 146, 120, 0.2),
                      0 0 80px rgba(212, 192, 158, 0.15),
                      inset 0 1px 0 rgba(255, 255, 255, 0.3),
                      inset 0 -1px 0 rgba(162, 146, 120, 0.1)
                    `,
                    transform: 'perspective(1000px) rotateX(5deg) rotateY(2deg) translateZ(10px)',
                  }
                })
              }}
            >
              <ProductCard 
                product={product} 
                enhanced={enhanced}
                isInWishlist={wishlistItems?.some(item => item._id === product._id)}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                onRemoveFromWishlist={onRemoveFromWishlist}
              />
            </Box>
          </Grid>
        ))}
      </EnhancedGrid>

      {pagination && pagination.pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.pages}
            page={pagination.page}
            onChange={onPageChange}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#5D4037',
              },
              '& .Mui-selected': {
                backgroundColor: '#8D6E63 !important',
                color: 'white',
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ProductGrid;