'use client';

import { Box, Typography, Button, Container, Grid, Paper, useTheme, Chip } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import Link from 'next/link';
import Image from 'next/image';
import { useThemeContext } from '@/theme';
import { ArrowForward, LocalMall, Explore, Star } from '@mui/icons-material';

// Keyframe animations
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' 
    : 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
  overflow: 'hidden',
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(16),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(20),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '10%',
    left: '5%',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0) 70%)'
      : 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, rgba(99, 102, 241, 0) 70%)',
    zIndex: 1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '15%',
    right: '10%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0) 70%)'
      : 'radial-gradient(circle, rgba(236, 72, 153, 0.05) 0%, rgba(236, 72, 153, 0) 70%)',
    zIndex: 1,
  },
}));

const ShapeTop = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '40%',
  height: '40%',
  background: theme.palette.mode === 'dark' 
    ? 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)' 
    : 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0) 70%)',
  borderRadius: '0 0 0 100%',
  zIndex: 1,
}));

const ShapeBottom = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '50%',
  height: '50%',
  background: theme.palette.mode === 'dark' 
    ? 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(236, 72, 153, 0) 70%)' 
    : 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0) 70%)',
  borderRadius: '0 100% 0 0',
  zIndex: 1,
}));

const ContentBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  animation: `${fadeIn} 1s ease-out`,
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
  },
}));

const HeroImage = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 400,
  width: '100%',
  animation: `${float} 6s ease-in-out infinite`,
  filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.15))',
  [theme.breakpoints.up('md')]: {
    height: 500,
  },
}));

const CategoryCard = styled(Paper)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 3,
  cursor: 'pointer',
  height: 220,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 10px 30px rgba(0, 0, 0, 0.5)'
    : '0 10px 30px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-15px) scale(1.02)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 20px 40px rgba(0, 0, 0, 0.6)'
      : '0 20px 40px rgba(0, 0, 0, 0.15)',
    '& .category-image': {
      transform: 'scale(1.1)',
    },
  },
}));

const CategoryImageOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
  transition: 'background 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)',
  },
  zIndex: 1,
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(3),
  color: 'white',
  zIndex: 2,
  fontWeight: 'bold',
  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const PromoChip = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  padding: theme.spacing(0.75, 2),
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  borderRadius: theme.shape.borderRadius * 5,
  fontWeight: 'bold',
  fontSize: 14,
  zIndex: 2,
  animation: `${pulse} 2s infinite`,
  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
}));

const ShimmerText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.primary.main} 100%)`,
  backgroundSize: '200% 100%',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${shimmer} 3s linear infinite`,
  display: 'inline-block',
}));

const PriceTag = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  background: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(99, 102, 241, 0.1)',
  borderRadius: theme.shape.borderRadius * 5,
  padding: theme.spacing(1, 3),
  marginTop: theme.spacing(4),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  backdropFilter: 'blur(5px)',
}));

const Hero = () => {
  const theme = useTheme();
  const { mode } = useThemeContext();
  
  // This would be replaced with actual category data from API
  const categories = [
    {
      id: 1,
      name: 'Punjabi Suits',
      image: '/images/category-suits.jpg',
      slug: 'punjabi-suits',
      discount: 30,
      description: 'Traditional & modern designs',
    },
    {
      id: 2,
      name: 'Turbans',
      image: '/images/category-turbans.jpg',
      slug: 'turbans',
      discount: 25,
      description: 'Premium quality fabrics',
    },
    {
      id: 3,
      name: 'Accessories',
      image: '/images/category-accessories.jpg',
      slug: 'accessories',
      discount: 15,
      description: 'Complete your traditional look',
    },
  ];

  return (
    <Box>
      <HeroSection>
        <ShapeTop />
        <ShapeBottom />
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <ContentBox data-aos="fade-right" data-aos-delay="100">
                <Chip 
                  label="Best for your occasions" 
                  color="primary" 
                  icon={<Star fontSize="small" />}
                  data-aos="fade-down"
                  data-aos-delay="200"
                  sx={{ 
                    px: 1, 
                    py: 2.5, 
                    mb: 3,
                    fontWeight: 'medium',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                    '& .MuiChip-icon': {
                      color: 'inherit',
                    }
                  }}
                />
                
                <Typography
                  variant="h1"
                  component="h1"
                  data-aos="fade-up"
                  data-aos-delay="300"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
                    lineHeight: 1.1,
                    background: mode === 'dark' 
                      ? 'linear-gradient(90deg, #fff 0%, #f0f0f0 100%)' 
                      : 'linear-gradient(90deg, #1E293B 0%, #334155 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Exclusive Collection
                </Typography>
                
                <ShimmerText
                  variant="h3"
                  data-aos="fade-up"
                  data-aos-delay="400"
                  sx={{ 
                    mb: 3,
                    fontWeight: 'bold',
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                  }}
                >
                  in Our Online Store
                </ShimmerText>
                
                <Typography
                  variant="body1"
                  data-aos="fade-up"
                  data-aos-delay="500"
                  sx={{ 
                    mb: 4, 
                    maxWidth: { md: '90%' }, 
                    fontSize: '1.125rem',
                    lineHeight: 1.7,
                    color: mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                  }}
                >
                  Discover our exquisite collection of traditional Punjabi attire
                  crafted with premium fabrics and authentic designs. Perfect for
                  weddings, festivals, and special occasions.
                </Typography>
                
                <Box 
                  sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: { xs: 'center', md: 'flex-start' } }}
                  data-aos="fade-up"
                  data-aos-delay="600"
                >
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    href="/products"
                    startIcon={<LocalMall />}
                    endIcon={<ArrowForward />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: '50px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
                      boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 30px rgba(99, 102, 241, 0.4)',
                      }
                    }}
                  >
                    Shop Now
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    component={Link}
                    href="/about"
                    startIcon={<Explore />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: '50px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderWidth: 2,
                      borderColor: 'primary.main',
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                      }
                    }}
                  >
                    Learn More
                  </Button>
                </Box>
                
                <PriceTag data-aos="fade-up" data-aos-delay="700">
                  <Typography variant="h4" component="div" fontWeight="bold" color="primary.main">
                    $140.00
                  </Typography>
                  <Typography 
                    variant="body1" 
                    component="span" 
                    sx={{ 
                      ml: 2, 
                      textDecoration: 'line-through',
                      opacity: 0.6
                    }}
                  >
                    $200.00
                  </Typography>
                  <Box
                    sx={{
                      ml: 2,
                      py: 0.5,
                      px: 1.5,
                      bgcolor: 'error.main',
                      color: 'white',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                    }}
                  >
                    30% OFF
                  </Box>
                </PriceTag>
              </ContentBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <HeroImage data-aos="fade-left" data-aos-delay="200">
                <Image
                  src="/images/hero-image.png"
                  alt="Punjabi Attire"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </HeroImage>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ mt: { xs: -6, md: -10 }, position: 'relative', zIndex: 3 }}>
        <Grid container spacing={4}>
          {categories.map((category, index) => (
            <Grid item xs={12} md={4} key={category.id}>
              <CategoryCard 
                component={Link}
                href={`/category/${category.slug}`}
                sx={{ textDecoration: 'none' }}
                data-aos="fade-up"
                data-aos-delay={200 + (index * 100)}
              >
                {category.discount > 0 && (
                  <PromoChip>
                    UP TO {category.discount}% OFF
                  </PromoChip>
                )}
                <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                    style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                    className="category-image"
                  />
                  <CategoryImageOverlay />
                  <CategoryTitle variant="h5">
                    {category.name}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mt: 0.5, 
                        fontWeight: 'normal',
                        opacity: 0.9,
                      }}
                    >
                      {category.description}
                    </Typography>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mt: 1,
                        fontSize: '0.875rem',
                        fontWeight: 'medium',
                      }}
                    >
                      Explore Collection
                      <ArrowForward sx={{ ml: 1, fontSize: '0.875rem' }} />
                    </Box>
                  </CategoryTitle>
                </Box>
              </CategoryCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;