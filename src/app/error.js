'use client';

import { useEffect } from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { Refresh as RefreshIcon, Home as HomeIcon } from '@mui/icons-material';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          py: 8,
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 2, 
            textAlign: 'center',
            maxWidth: 600,
            width: '100%',
            borderTop: 5,
            borderColor: 'error.main'
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            color="error.main"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Something Went Wrong
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            We apologize for the inconvenience. An unexpected error has occurred.
            You can try refreshing the page or return to the homepage.
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={reset}
              startIcon={<RefreshIcon />}
            >
              Try Again
            </Button>
            
            <Link href="/" passHref>
              <Button 
                variant="outlined" 
                startIcon={<HomeIcon />}
              >
                Back to Homepage
              </Button>
            </Link>
          </Box>
        </Paper>
        
        {process.env.NODE_ENV === 'development' && error && (
          <Paper 
            sx={{ 
              mt: 4, 
              p: 3, 
              maxWidth: 600, 
              width: '100%',
              bgcolor: '#272727',
              color: '#f0f0f0',
              fontFamily: 'monospace',
              overflow: 'auto',
              maxHeight: 300,
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#ff9800' }}>
              Error Details (Development Only):
            </Typography>
            <Box component="pre" sx={{ m: 0, fontSize: '0.875rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {error?.message || 'Unknown error'}
              {error?.stack && `\n\n${error.stack}`}
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
}