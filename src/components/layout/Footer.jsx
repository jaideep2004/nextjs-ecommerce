'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  LinkedIn as LinkedInIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Payment as PaymentIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      // In a real app, you would send this to your API
      console.log('Subscribing email:', email);
      setSubscribed(true);
      setEmail('');
      // Reset the subscribed state after 3 seconds
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ bgcolor: 'primary.dark', color: 'white', pt: 6, pb: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              SHOP NAME
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              We offer high-quality products at competitive prices, with exceptional customer service and fast shipping.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="inherit" aria-label="Facebook" size="small">
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter" size="small">
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram" size="small">
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton color="inherit" aria-label="YouTube" size="small">
                <YouTubeIcon fontSize="small" />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn" size="small">
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <List dense disablePadding>
              <ListItem disableGutters component={Link} href="/" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem disableGutters component={Link} href="/products" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemText primary="Shop" />
              </ListItem>
              <ListItem disableGutters component={Link} href="/about" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemText primary="About Us" />
              </ListItem>
              <ListItem disableGutters component={Link} href="/contact" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemText primary="Contact" />
              </ListItem>
              <ListItem disableGutters component={Link} href="/faq" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemText primary="FAQ" />
              </ListItem>
              <ListItem disableGutters component={Link} href="/blog" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemText primary="Blog" />
              </ListItem>
            </List>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Customer Service
            </Typography>
            <List dense disablePadding>
              <ListItem disableGutters component={Link} href="/customer/orders" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemText primary="My Orders" />
              </ListItem>
              <ListItem disableGutters component={Link} href="/customer/wishlist" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemText primary="Wishlist" />
              </ListItem>
              <ListItem disableGutters component={Link} href="/terms" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemText primary="Terms & Conditions" />
              </ListItem>
              <ListItem disableGutters component={Link} href="/privacy" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemText primary="Privacy Policy" />
              </ListItem>
              <ListItem disableGutters component={Link} href="/shipping" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemText primary="Shipping Information" />
              </ListItem>
              <ListItem disableGutters component={Link} href="/returns" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemText primary="Returns & Refunds" />
              </ListItem>
            </List>
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
                placeholder="Your email address"
                variant="outlined"
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  mb: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.light',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        edge="end" 
                        color="inherit" 
                        type="submit"
                        disabled={!email || !email.includes('@')}
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {subscribed && (
                <Typography variant="caption" color="success.light">
                  Thank you for subscribing!
                </Typography>
              )}
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Contact Us
              </Typography>
              <List dense disablePadding>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>
                    <LocationIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="123 Main St, Anytown, ST 12345" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>
                    <PhoneIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="(123) 456-7890" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>
                    <EmailIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="support@yourdomain.com" />
                </ListItem>
              </List>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Bottom Footer */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
              © {currentYear} Shop Name. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" sx={{ mr: 1 }}>
                We Accept:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <img src="/images/payment/visa.svg" alt="Visa" height="20" />
                <img src="/images/payment/mastercard.svg" alt="Mastercard" height="20" />
                <img src="/images/payment/amex.svg" alt="American Express" height="20" />
                <img src="/images/payment/paypal.svg" alt="PayPal" height="20" />
                <img src="/images/payment/apple-pay.svg" alt="Apple Pay" height="20" />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}