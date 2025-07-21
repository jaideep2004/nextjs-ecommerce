'use client';

import { Grid, Box, Typography, Pagination, CircularProgress } from '@mui/material';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, error, title, pagination, onPageChange }) => {
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

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

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