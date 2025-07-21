'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          py: 8,
        }}
      >
        <Typography 
          variant="h1" 
          component="h1" 
          sx={{ 
            fontSize: { xs: '6rem', md: '10rem' },
            fontWeight: 700,
            color: 'primary.main',
            mb: 2,
          }}
        >
          404
        </Typography>
        
        <Box sx={{ position: 'relative', width: '100%', height: 250, mb: 4 }}>
          <Image
            src="/images/404-illustration.svg"
            alt="Page not found illustration"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </Box>
        
        <Typography variant="h4" component="h2" gutterBottom>
          Oops! Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable. Please check the URL or navigate back to the homepage.
        </Typography>
        
        <Link href="/" passHref>
          <Button 
            variant="contained" 
            size="large" 
            startIcon={<HomeIcon />}
            sx={{ borderRadius: 2 }}
          >
            Back to Homepage
          </Button>
        </Link>
      </Box>
    </Container>
  );
}