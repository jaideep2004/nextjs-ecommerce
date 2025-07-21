'use client';

import { Box, Container, Grid, Typography, Link as MuiLink, IconButton, Divider, TextField, Button } from '@mui/material';
import { Facebook, Twitter, Instagram, Pinterest, Email, Phone, LocationOn } from '@mui/icons-material';
import Link from 'next/link';

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribed to newsletter');
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#5D4037',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Punjabi Attire
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Authentic Punjabi clothing for all occasions. Discover our collection of traditional Punjabi suits and turbans crafted with quality fabrics and exquisite designs.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" aria-label="Pinterest">
                <Pinterest />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} href="/" color="inherit" underline="hover">
                  Home
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} href="/products" color="inherit" underline="hover">
                  Shop All
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} href="/category/punjabi-suits" color="inherit" underline="hover">
                  Punjabi Suits
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} href="/category/turbans" color="inherit" underline="hover">
                  Turbans
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} href="/about" color="inherit" underline="hover">
                  About Us
                </MuiLink>
              </Box>
            </Box>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Customer Service
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} href="/contact" color="inherit" underline="hover">
                  Contact Us
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} href="/faq" color="inherit" underline="hover">
                  FAQs
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} href="/shipping" color="inherit" underline="hover">
                  Shipping & Returns
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} href="/privacy-policy" color="inherit" underline="hover">
                  Privacy Policy
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} href="/terms" color="inherit" underline="hover">
                  Terms & Conditions
                </MuiLink>
              </Box>
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Newsletter
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Subscribe to receive updates, access to exclusive deals, and more.
            </Typography>
            <Box component="form" onSubmit={handleSubscribe}>
              <TextField
                fullWidth
                placeholder="Your email"
                variant="outlined"
                size="small"
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#8D6E63', '&:hover': { bgcolor: '#6D4C41' } }}
              >
                Subscribe
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Email sx={{ mr: 1, fontSize: 18 }} />
                info@punjabiattire.com
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone sx={{ mr: 1, fontSize: 18 }} />
                +1 (123) 456-7890
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1, fontSize: 18 }} />
                123 Fashion St, Style City
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />

        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} Punjabi Attire. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;