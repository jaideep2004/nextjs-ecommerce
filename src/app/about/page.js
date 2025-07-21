'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
  Button,
  Card,
  CardContent,
  CardMedia,
  Avatar,
} from '@mui/material';
import {
  ShoppingBag as ShoppingBagIcon,
  LocalShipping as ShippingIcon,
  Support as SupportIcon,
  Security as SecurityIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

export default function AboutPage() {
  // Team members data
  const teamMembers = [
    {
      name: 'John Doe',
      position: 'CEO & Founder',
      image: '/images/team/john-doe.jpg',
      bio: 'John has over 15 years of experience in retail and e-commerce. He founded our company with a vision to provide quality products at affordable prices.',
    },
    {
      name: 'Jane Smith',
      position: 'Chief Operations Officer',
      image: '/images/team/jane-smith.jpg',
      bio: 'Jane oversees all operational aspects of our business, ensuring smooth processes from inventory management to order fulfillment.',
    },
    {
      name: 'Michael Johnson',
      position: 'Head of Marketing',
      image: '/images/team/michael-johnson.jpg',
      bio: 'Michael brings creative marketing strategies that have helped us grow our customer base and establish a strong brand presence.',
    },
    {
      name: 'Sarah Williams',
      position: 'Customer Experience Manager',
      image: '/images/team/sarah-williams.jpg',
      bio: 'Sarah is dedicated to ensuring every customer has an exceptional shopping experience with us, from browsing to post-purchase support.',
    },
  ];

  // Company values
  const companyValues = [
    {
      title: 'Quality Products',
      icon: <ShoppingBagIcon sx={{ fontSize: 40 }} />,
      description: 'We source only the highest quality products, thoroughly tested to meet our strict standards.',
    },
    {
      title: 'Fast Delivery',
      icon: <ShippingIcon sx={{ fontSize: 40 }} />,
      description: 'We partner with reliable shipping providers to ensure your orders arrive quickly and safely.',
    },
    {
      title: 'Customer Support',
      icon: <SupportIcon sx={{ fontSize: 40 }} />,
      description: 'Our dedicated support team is always ready to assist you with any questions or concerns.',
    },
    {
      title: 'Secure Shopping',
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      description: 'Your personal information and payment details are protected with advanced security measures.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link href="/" passHref>
          <MuiLink underline="hover" color="inherit">
            Home
          </MuiLink>
        </Link>
        <Typography color="text.primary">About Us</Typography>
      </Breadcrumbs>

      {/* Hero Section */}
      <Paper 
        sx={{ 
          p: { xs: 3, md: 6 }, 
          mb: 6, 
          position: 'relative', 
          bgcolor: 'primary.dark', 
          color: 'white',
          overflow: 'hidden',
          borderRadius: 2,
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Our Story
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: '70%', mb: 4 }}>
            We started with a simple mission: to make quality products accessible to everyone.
            Today, we're proud to serve customers worldwide with the same dedication to excellence.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            component={Link}
            href="/contact"
            sx={{ fontWeight: 'bold' }}
          >
            Get In Touch
          </Button>
        </Box>
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            width: '40%', 
            height: '100%',
            display: { xs: 'none', md: 'block' },
            opacity: 0.2,
          }}
        >
          <Image 
            src="/images/about-hero.jpg" 
            alt="About Us" 
            fill 
            style={{ objectFit: 'cover' }} 
          />
        </Box>
      </Paper>

      {/* Our Mission */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative', height: 400, borderRadius: 2, overflow: 'hidden' }}>
            <Image 
              src="/images/our-mission.jpg" 
              alt="Our Mission" 
              fill 
              style={{ objectFit: 'cover' }} 
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h2" gutterBottom>
            Our Mission
          </Typography>
          <Divider sx={{ mb: 3, width: 100, borderWidth: 2, borderColor: 'primary.main' }} />
          <Typography variant="body1" paragraph>
            At our core, we believe in providing exceptional products that enhance our customers' lives. 
            We are committed to sourcing sustainable materials, working with ethical manufacturers, and 
            delivering outstanding value.
          </Typography>
          <Typography variant="body1" paragraph>
            Our team is passionate about curating a selection that combines quality, style, and functionality. 
            We personally test every product we sell to ensure it meets our high standards before it reaches your doorstep.
          </Typography>
          <Typography variant="body1">
            As we grow, we remain dedicated to our founding principles: exceptional customer service, 
            honest business practices, and building lasting relationships with our community of customers.
          </Typography>
        </Grid>
      </Grid>

      {/* Company Values */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Our Values
        </Typography>
        <Divider sx={{ mb: 4, mx: 'auto', width: 100, borderWidth: 2, borderColor: 'primary.main' }} />
        
        <Grid container spacing={3}>
          {companyValues.map((value, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper 
                sx={{ 
                  p: 3, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {value.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {value.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {value.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Our Team */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Meet Our Team
        </Typography>
        <Divider sx={{ mb: 4, mx: 'auto', width: 100, borderWidth: 2, borderColor: 'primary.main' }} />
        
        <Grid container spacing={3}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Avatar 
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      border: '4px solid',
                      borderColor: 'primary.light',
                    }}
                    alt={member.name}
                    src={member.image}
                  />
                </Box>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle2" color="primary.main" gutterBottom>
                    {member.position}
                  </Typography>
                  <Divider sx={{ my: 2, width: 50, mx: 'auto' }} />
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Milestones */}
      <Paper sx={{ p: 4, mb: 6, bgcolor: '#f8f9fa' }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Our Journey
        </Typography>
        <Divider sx={{ mb: 4, mx: 'auto', width: 100, borderWidth: 2, borderColor: 'primary.main' }} />
        
        <Box sx={{ position: 'relative' }}>
          {/* Vertical line */}
          <Box sx={{ 
            position: 'absolute', 
            left: { xs: 20, md: '50%' }, 
            transform: { md: 'translateX(-50%)' },
            width: 2, 
            height: '100%', 
            bgcolor: 'primary.light',
            zIndex: 0,
          }} />
          
          {/* Milestones */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* 2015 */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
                <Paper sx={{ p: 3, position: 'relative' }}>
                  <Typography variant="h6" gutterBottom>
                    2015
                  </Typography>
                  <Typography variant="body2">
                    Founded our company with just 5 products and a small online store.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }} />
            </Grid>
            
            {/* 2017 */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }} />
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    2017
                  </Typography>
                  <Typography variant="body2">
                    Expanded our product line to over 100 items and moved to a larger warehouse.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            
            {/* 2019 */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    2019
                  </Typography>
                  <Typography variant="body2">
                    Launched our mobile app and reached 10,000 customers worldwide.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }} />
            </Grid>
            
            {/* 2021 */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }} />
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    2021
                  </Typography>
                  <Typography variant="body2">
                    Opened our first physical store and introduced our premium product line.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            
            {/* 2023 */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    2023
                  </Typography>
                  <Typography variant="body2">
                    Celebrating our continued growth with over 50,000 customers and international shipping to 30+ countries.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }} />
            </Grid>
          </Box>
        </Box>
      </Paper>

      {/* Connect With Us */}
      <Paper 
        sx={{ 
          p: 4, 
          textAlign: 'center', 
          bgcolor: 'primary.main', 
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          Connect With Us
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: 700, mx: 'auto' }}>
          Follow us on social media to stay updated with our latest products, promotions, and company news.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" color="inherit" startIcon={<FacebookIcon />}>
            Facebook
          </Button>
          <Button variant="contained" color="inherit" startIcon={<TwitterIcon />}>
            Twitter
          </Button>
          <Button variant="contained" color="inherit" startIcon={<InstagramIcon />}>
            Instagram
          </Button>
          <Button variant="contained" color="inherit" startIcon={<LinkedInIcon />}>
            LinkedIn
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}