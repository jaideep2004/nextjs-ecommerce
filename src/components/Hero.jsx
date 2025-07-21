'use client';

import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundImage: 'url(/images/hero-bg.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(10, 0),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
  },
}));

const CategoryCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 200,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  color: 'white',
  zIndex: 2,
  textAlign: 'center',
  fontWeight: 'bold',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
}));

const Hero = () => {
  // This would be replaced with actual category data
  const categories = [
    {
      id: 1,
      name: 'Punjabi Suits',
      image: '/images/category-suits.jpg',
      slug: 'punjabi-suits',
    },
    {
      id: 2,
      name: 'Turbans',
      image: '/images/category-turbans.jpg',
      slug: 'turbans',
    },
    {
      id: 3,
      name: 'Accessories',
      image: '/images/category-accessories.jpg',
      slug: 'accessories',
    },
  ];

  return (
    <Box sx={{ mb: 6 }}>
      <HeroSection>
        <Container maxWidth="lg">
          <ContentBox>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
              }}
            >
              Authentic Punjabi Attire
            </Typography>
            <Typography
              variant="h5"
              sx={{ mb: 4, maxWidth: { md: '70%' }, opacity: 0.9 }}
            >
              Discover our exquisite collection of traditional Punjabi suits and turbans
              crafted with premium fabrics and authentic designs.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                href="/products"
                sx={{
                  bgcolor: '#8D6E63',
                  '&:hover': { bgcolor: '#6D4C41' },
                  px: 4,
                  py: 1.5,
                }}
              >
                Shop Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                href="/about"
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  px: 4,
                  py: 1.5,
                }}
              >
                Learn More
              </Button>
            </Box>
          </ContentBox>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ mt: -5, position: 'relative', zIndex: 3 }}>
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} md={4} key={category.id}>
              <CategoryCard
                component={Link}
                href={`/category/${category.slug}`}
                sx={{
                  backgroundImage: `url(${category.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'block',
                  textDecoration: 'none',
                }}
              >
                <CategoryTitle variant="h5">{category.name}</CategoryTitle>
              </CategoryCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;