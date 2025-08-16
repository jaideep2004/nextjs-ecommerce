'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useThemeContext } from '@/theme';
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
  InputAdornment,
  Paper,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  LinkedIn,
  Phone,
  Email,
  LocationOn,
  KeyboardArrowRight,
  Send,
  ArrowForward,
} from '@mui/icons-material';

// Styled components
const FooterSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.dark : '#1A1A1A',
  color: theme.palette.common.white,
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: theme.palette.mode === 'light' 
      ? 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)'
      : 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 70%)',
    zIndex: 1,
  },
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  marginBottom: theme.spacing(3),
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: -8,
    width: 40,
    height: 3,
    backgroundColor: theme.palette.secondary.main,
  },
}));

const FooterLink = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(0.5, 0),
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateX(5px)',
    color: theme.palette.secondary.main,
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 30,
  color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.5)',
}));

const NewsletterBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: theme.palette.mode === 'light' 
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.2)',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' 
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(255, 255, 255, 0.05)',
  color: theme.palette.common.white,
  margin: theme.spacing(0, 0.5),
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
    transform: 'translateY(-3px)',
  },
}));

const PaymentIcon = styled(Image)(({ theme }) => ({
  filter: theme.palette.mode === 'dark' ? 'brightness(0.8)' : 'none',
}));

const BlogPost = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
  },
}));

const BlogImage = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  marginRight: theme.spacing(2),
  position: 'relative',
  flexShrink: 0,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const theme = useTheme();
  const { mode } = useThemeContext();

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
  
  // Sample recent blog posts data
  const recentPosts = [
    {
      id: 1,
      title: "Tips on Finding Affordable Fashion Gems Online",
      date: "July 11, 2023",
      image: "/images/blog/blog-1.jpg",
      slug: "tips-affordable-fashion",
    },
    {
      id: 2,
      title: "Mastering the Art of Fashion E-commerce Marketing",
      date: "July 11, 2024",
      image: "/images/blog/blog-2.jpg",
      slug: "mastering-fashion-ecommerce",
    },
    {
      id: 3,
      title: "Must-Have Trends You Can Shop Online Now",
      date: "July 11, 2024",
      image: "/images/blog/blog-3.jpg",
      slug: "trends-shop-online",
    },
  ];

  return (
    <FooterSection>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
                Punjabi Attire
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, opacity: 0.8, lineHeight: 1.7 }}>
                Punjabi Attire is an exciting UK-based brand that offers high-quality traditional Punjabi suits and turbans with authentic designs.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StyledListItemIcon>
                  <Email fontSize="small" />
                </StyledListItemIcon>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  info@punjabiattire.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StyledListItemIcon>
                  <Phone fontSize="small" />
                </StyledListItemIcon>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  +44 123 456 7890
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StyledListItemIcon>
                  <LocationOn fontSize="small" />
                </StyledListItemIcon>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  123 High Street, London, UK
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Find Us:
              </Typography>
              <Box sx={{ display: 'flex' }}>
                <SocialIconButton size="small" aria-label="facebook">
                  <Facebook fontSize="small" />
                </SocialIconButton>
                <SocialIconButton size="small" aria-label="twitter">
                  <Twitter fontSize="small" />
                </SocialIconButton>
                <SocialIconButton size="small" aria-label="instagram">
                  <Instagram fontSize="small" />
                </SocialIconButton>
                <SocialIconButton size="small" aria-label="youtube">
                  <YouTube fontSize="small" />
                </SocialIconButton>
                <SocialIconButton size="small" aria-label="linkedin">
                  <LinkedIn fontSize="small" />
                </SocialIconButton>
              </Box>
            </Box>
          </Grid>

          {/* Customer Services */}
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <FooterTitle variant="h6">
              Customer Services
            </FooterTitle>
            <List dense disablePadding>
              <FooterLink disableGutters component={Link} href="/customer/orders" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>
                  <KeyboardArrowRight fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="My Orders" />
              </FooterLink>
              <FooterLink disableGutters component={Link} href="/customer/wishlist" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>
                  <KeyboardArrowRight fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Wishlist" />
              </FooterLink>
              <FooterLink disableGutters component={Link} href="/terms" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>
                  <KeyboardArrowRight fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Terms & Conditions" />
              </FooterLink>
              <FooterLink disableGutters component={Link} href="/privacy" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>
                  <KeyboardArrowRight fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Privacy Policy" />
              </FooterLink>
              <FooterLink disableGutters component={Link} href="/shipping" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>
                  <KeyboardArrowRight fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Shipping Information" />
              </FooterLink>
              <FooterLink disableGutters component={Link} href="/returns" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>
                  <KeyboardArrowRight fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Returns & Refunds" />
              </FooterLink>
            </List>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2} lg={2}>
            <FooterTitle variant="h6">
              Quick Links
            </FooterTitle>
            <List dense disablePadding>
              <FooterLink disableGutters component={Link} href="/" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>
                  <KeyboardArrowRight fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </FooterLink>
              <FooterLink disableGutters component={Link} href="/products" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>
                  <KeyboardArrowRight fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Shop" />
              </FooterLink>
              <FooterLink disableGutters component={Link} href="/about" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>
                  <KeyboardArrowRight fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="About Us" />
              </FooterLink>
              <FooterLink disableGutters component={Link} href="/contact" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>
                  <KeyboardArrowRight fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Contact" />
              </FooterLink>
              <FooterLink disableGutters component={Link} href="/faq" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>
                  <KeyboardArrowRight fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="FAQ" />
              </FooterLink>
            </List>
          </Grid>

          {/* Newsletter & Blog Posts */}
          <Grid item xs={12} sm={6} md={3} lg={4}>
            <FooterTitle variant="h6">
              Newsletter
            </FooterTitle>
            <NewsletterBox>
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
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.secondary.main,
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          variant="contained"
                          color="secondary"
                          disableElevation
                          type="submit"
                          disabled={!email || !email.includes('@')}
                          sx={{
                            borderRadius: '50px',
                            minWidth: 'unset',
                            width: 35,
                            height: 35,
                            p: 0,
                          }}
                        >
                          <Send fontSize="small" />
                        </Button>
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
            </NewsletterBox>

            <FooterTitle variant="h6">
              Recent Posts
            </FooterTitle>
            {recentPosts.map((post) => (
              <BlogPost key={post.id} component={Link} href={`/blog/${post.slug}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                <BlogImage>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </BlogImage>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, opacity: 0.9 }}>
                    {post.title}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {post.date}
                  </Typography>
                </Box>
              </BlogPost>
            ))}
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              endIcon={<ArrowForward />}
              component={Link}
              href="/blog"
              sx={{ mt: 1, borderRadius: '50px' }}
            >
              View All Posts
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Bottom Footer */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
              © {currentYear} Punjabi Attire. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center' }}>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" sx={{ mr: 2 }}>
              We Accept:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <PaymentIcon src="/images/payment/visa.svg" alt="Visa" width={40} height={25} />
              <PaymentIcon src="/images/payment/mastercard.svg" alt="Mastercard" width={40} height={25} />
              <PaymentIcon src="/images/payment/amex.svg" alt="American Express" width={40} height={25} />
              <PaymentIcon src="/images/payment/paypal.svg" alt="PayPal" width={40} height={25} />
              <PaymentIcon src="/images/payment/apple-pay.svg" alt="Apple Pay" width={40} height={25} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </FooterSection>
  );
}