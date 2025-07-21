'use client';

import { Card, CardContent, CardActions, Skeleton, Box, Grid } from '@mui/material';

export default function ProductCardSkeleton() {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Skeleton variant="rectangular" sx={{ paddingTop: '100%' }} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" width="60%" height={32} />
        <Box sx={{ mt: 1 }}>
          <Skeleton variant="text" width="40%" height={24} />
        </Box>
        <Box sx={{ mt: 1 }}>
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="70%" height={20} />
        </Box>
      </CardContent>
      <CardActions>
        <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
        <Box sx={{ flexGrow: 1 }} />
        <Skeleton variant="circular" width={36} height={36} />
      </CardActions>
    </Card>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <Grid container spacing={3}>
      {Array.from(new Array(count)).map((_, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <ProductCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}