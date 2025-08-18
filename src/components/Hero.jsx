'use client';

import { Box, Typography, Button, Container, Grid, useTheme } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import AnimatedRing from './AnimatedRing';

// Keyframe animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: theme.palette.background.default,
  color: theme.palette.text.primary,
  overflow: 'hidden',
  minHeight: '85vh',
  display: 'flex',
  alignItems: 'stretch',
  padding: 0,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '100%',
    height: '200%',
    background: `radial-gradient(circle, ${theme.palette.mode === 'dark' ? 'rgba(162, 146, 120, 0.1)' : 'rgba(162, 146, 120, 0.05)'} 0%, ${theme.palette.background.default} 70%)`,
    zIndex: 1,
  },
}));

const GoldText = styled('span')(({ theme }) => ({
  background: 'linear-gradient(90deg, #a29278, #d4c19c, #a29278)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundSize: '200% auto',
  animation: `${shimmer} 4s linear infinite`,
  fontWeight: 600,
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  width: '100%',
  maxWidth: '100%',
  margin: 0,
  padding: 0,
}));

const TextContent = styled(Box)(({ theme }) => ({
  flex: '0 0 50%',
  zIndex: 2,
  textAlign: 'left',
  color: theme.palette.text.primary,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(8),
  [theme.breakpoints.down('md')]: {
    flex: '1 1 100%',
    padding: theme.spacing(4, 2),
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  flex: '0 0 50%',
  height: '100%',
  minHeight: '85vh',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
  },
}));

const HeroImage = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  transformStyle: 'preserve-3d',
  border: `1px solid ${theme.palette.divider}`,
  '& img': {
    width: '100%',
    height: 'auto',
    transition: 'transform 0.5s ease',
  },
  '&:hover img': {
    transform: 'scale(1.02)',
  },
}));

const DecorationCircle = styled(Box)({
  position: 'absolute',
  borderRadius: '50%',
  zIndex: -1,
  '&.circle-1': {
    width: 300,
    height: 300,
    top: '-100px',
    left: '-100px',
    background: 'radial-gradient(circle, rgba(162, 146, 120, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
    animation: `${rotate} 60s linear infinite`,
  },
  '&.circle-2': {
    width: 500,
    height: 500,
    bottom: '-200px',
    right: '-200px',
    background: 'radial-gradient(circle, rgba(162, 146, 120, 0.05) 0%, rgba(0, 0, 0, 0) 70%)',
    animation: `${rotate} 80s linear infinite reverse`,
  },
});

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  padding: '12px 32px',
  borderRadius: 0,
  textTransform: 'uppercase',
  fontWeight: 500,
  letterSpacing: '1px',
  fontSize: '0.9rem',
  transition: 'all 0.3s ease',
  '&.primary': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    border: `1px solid ${theme.palette.primary.main}`,
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? '#b8a98a' : '#8a7a5e',
      borderColor: theme.palette.mode === 'dark' ? '#b8a98a' : '#8a7a5e',
    },
  },
  '&.secondary': {
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`,
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.05)',
      borderColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.5)' 
        : 'rgba(0, 0, 0, 0.5)',
    },
  },
}));

const ShapeTop = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '40%',
  height: '40%',
  background: theme.palette.mode === 'dark' 
    ? 'radial-gradient(circle, rgba(129, 140, 248, 0.15) 0%, rgba(99, 102, 241, 0) 70%)' 
    : 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0) 70%)',
  borderRadius: '0 0 0 100%',
  zIndex: 1,
}));

const Hero = () => {
  const theme = useTheme();
  const imageRef = useRef(null);
  const controls = useAnimation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Sample product images - replace with your actual image paths
  const productImages = [
    '/images/puns1.png',
    '/images/puns2.png',  
    '/images/puns34.png',  
    // '/images/puns3.png',  
  ];
  
  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [productImages.length]);

  // Handle mouse move effect for image tilt
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!imageRef.current) return;
      
      const { left, top, width, height } = imageRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      imageRef.current.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${y * -10}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
      if (imageRef.current) {
        imageRef.current.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale3d(1, 1, 1)';
      }
    };

    const currentRef = imageRef.current;
    if (currentRef) {
      currentRef.addEventListener('mousemove', handleMouseMove);
      currentRef.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('mousemove', handleMouseMove);
        currentRef.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Animation variants for text elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <HeroSection>
      <AnimatedRing />
      <DecorationCircle className="circle-1" />
      <DecorationCircle className="circle-2" />
      
      <HeroContent>
        <TextContent>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Typography
                variant="overline"
                sx={{
                  color: '#a29278',
                  letterSpacing: 2,
                  fontWeight: 500,
                  display: 'block',
                  mb: 2,
                }}
              >
                New Collection 2024
              </Typography>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  fontWeight: 700,
                  mb: 2,
                  lineHeight: 1.1,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.5px',
                  color: 'inherit',
                  fontFamily: "Playfair Display", 
                  whiteSpace: 'nowrap',
                }}
              >
                India <GoldText>Inspired</GoldText>
              </Typography>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 400,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  color: 'text.secondary',
                  mb: 4,
                  maxWidth: '90%',
                  lineHeight: 1.4,
                }}
              >
                Discover our <GoldText>exclusive collection</GoldText> of premium ethnic wear that blends tradition with contemporary style.
              </Typography>
              <ButtonGroup>
                <PrimaryButton 
                  variant="contained" 
                  className="primary"
                  component={Link}
                  href="/shop"
                >
                  Shop Now
                </PrimaryButton>
                <PrimaryButton 
                  variant="outlined" 
                  className="secondary"
                  component={Link}
                  href="/collections"
                >
                  View Collection
                </PrimaryButton>
              </ButtonGroup>
            </motion.div>
          </motion.div>
        </TextContent>
        <ImageContainer>
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            style={{ 
              width: '100%', 
              height: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Image
              src={productImages[currentImageIndex]}
              alt={`Fashion ${currentImageIndex + 1}`}
              fill
              priority
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                width: '100%',
                height: '100%',
              }}
            />
            {/* Decorative elements */}
            <Box 
              sx={{
                position: 'absolute',
                top: '10%',
                right: '10%',
                width: '100px',
                height: '100px',
                border: '2px solid rgba(162, 146, 120, 0.3)',
                borderRadius: '50%',
                animation: `${rotate} 20s linear infinite`,
              }}
            />
            <Box 
              sx={{
                position: 'absolute',
                bottom: '10%',
                left: '10%',
                width: '60px',
                height: '60px',
                border: '1px solid rgba(162, 146, 120, 0.3)',
                borderRadius: '50%',
                animation: `${rotate} 30s linear infinite reverse`,
              }}
            />
          </motion.div>
        </ImageContainer>
      </HeroContent>
    </HeroSection>
  );
};

export default Hero;