'use client';

import { Box, Typography, Button, Paper } from '@mui/material';
import Image from 'next/image';

export default function EmptyState({
  title = 'No data found',
  description = 'There are no items to display at the moment.',
  icon,
  action,
  actionText = 'Go Back',
  imageSrc,
  imageAlt = 'Empty state illustration',
  paperProps = {},
  sx = {},
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
        minHeight: '200px',
        backgroundColor: 'background.default',
        ...sx,
      }}
      {...paperProps}
    >
      {icon && (
        <Box sx={{ mb: 2, color: 'text.secondary', '& svg': { fontSize: 64 } }}>
          {icon}
        </Box>
      )}

      {imageSrc && (
        <Box sx={{ mb: 3, maxWidth: '100%', height: 'auto' }}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={200}
            height={200}
            style={{ objectFit: 'contain' }}
          />
        </Box>
      )}

      <Typography variant="h5" component="h2" gutterBottom>
        {title}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 450 }}>
        {description}
      </Typography>

      {action && (
        <Button
          variant="contained"
          color="primary"
          onClick={action}
        >
          {actionText}
        </Button>
      )}
    </Paper>
  );
}