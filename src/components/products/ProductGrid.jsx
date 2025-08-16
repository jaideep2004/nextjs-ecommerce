'use client';

import { Grid, Box, Typography, Container, Fade } from '@mui/material';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../ui/ProductCardSkeleton';
import EmptyState from '../ui/EmptyState';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Wrapper component for animation
const AnimatedGridItem = ({ children, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ height: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export default function ProductGrid({
  products = [],
  loading = false,
  error = null,
  onAddToCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  wishlistItems = [],
  emptyStateProps = {},
  gridProps = {},
  itemProps = {},
}) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <ProductGridSkeleton count={8} />
      </Container>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography color="error" variant="h6" gutterBottom>
          {error}
        </Typography>
        <Typography color="text.secondary">
          Please try again later or contact support if the issue persists.
        </Typography>
      </Box>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="We couldn't find any products matching your criteria."
        icon={<ShoppingBagIcon sx={{ fontSize: 60 }} />}
        {...emptyStateProps}
      />
    );
  }

  if (!mounted) {
    return null; // Prevent SSR hydration issues with animations
  }

  return (
    <Fade in={true} timeout={500}>
      <Grid container spacing={3} {...gridProps}>
        {products.map((product, index) => {
          const inWishlist = wishlistItems.some(item => item._id === product._id);
          
          return (
            <Grid item key={product._id} xs={12} sm={6} md={4} lg={3} {...itemProps}>
              <AnimatedGridItem index={index}>
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onAddToWishlist={onAddToWishlist}
                  onRemoveFromWishlist={onRemoveFromWishlist}
                  inWishlist={inWishlist}
                />
              </AnimatedGridItem>
            </Grid>
          );
        })}
      </Grid>
    </Fade>
  );
}