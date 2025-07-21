'use client';

import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingSpinner({ size = 40, message = '', fullHeight = false }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: fullHeight ? '50vh' : 'auto',
        py: fullHeight ? 0 : 4,
      }}
    >
      <CircularProgress size={size} thickness={4} />
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}