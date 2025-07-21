'use client';

import { Grid, Box, Typography } from '@mui/material';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../ui/ProductCardSkeleton';
import EmptyState from '../ui/EmptyState';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

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
  if (loading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (error) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      </Box>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="We couldn't find any products matching your criteria."
        icon={<ShoppingBagIcon />}
        {...emptyStateProps}
      />
    );
  }

  return (
    <Grid container spacing={3} {...gridProps}>
      {products.map((product) => {
        const inWishlist = wishlistItems.some(item => item._id === product._id);
        
        return (
          <Grid item key={product._id} xs={12} sm={6} md={4} lg={3} {...itemProps}>
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
              onRemoveFromWishlist={onRemoveFromWishlist}
              inWishlist={inWishlist}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}