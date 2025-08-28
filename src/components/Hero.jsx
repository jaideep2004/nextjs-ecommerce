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
  0% { 
    background-position: -200% 0; 
    filter: brightness(1.0);
  }
  50% { 
    background-position: 0% 0; 
    filter: brightness(1.15);
  }
  100% { 
    background-position: 200% 0; 
    filter: brightness(1.0);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const swirl = keyframes`
  0% { 
    transform: rotate(0deg) scale(1);
    filter: hue-rotate(0deg) brightness(1);
  }
  25% { 
    transform: rotate(90deg) scale(1.1);
    filter: hue-rotate(90deg) brightness(1.2);
  }
  50% { 
    transform: rotate(180deg) scale(1.2);
    filter: hue-rotate(180deg) brightness(1.4);
  }
  75% { 
    transform: rotate(270deg) scale(1.1);
    filter: hue-rotate(270deg) brightness(1.2);
  }
  100% { 
    transform: rotate(360deg) scale(1);
    filter: hue-rotate(360deg) brightness(1);
  }
`;

const etherealGlow = keyframes`
  0%, 100% { 
    box-shadow: 
      0 0 20px rgba(162, 146, 120, 0.3),
      0 0 40px rgba(212, 192, 158, 0.2),
      0 0 60px rgba(162, 146, 120, 0.1);
  }
  50% { 
    box-shadow: 
      0 0 30px rgba(162, 146, 120, 0.5),
      0 0 60px rgba(212, 192, 158, 0.3),
      0 0 90px rgba(162, 146, 120, 0.2);
  }
`;

const dimensionalShift = keyframes`
  0% { 
    transform: perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px);
    filter: blur(0px) saturate(1);
  }
  25% { 
    transform: perspective(1000px) rotateX(5deg) rotateY(5deg) translateZ(20px);
    filter: blur(1px) saturate(1.2);
  }
  50% { 
    transform: perspective(1000px) rotateX(0deg) rotateY(10deg) translateZ(40px);
    filter: blur(2px) saturate(1.5);
  }
  75% { 
    transform: perspective(1000px) rotateX(-5deg) rotateY(5deg) translateZ(20px);
    filter: blur(1px) saturate(1.2);
  }
  100% { 
    transform: perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px);
    filter: blur(0px) saturate(1);
  }
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
  [theme.breakpoints.down('md')]: {
    minHeight: '70vh',
    alignItems: 'center',
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: '60vh',
  },
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
  background: 'linear-gradient(90deg, #8b7355, #c4a876, #8b7355)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundSize: '300% auto',
  animation: `${shimmer} 6s ease-in-out infinite`,
  fontWeight: 700,
  textShadow: '1px 1px 4px rgba(139, 115, 85, 0.3)',
  filter: 'drop-shadow(0 1px 2px rgba(139, 115, 85, 0.2))',
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  width: '100%',
  maxWidth: '100%',
  margin: 0,
  padding: 0,
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
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
  fontFamily: '"Cinzel", "Playfair Display", "Times New Roman", serif',
  [theme.breakpoints.down('md')]: {
    flex: '1 1 auto',
    padding: theme.spacing(6, 3),
    textAlign: 'center',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 2),
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  flex: '0 0 50%',
  height: '100%',
  minHeight: '85vh',
  overflow: 'hidden',
  transformStyle: 'preserve-3d',
  [theme.breakpoints.down('md')]: {
    flex: '1 1 auto',
    minHeight: '300px',
    height: '300px',
    marginTop: theme.spacing(2),
    borderRadius: '12px',
    overflow: 'hidden',
    opacity: 1,
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: '250px',
    height: '250px',
  },
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  '&:hover': {
    '& img': {
      transform: 'scale(1.05)',
      filter: 'brightness(1.1) contrast(1.1)',
    },
    '& .swirl-effect': {
      opacity: 1,
      animation: `${swirl} 3s ease-in-out infinite`,
    },
    '& .ethereal-glow': {
      animation: `${etherealGlow} 2s ease-in-out infinite`,
    },
    '& .dimensional-overlay': {
      opacity: 0.8,
      animation: `${dimensionalShift} 4s ease-in-out infinite`,
    },
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
  justifyContent: { xs: 'center', md: 'flex-start' },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(3),
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  padding: { xs: '10px 24px', md: '12px 32px' },
  borderRadius: 0,
  textTransform: 'uppercase',
  fontWeight: 500,
  letterSpacing: '1px',
  fontSize: { xs: '0.8rem', md: '0.9rem' },
  transition: 'all 0.3s ease',
  minWidth: { xs: '140px', sm: 'auto' },
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
                  letterSpacing: { xs: 2, md: 3 },
                  fontWeight: 600,
                  display: 'block',
                  mb: { xs: 1.5, md: 2 },
                  fontFamily: '"Cinzel", "Playfair Display", serif',
                  textTransform: 'uppercase',
                  fontSize: { xs: '0.8rem', md: '0.9rem' },
                  textShadow: '0 2px 4px rgba(162, 146, 120, 0.3)',
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
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem' },
                  fontWeight: 900,
                  mb: 2,
                  lineHeight: { xs: 1.2, md: 1.1 },
                  textTransform: 'uppercase',
                  letterSpacing: { xs: '1px', md: '2px' },
                  color: theme => theme.palette.mode === 'dark' ? '#ffffff' : '#1a1a1a',
                  fontFamily: '"Cinzel", "Playfair Display", serif',
                  whiteSpace: { xs: 'normal', md: 'nowrap' },
                  textShadow: '3px 3px 12px rgba(0, 0, 0, 0.4), 0 0 30px rgba(162, 146, 120, 0.3)',
                  // filter: 'drop-shadow(0 6px 12px rgba(162, 146, 120, 0.4))',
                }}
              >
                India <GoldText>Inspired</GoldText>
              </Typography>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 400,
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.8rem' },
                  color: 'text.secondary',
                  mb: { xs: 3, md: 4 },
                  maxWidth: { xs: '100%', md: '90%' },
                  lineHeight: 1.6,
                  fontFamily: '"Playfair Display", "Georgia", serif',
                  fontStyle: 'italic',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  letterSpacing: '0.5px',
                }}
              >
                Discover our <GoldText>exclusive collection</GoldText> of premium ethnic wear that blends tradition with contemporary style.
              </Typography>
              <ButtonGroup>
                <PrimaryButton 
                  variant="contained" 
                  className="primary"
                  component={Link}
                  href="/products"
                >
                  Shop Now
                </PrimaryButton>
                <PrimaryButton 
                  variant="outlined" 
                  className="secondary"
                  component={Link}
                  href="/products"
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
            initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            transition={{ 
              duration: 1.2,
              ease: [0.4, 0, 0.2, 1],
              opacity: { duration: 0.8 },
              scale: { duration: 1.0 },
              rotateY: { duration: 1.2 }
            }}
            style={{ 
              width: '100%', 
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              transformStyle: 'preserve-3d'
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
            
            {/* Swirling Color Effects */}
            <Box 
              className="swirl-effect"
              sx={{
                position: 'absolute',
                top: '-20%',
                left: '-20%',
                width: '140%',
                height: '140%',
                background: `
                  conic-gradient(
                    from 0deg,
                    transparent 0deg,
                    rgba(162, 146, 120, 0.1) 60deg,
                    rgba(212, 192, 158, 0.15) 120deg,
                    rgba(162, 146, 120, 0.1) 180deg,
                    transparent 240deg,
                    rgba(212, 192, 158, 0.08) 300deg,
                    transparent 360deg
                  )
                `,
                opacity: 0,
                transition: 'opacity 0.5s ease',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
            
            {/* Ethereal Glow Ring */}
            <Box 
              className="ethereal-glow"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '300px',
                height: '300px',
                transform: 'translate(-50%, -50%)',
                border: '2px solid rgba(162, 146, 120, 0.2)',
                borderRadius: '50%',
                opacity: 0.6,
                zIndex: 2,
                pointerEvents: 'none',
              }}
            />
            
            {/* 4th Dimensional Overlay */}
            <Box 
              className="dimensional-overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `
                  radial-gradient(
                    ellipse at center,
                    rgba(162, 146, 120, 0.05) 0%,
                    rgba(212, 192, 158, 0.08) 30%,
                    rgba(162, 146, 120, 0.03) 60%,
                    transparent 100%
                  )
                `,
                opacity: 0,
                transition: 'opacity 0.8s ease',
                pointerEvents: 'none',
                zIndex: 3,
                mixBlendMode: 'overlay',
              }}
            />
            
            {/* Decorative Rotating Elements */}
            <Box 
              sx={{
                position: 'absolute',
                top: '15%',
                right: '15%',
                width: '120px',
                height: '120px',
                border: '3px solid rgba(162, 146, 120, 0.3)',
                borderRadius: '50%',
                animation: `${rotate} 25s linear infinite`,
                zIndex: 4,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '60%',
                  height: '60%',
                  transform: 'translate(-50%, -50%)',
                  border: '2px solid rgba(212, 192, 158, 0.4)',
                  borderRadius: '50%',
                  animation: `${rotate} 15s linear infinite reverse`,
                },
              }}
            />
            
            <Box 
              sx={{
                position: 'absolute',
                bottom: '15%',
                left: '15%',
                width: '80px',
                height: '80px',
                border: '2px solid rgba(162, 146, 120, 0.4)',
                borderRadius: '50%',
                animation: `${rotate} 35s linear infinite reverse`,
                zIndex: 4,
                background: 'rgba(162, 146, 120, 0.05)',
                backdropFilter: 'blur(2px)',
              }}
            />
            
            {/* Floating Particles */}
            <Box 
              sx={{
                position: 'absolute',
                top: '25%',
                left: '25%',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'rgba(162, 146, 120, 0.6)',
                animation: `${float} 4s ease-in-out infinite`,
                zIndex: 5,
              }}
            />
            <Box 
              sx={{
                position: 'absolute',
                top: '70%',
                right: '30%',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'rgba(212, 192, 158, 0.7)',
                animation: `${float} 6s ease-in-out infinite 2s`,
                zIndex: 5,
              }}
            />
            <Box 
              sx={{
                position: 'absolute',
                top: '40%',
                right: '20%',
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                background: 'rgba(162, 146, 120, 0.8)',
                animation: `${float} 5s ease-in-out infinite 1s`,
                zIndex: 5,
              }}
            />
          </motion.div>
          
          {/* Mobile Image Navigation Dots */}
          <Box 
            sx={{ 
              display: { xs: 'flex', md: 'none' },
              justifyContent: 'center',
              gap: 1,
              mt: 2,
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
            }}
          >
            {productImages.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: currentImageIndex === index 
                    ? 'rgba(162, 146, 120, 0.9)' 
                    : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(162, 146, 120, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(162, 146, 120, 0.7)',
                    transform: 'scale(1.2)',
                  },
                }}
              />
            ))}
          </Box>
        </ImageContainer>
      </HeroContent>
    </HeroSection>
  );
};

export default Hero;