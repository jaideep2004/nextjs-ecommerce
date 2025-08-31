
'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Divider, 
  Grid, 
  Tabs, 
  Tab, 
  Paper, 
  Card, 
  CardContent, 
  IconButton,
  Button,
  Avatar,
  Rating,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { 
  LocalShipping, 
  Support, 
  Payment, 
  AssignmentReturn,
  ArrowForward,
  ArrowBack,
  ArrowRightAlt,
  LocalMall,
  Favorite,
  Star
} from '@mui/icons-material';
import axios from 'axios';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/products/ProductGrid';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CircularProgress } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Custom countdown hook
const useCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 130,
    hours: 22,
    minutes: 30,
    seconds: 55
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return {
    days: String(timeLeft.days).padStart(2, '0'),
    hours: String(timeLeft.hours).padStart(2, '0'),
    minutes: String(timeLeft.minutes).padStart(2, '0'),
    seconds: String(timeLeft.seconds).padStart(2, '0')
  };
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// 4th Dimensional Banner Animations
const dimensionalRotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const cosmicPulse = keyframes`
  0%, 100% { 
    transform: scale(1) rotate(0deg);
    opacity: 0.3;
  }
  50% { 
    transform: scale(1.2) rotate(180deg);
    opacity: 0.6;
  }
`;

const shimmerLine = keyframes`
  0% { 
    background-position: -200% 0;
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% { 
    background-position: 200% 0;
    opacity: 0.5;
  }
`;

const floatChip = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
  }
  50% { 
    transform: translateY(-5px) rotate(1deg);
  }
`;

const shimmerSweep = keyframes`
  0% { left: -100%; }
  100% { left: 100%; }
`;

const sparkle = keyframes`
  0%, 100% { 
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% { 
    transform: scale(1.2) rotate(180deg);
    opacity: 0.8;
  }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const textReveal = keyframes`
  0%, 80% { opacity: 0; }
  85%, 95% { opacity: 0.7; }
  100% { opacity: 0; }
`;

const pulseGlow = keyframes`
  0%, 100% { 
    transform: scale(1);
    filter: brightness(1);
  }
  50% { 
    transform: scale(1.05);
    filter: brightness(1.2);
  }
`;

const discountAura = keyframes`
  0%, 100% { 
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.6;
  }
`;

const countdownPulse = keyframes`
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  50% { 
    transform: scale(1.02);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  }
`;

const timerShimmer = keyframes`
  0% { left: -100%; }
  100% { left: 100%; }
`;

const buttonFloat = keyframes`
  0%, 100% { 
    transform: translateY(0px);
  }
  50% { 
    transform: translateY(-2px);
  }
`;

const floatElement1 = keyframes`
  0%, 100% { 
    transform: translate(0px, 0px) rotate(0deg);
  }
  33% { 
    transform: translate(10px, -10px) rotate(120deg);
  }
  66% { 
    transform: translate(-5px, 5px) rotate(240deg);
  }
`;

const floatElement2 = keyframes`
  0%, 100% { 
    transform: translate(0px, 0px) rotate(0deg);
  }
  25% { 
    transform: translate(-8px, -8px) rotate(90deg);
  }
  50% { 
    transform: translate(8px, -4px) rotate(180deg);
  }
  75% { 
    transform: translate(-4px, 8px) rotate(270deg);
  }
`;

const percentageSpin = keyframes`
  0% { 
    transform: rotate(0deg) scale(1);
  }
  50% { 
    transform: rotate(180deg) scale(1.05);
  }
  100% { 
    transform: rotate(360deg) scale(1);
  }
`;

const rotateBorder = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const imageFloat = keyframes`
  0%, 100% { 
    transform: perspective(1000px) rotateY(-5deg) rotateX(2deg) translateY(0px);
  }
  50% { 
    transform: perspective(1000px) rotateY(-3deg) rotateX(1deg) translateY(-10px);
  }
`;

const imageAura = keyframes`
  0% { 
    transform: rotate(0deg) scale(1);
    opacity: 0.6;
  }
  50% { 
    transform: rotate(180deg) scale(1.1);
    opacity: 0.8;
  }
  100% { 
    transform: rotate(360deg) scale(1);
    opacity: 0.6;
  }
`;

const timerGlow = keyframes`
  0%, 100% { 
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  50% { 
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const numberPulse = keyframes`
  0%, 100% { 
    transform: scale(1);
    filter: brightness(1);
  }
  50% { 
    transform: scale(1.05);
    filter: brightness(1.1);
  }
`;

const discountColorShift = keyframes`
  0% { 
    background-position: 0% 50%;
    transform: scale(1);
  }
  50% { 
    background-position: 100% 50%;
    transform: scale(1.02);
  }
  100% { 
    background-position: 0% 50%;
    transform: scale(1);
  }
`;

const shopNowPulse = keyframes`
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(162, 146, 120, 0.4);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(162, 146, 120, 0);
  }
`;

const naturalSunshine = keyframes`
  0% { 
    filter: brightness(1.02) contrast(1.05) saturate(1.05);
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(162, 146, 120, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 15px 15px 30px rgba(255, 215, 0, 0.03);
  }
  25% { 
    filter: brightness(1.06) contrast(1.08) saturate(1.08);
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.18),
      0 0 0 1px rgba(162, 146, 120, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      inset -15px 15px 30px rgba(255, 215, 0, 0.04);
  }
  50% { 
    filter: brightness(1.08) contrast(1.1) saturate(1.1);
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(162, 146, 120, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      inset -15px -15px 30px rgba(255, 215, 0, 0.05);
  }
  75% { 
    filter: brightness(1.06) contrast(1.08) saturate(1.08);
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.18),
      0 0 0 1px rgba(162, 146, 120, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      inset 15px -15px 30px rgba(255, 215, 0, 0.04);
  }
  100% { 
    filter: brightness(1.02) contrast(1.05) saturate(1.05);
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(162, 146, 120, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 15px 15px 30px rgba(255, 215, 0, 0.03);
  }
`;

const sunlightOverlay = keyframes`
  0% { 
    background: linear-gradient(45deg, 
      rgba(255, 215, 0, 0.03) 0%, 
      transparent 30%, 
      transparent 70%, 
      rgba(255, 215, 0, 0.01) 100%
    );
    transform: translateX(-50%) translateY(-50%) rotate(0deg);
  }
  25% { 
    background: linear-gradient(135deg, 
      rgba(255, 215, 0, 0.04) 0%, 
      transparent 30%, 
      transparent 70%, 
      rgba(255, 215, 0, 0.02) 100%
    );
    transform: translateX(-50%) translateY(-50%) rotate(90deg);
  }
  50% { 
    background: linear-gradient(225deg, 
      rgba(255, 215, 0, 0.05) 0%, 
      transparent 30%, 
      transparent 70%, 
      rgba(255, 215, 0, 0.03) 100%
    );
    transform: translateX(-50%) translateY(-50%) rotate(180deg);
  }
  75% { 
    background: linear-gradient(315deg, 
      rgba(255, 215, 0, 0.04) 0%, 
      transparent 30%, 
      transparent 70%, 
      rgba(255, 215, 0, 0.02) 100%
    );
    transform: translateX(-50%) translateY(-50%) rotate(270deg);
  }
  100% { 
    background: linear-gradient(45deg, 
      rgba(255, 215, 0, 0.03) 0%, 
      transparent 30%, 
      transparent 70%, 
      rgba(255, 215, 0, 0.01) 100%
    );
    transform: translateX(-50%) translateY(-50%) rotate(360deg);
  }
`;

const goldSparkle = keyframes`
  0% { 
    opacity: 0;
    transform: translateY(120px) translateX(-20px) scale(0) rotate(0deg);
  }
  15% { 
    opacity: 0.8;
    transform: translateY(80px) translateX(10px) scale(1) rotate(72deg);
  }
  35% { 
    opacity: 1;
    transform: translateY(40px) translateX(-5px) scale(1.1) rotate(144deg);
  }
  55% { 
    opacity: 0.9;
    transform: translateY(0px) translateX(15px) scale(1.2) rotate(216deg);
  }
  75% { 
    opacity: 0.6;
    transform: translateY(-40px) translateX(-10px) scale(0.9) rotate(288deg);
  }
  90% { 
    opacity: 0.3;
    transform: translateY(-80px) translateX(5px) scale(0.6) rotate(324deg);
  }
  100% { 
    opacity: 0;
    transform: translateY(-120px) translateX(-15px) scale(0) rotate(360deg);
  }
`;

const goldFloat = keyframes`
  0% { 
    transform: translateY(0px) translateX(0px) rotate(0deg);
    opacity: 0.4;
  }
  12.5% { 
    transform: translateY(-8px) translateX(12px) rotate(45deg);
    opacity: 0.7;
  }
  25% { 
    transform: translateY(-18px) translateX(18px) rotate(90deg);
    opacity: 1;
  }
  37.5% { 
    transform: translateY(-25px) translateX(8px) rotate(135deg);
    opacity: 0.9;
  }
  50% { 
    transform: translateY(-28px) translateX(-5px) rotate(180deg);
    opacity: 0.8;
  }
  62.5% { 
    transform: translateY(-25px) translateX(-18px) rotate(225deg);
    opacity: 0.9;
  }
  75% { 
    transform: translateY(-18px) translateX(-22px) rotate(270deg);
    opacity: 1;
  }
  87.5% { 
    transform: translateY(-8px) translateX(-12px) rotate(315deg);
    opacity: 0.7;
  }
  100% { 
    transform: translateY(0px) translateX(0px) rotate(360deg);
    opacity: 0.4;
  }
`;

const goldDrift = keyframes`
  0% { 
    transform: translateY(0px) translateX(0px) scale(1) rotate(0deg);
    opacity: 0.5;
  }
  20% { 
    transform: translateY(-30px) translateX(25px) scale(1.1) rotate(72deg);
    opacity: 0.8;
  }
  40% { 
    transform: translateY(-45px) translateX(35px) scale(1.2) rotate(144deg);
    opacity: 1;
  }
  60% { 
    transform: translateY(-35px) translateX(20px) scale(1.1) rotate(216deg);
    opacity: 0.9;
  }
  80% { 
    transform: translateY(-15px) translateX(-10px) scale(1.05) rotate(288deg);
    opacity: 0.7;
  }
  100% { 
    transform: translateY(0px) translateX(0px) scale(1) rotate(360deg);
    opacity: 0.5;
  }
`;

const testimonialFloat = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotateX(0deg) rotateY(0deg);
    box-shadow: 
      0 20px 40px rgba(162, 146, 120, 0.1),
      0 0 0 1px rgba(162, 146, 120, 0.05);
  }
  25% { 
    transform: translateY(-8px) rotateX(2deg) rotateY(1deg);
    box-shadow: 
      0 25px 50px rgba(162, 146, 120, 0.15),
      0 0 0 1px rgba(162, 146, 120, 0.08);
  }
  50% { 
    transform: translateY(-12px) rotateX(0deg) rotateY(2deg);
    box-shadow: 
      0 30px 60px rgba(162, 146, 120, 0.2),
      0 0 0 1px rgba(162, 146, 120, 0.1);
  }
  75% { 
    transform: translateY(-8px) rotateX(-2deg) rotateY(1deg);
    box-shadow: 
      0 25px 50px rgba(162, 146, 120, 0.15),
      0 0 0 1px rgba(162, 146, 120, 0.08);
  }
`;

const testimonialSlide = keyframes`
  0% { 
    opacity: 0;
    transform: translateX(100%) scale(0.9);
  }
  10% { 
    opacity: 1;
    transform: translateX(0%) scale(1);
  }
  90% { 
    opacity: 1;
    transform: translateX(0%) scale(1);
  }
  100% { 
    opacity: 0;
    transform: translateX(-100%) scale(0.9);
  }
`;

const dimensionalGlow = keyframes`
  0%, 100% { 
    background: linear-gradient(135deg, 
      rgba(162, 146, 120, 0.05) 0%, 
      rgba(212, 192, 158, 0.08) 50%,
      rgba(162, 146, 120, 0.05) 100%
    );
  }
  50% { 
    background: linear-gradient(135deg, 
      rgba(162, 146, 120, 0.08) 0%, 
      rgba(212, 192, 158, 0.12) 50%,
      rgba(162, 146, 120, 0.08) 100%
    );
  }
`;

const textShimmer = keyframes`
  0% { 
    background-position: -200% center;
  }
  100% { 
    background-position: 200% center;
  }
`;

const marqueeScroll = keyframes`
  0% { 
    transform: translateX(100%);
  }
  100% { 
    transform: translateX(-100%);
  }
`;

// Newsletter 4th Dimensional Animations
const cosmicOrbit = keyframes`
  0% { 
    transform: rotate(0deg) translateX(100px) rotate(0deg);
    opacity: 0.3;
  }
  25% { 
    opacity: 0.8;
  }
  50% { 
    transform: rotate(180deg) translateX(100px) rotate(-180deg);
    opacity: 1;
  }
  75% { 
    opacity: 0.8;
  }
  100% { 
    transform: rotate(360deg) translateX(100px) rotate(-360deg);
    opacity: 0.3;
  }
`;

const dimensionalPulse = keyframes`
  0%, 100% { 
    transform: scale(1) rotateZ(0deg);
    filter: hue-rotate(0deg) brightness(1);
  }
  25% { 
    transform: scale(1.05) rotateZ(90deg);
    filter: hue-rotate(90deg) brightness(1.1);
  }
  50% { 
    transform: scale(1.1) rotateZ(180deg);
    filter: hue-rotate(180deg) brightness(1.2);
  }
  75% { 
    transform: scale(1.05) rotateZ(270deg);
    filter: hue-rotate(270deg) brightness(1.1);
  }
`;

const newsletterFloat = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotateX(0deg) rotateY(0deg);
  }
  25% { 
    transform: translateY(-15px) rotateX(5deg) rotateY(2deg);
  }
  50% { 
    transform: translateY(-25px) rotateX(0deg) rotateY(5deg);
  }
  75% { 
    transform: translateY(-15px) rotateX(-5deg) rotateY(2deg);
  }
`;

const energyWave = keyframes`
  0% { 
    transform: translateX(-100%) scaleY(1);
    opacity: 0;
  }
  50% { 
    transform: translateX(0%) scaleY(1.2);
    opacity: 0.8;
  }
  100% { 
    transform: translateX(100%) scaleY(1);
    opacity: 0;
  }
`;

const holographicShimmer = keyframes`
  0% { 
    background-position: -200% 0;
    filter: hue-rotate(0deg);
  }
  50% { 
    filter: hue-rotate(180deg);
  }
  100% { 
    background-position: 200% 0;
    filter: hue-rotate(360deg);
  }
`;

const particleFloat = keyframes`
  0% { 
    transform: translate(0px, 0px) rotate(0deg);
    opacity: 0;
  }
  10% { 
    opacity: 1;
  }
  90% { 
    opacity: 1;
  }
  100% { 
    transform: translate(-100px, -100px) rotate(360deg);
    opacity: 0;
  }
`;

const inputGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(162, 146, 120, 0.3);
  }
  50% { 
    box-shadow: 0 0 40px rgba(212, 192, 158, 0.6);
  }
`;

const buttonPulse = keyframes`
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(162, 146, 120, 0.7);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 0 0 20px rgba(162, 146, 120, 0);
  }
`;

// About Us Animation Keyframes
const float = keyframes`
  0%, 100% { 
    transform: translateY(0px);
  }
  50% { 
    transform: translateY(-10px);
  }
`;

const slideInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Styled components
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
  position: 'relative',
  display: 'inline-block',
  animation: `${fadeIn} 0.8s ease forwards`,
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 80,
    height: 4,
    borderRadius: 2,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  }
}));

const CategoryCard = styled(Paper)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
  cursor: 'pointer',
  height: 250,
  transition: 'all 0.3s ease',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    '& .category-image': {
      transform: 'scale(1.1)',
    },
    '& .category-content': {
      background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%)',
    }
  },
}));

const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  animation: `${fadeIn} 0.5s ease forwards`,
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 16px 30px rgba(0, 0, 0, 0.15)',
    '& .product-image': {
      transform: 'scale(1.08)',
    },
    '& .product-actions': {
      opacity: 1,
      transform: 'translateY(0)',
    }
  }
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

const SliderArrow = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 2,
  background: 'white',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    background: theme.palette.primary.main,
    color: 'white',
  }
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: 70,
  height: 70,
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.contrastText,
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  '&:before': {
    content: '"""',
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: '5rem',
    color: theme.palette.mode === 'light' 
      ? 'rgba(0, 0, 0, 0.05)' 
      : 'rgba(255, 255, 255, 0.05)',
    fontFamily: 'Georgia, serif',
  }
}));

// Category Section Styles
const CategorySection = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(8, 0),
  background: '#0a0a0a',
  overflow: 'hidden',
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  position: 'relative',
  paddingBottom: theme.spacing(3),
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '2px',
    background: '#a29278',
  },
}));

const StyledCategoryCard = styled(Card)(({ theme }) => {
  // Get the featured state from data attribute via shouldForwardProp
  return {
    position: 'relative',
    width: '100%',
    height: '400px', // Set a consistent height, will be adjusted via CSS
    maxHeight: '400px',
    minWidth: '300px',
    borderRadius: '8px',
    overflow: 'hidden',
    background: '#121212',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    '&[data-featured="true"]': {
      height: '500px',
    },
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
      '& .category-image': {
        transform: 'scale(1.05)'
      }
    },
  };
});

const CategoryContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(4),
  color: '#fff',
  zIndex: 2,
  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
  pointerEvents: 'none',
  '& button': {
    pointerEvents: 'auto'
  }
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.8rem',
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  textTransform: 'uppercase',
  letterSpacing: '1px',
  background: 'white',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const StyledCategoryBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '24px',
  right: '24px',
  padding: theme.spacing(0.5, 2),
  borderRadius: '20px',
  background: 'rgba(162, 146, 120, 0.2)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(162, 146, 120, 0.3)',
  color: '#fff',
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  zIndex: 3,
}));

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [activeProducts, setActiveProducts] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [categories, setCategories] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const res = await axios.get('/api/categories');
        // Update to match the API response structure
        setCategories(res.data.data?.categories || []);
        setCategoriesError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategoriesError('Failed to load categories. Please try again later.');
      } finally {
        setCategoriesLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    // Initialize AOS animation library
    AOS.init({
      duration: 800,
      once: true,
      mirror: false,
      offset: 50,
      easing: 'ease-out-cubic'
    });
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch all product groups in parallel
        const [featuredRes, newArrivalsRes, saleRes, trendingRes] = await Promise.all([
          axios.get('/api/products?featured=true&limit=8'),
          axios.get('/api/products?sort=createdAt:desc&limit=8'),
          axios.get('/api/products?discount[gt]=0&limit=8'),
          axios.get('/api/products?sort=rating:desc&limit=6'),
        ]);

        // Handle different response structures
        const featuredData = featuredRes.data.products || featuredRes.data.data?.products || [];
        const newArrivalsData = newArrivalsRes.data.products || newArrivalsRes.data.data?.products || [];
        const saleData = saleRes.data.products || saleRes.data.data?.products || [];
        const trendingData = trendingRes.data.products || trendingRes.data.data?.products || [];
        
        setFeaturedProducts(featuredData);
        setNewArrivals(newArrivalsData);
        setSaleProducts(saleData);
        setTrendingProducts(trendingData);
        setActiveProducts(featuredData); // Set initial active products
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false); 
      }
    };
    
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories');
        const categoriesData = res.data.categories || res.data.data?.categories || [];
        setCategories(categoriesData.slice(0, 6)); // Limit to 6 categories
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    
    // Fetch wishlist items if user is logged in
    const fetchWishlist = async () => {
      if (user) {
        try {
          const res = await axios.get('/api/wishlist');
          const items = res.data.wishlist || [];
          setWishlistItems(items.map(item => item.product || { _id: item.productId }));
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        }
      }
    };

    fetchProducts();
    fetchCategories();
    fetchWishlist();
  }, [user]);
  
  const handleAddToCart = (product) => {
    addToCart(product, 1, '', '', user);
  };
  
  const handleAddToWishlist = async (product) => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login?redirect=/');
      return;
    }
    
    try {
      await axios.post('/api/wishlist', { productId: product._id });
      setWishlistItems(prev => [...prev, product]);
    } catch (error) {
      console.error('Add to wishlist failed:', error);
    }
  };
  
  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axios.delete(`/api/wishlist/${productId}`);
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
    } catch (error) {
      console.error('Remove from wishlist failed:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    switch (newValue) {
      case 0:
        setActiveProducts(featuredProducts);
        break;
      case 1:
        setActiveProducts(newArrivals);
        break;
      case 2:
        setActiveProducts(saleProducts);
        break;
    }
  };

  // Sample features
  const features = [
    { 
      icon: <LocalShipping fontSize="large" />, 
      title: "Free Shipping", 
      description: "You get your items delivered without any extra cost." 
    },
    { 
      icon: <Support fontSize="large" />, 
      title: "Great Support 24/7", 
      description: "Our customer support team is available around the clock." 
    },
    { 
      icon: <AssignmentReturn fontSize="large" />, 
      title: "Return Available", 
      description: "Making it easy to return any items if you're not satisfied." 
    },
    { 
      icon: <Payment fontSize="large" />, 
      title: "Secure Payment", 
      description: "Shop with confidence knowing that our payment system is secure." 
    }
  ];

  // Sample testimonials
  const testimonials = [
    {
      text: "The quality of the Punjabi suits I ordered was exceptional. The fabric, stitching, and design all exceeded my expectations. I received so many compliments at the wedding!",
      name: "Priya Sharma",
      location: "London, UK",
      rating: 5,
      image: "/images/testimonials/testimonial-1.jpg",
    },
    {
      text: "I ordered a turban for a special event and it arrived ahead of schedule. The color was vibrant and exactly as shown in the photos. The customer service was excellent too!",
      name: "Harjeet Singh",
      location: "Birmingham, UK",
      rating: 5,
      image: "/images/testimonials/testimonial-2.jpg",
    },
    {
      text: "Beautiful designs and premium quality fabric. I've ordered multiple times and have never been disappointed. The accessories are perfect for completing traditional looks.",
      name: "Simran Kaur",
      location: "Manchester, UK",
      rating: 4.5,
      image: "/images/testimonials/testimonial-3.jpg",
    },
  ];

  const handleNextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Slider settings for trending products
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: isMobile ? 1 : isTablet ? 2 : 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: !isMobile,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
    pauseOnHover: true,
    swipeToSlide: true,
    touchThreshold: 10,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        }
      }
    ]
  };

  // Custom arrows for slider
  function NextArrow(props) {
    const { onClick } = props;
    return (
      <SliderArrow
        onClick={onClick}
        sx={{ right: -20 }}
        aria-label="next slide"
      >
        <ArrowForward />
      </SliderArrow>
    );
  }
  
  function PrevArrow(props) {
    const { onClick } = props;
    return (
      <SliderArrow
        onClick={onClick}
        sx={{ left: -20 }}
        aria-label="previous slide"
      >
        <ArrowBack />
      </SliderArrow>
    );
  }

  // Sample categories for the chip filters
  const categoriesList = [
    "All", "Women", "Men", "Suits", "Turbans", "Dupattas", "Kurtas", "Accessories"
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Hero />
      
       {/* Continuous Marquee Strip */}
       <Box sx={{ 
        py: 2,
        background: '#2c2c2c',
        overflow: 'hidden',
        position: 'relative',
        borderTop: '3px solid #a29278',
        borderBottom: '3px solid #a29278',
        mt: 10,
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          animation: `${marqueeScroll} 20s linear infinite`,
          whiteSpace: 'nowrap'
        }}>
          {/* Repeat the marquee items multiple times for continuous effect */}
          {[...Array(6)].map((_, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  mx: 4
                }}
              >
                TURBANS
              </Typography>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%',
                background: '#a29278',
                mx: 4
              }} />
              <Typography 
                variant="h4" 
                sx={{ 
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  mx: 4
                }}
              >
                SUITS
              </Typography>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%',
                background: '#a29278',
                mx: 4
              }} />
              <Typography 
                variant="h4" 
                sx={{ 
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  mx: 4
                }}
              >
                ACCESSORIES
              </Typography>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%',
                background: '#a29278',
                mx: 4
              }} />
              <Typography 
                variant="h4" 
                sx={{ 
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  mx: 4
                }}
              >
                PHULKARI SUITS
              </Typography>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%',
                background: '#a29278',
                mx: 4
              }} />
            </Box>
          ))}
        </Box>
      </Box>


      {/* Trending Products Carousel Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="subtitle1" 
              color="primary" 
              fontWeight="bold" 
              sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Most Popular
            </Typography>
            <ShimmerText 
              variant="h3" 
              component="h2" 
              fontWeight="bold" 
              sx={{ 
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }} 
              data-aos="fade-up" 
              data-aos-delay="200"
            >
              Trending Products
            </ShimmerText>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }} data-aos="fade-up" data-aos-delay="300">
              Discover our most popular and highest-rated products that customers love
            </Typography>
          </Box>
          
          <Box sx={{ position: 'relative', px: { xs: 2, md: 6 }, py: 2 }}>
            {!loading && !error && trendingProducts.length > 0 ? (
              <Slider {...sliderSettings}>
                {trendingProducts.map((product) => (
                  <Box key={product._id} sx={{ p: 2 }}>
                    <ProductCard>
                      <Box sx={{ position: 'relative', paddingTop: '100%', overflow: 'hidden' }}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                          style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                          className="product-image"
                        />
                        {product.discount > 0 && (
                          <Chip
                            label={`${product.discount}% OFF`}
                            color="error"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 10,
                              right: 10,
                              fontWeight: 'bold',
                              zIndex: 1,
                            }}
                          />
                        )}
                        <Box 
                          className="product-actions"
                          sx={{ 
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            bgcolor: 'rgba(0,0,0,0.7)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            justifyContent: 'center',
                            p: 1.5,
                            opacity: 0,
                            transform: 'translateY(20px)',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <Button
                            variant="contained"
                            startIcon={<LocalMall />}
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToCart(product);
                            }}
                            sx={{
                              borderRadius: '50px',
                              fontWeight: 'bold',
                              bgcolor: 'white',
                              color: 'primary.main',
                              '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'white',
                              }
                            }}
                          >
                            Add to Cart
                          </Button>
                        </Box>
                      </Box>
                      
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Rating value={product.rating || 0} precision={0.5} size="small" readOnly />
                          <IconButton 
                            size="small" 
                            color={wishlistItems.some(item => item._id === product._id) ? "error" : "default"}
                            onClick={(e) => {
                              e.preventDefault();
                              wishlistItems.some(item => item._id === product._id)
                                ? handleRemoveFromWishlist(product._id)
                                : handleAddToWishlist(product);
                            }}
                          >
                            <Favorite fontSize="small" />
                          </IconButton>
                        </Box>
                        
                        <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <Typography 
                            variant="subtitle1" 
                            component="h3" 
                            fontWeight="bold"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              height: '2.5em',
                            }}
                          >
                            {product.name}
                          </Typography>
                        </Link>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Typography variant="h6" component="span" fontWeight="bold" color="primary.main">
                            ${product.discount > 0 
                              ? (product.price - (product.price * product.discount / 100)).toFixed(2)
                              : product.price.toFixed(2)
                            }
                          </Typography>
                          {product.discount > 0 && (
                            <Typography 
                              variant="body2" 
                              component="span" 
                              sx={{ ml: 1, textDecoration: 'line-through', color: 'text.secondary' }}
                            >
                              ${product.price.toFixed(2)}
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </ProductCard>
                  </Box>
                ))}
              </Slider>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                {loading ? (
                  <Typography>Loading trending products...</Typography>
                ) : error ? (
                  <Typography color="error">{error}</Typography>
                ) : (
                  <Typography>No trending products found</Typography>
                )}
              </Box>
            )}
          </Box>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button 
              variant="outlined" 
              component={Link} 
              href="/products" 
              endIcon={<ArrowRightAlt />}
              sx={{
                borderRadius: '50px',
                px: 4,
                py: 1,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>
      
      {/* Categories Section */}
      <CategorySection>
        <Container maxWidth="lg">
          <SectionHeader data-aos="fade-up">
            <Typography 
              variant="overline" 
              sx={{ 
                color: '#a29278', 
                letterSpacing: '3px',
                display: 'block',
                mb: 1,
              }}
            >
              Our Collections
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                color: '#fff', 
                fontWeight: 400,
                mb: 2,
                [theme.breakpoints.down('sm')]: {
                  fontSize: '2rem',
                },
              }}
            >
              Shop by Category
            </Typography>
          </SectionHeader>

          {/* Dynamic Categories Grid */}
          {categoriesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
              <CircularProgress sx={{ color: '#a29278' }} />
            </Box>
          ) : categoriesError ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="error">{categoriesError}</Typography>
              <Button 
                variant="outlined" 
                sx={{ 
                  mt: 2,
                  borderRadius: 0,
                  px: 4,
                  py: 1.5,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  borderColor: '#a29278',
                  color: '#a29278',
                  '&:hover': {
                    borderColor: '#8b7355',
                    color: '#8b7355',
                    background: 'transparent'
                  }
                }}
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </Box>
          ) : (
            <Grid container spacing={4} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
              {categories?.map((category, index) => {
                const isFeatured = index === 0;
                const hasImage = category?.image;
                
                return (
                  <Grid 
                    item 
                    xs={12} 
                    md={isFeatured ? 8 : 4} 
                    key={category?._id || index} 
                    data-aos="fade-up" 
                    data-aos-delay={100 + (index * 100)}
                  >
                    <StyledCategoryCard 
                      component={Link}
                      href={`/products?category=${encodeURIComponent(category.name)}`}
                      data-featured={isFeatured}
                    >
                      {/* Category Image */}
                      <Box 
                        className="category-image"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                          ...(hasImage ? {
                            backgroundImage: `url(${category.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: '#121212',
                          } : {
                            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          })
                        }}
                      >
                        {!hasImage && (
                          <Typography 
                            variant="h3" 
                            sx={{ 
                              color: '#a29278',
                              opacity: 0.5,
                              textTransform: 'uppercase',
                              letterSpacing: '2px',
                            }}
                          >
                            {category?.name?.charAt(0) || '?'}
                          </Typography>
                        )}
                      </Box>

                      {/* Gradient Overlay */}

                      {/* Category Badge */}
                      <StyledCategoryBadge>
                        {category?.name || 'Collection'}
                      </StyledCategoryBadge>

                      {/* Category Content */}
                      <CategoryContent className="category-content">
                        <CategoryTitle variant="h4">
                          {category?.name || 'New Collection'}
                        </CategoryTitle>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'rgba(255,255,255,0.8)',
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {category?.description || 'Explore our exclusive collection'}
                        </Typography>
                        <Button 
                          variant="contained" 
                          sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 0,
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            background: '#a29278',
                            color: 'white',
                            boxShadow: 'none',
                            minWidth: '140px',
                            mt: 2,
                            '&:hover': {
                              background: '#8b7355',
                              boxShadow: 'none'
                            }
                          }}
                        >
                          Shop Now
                        </Button>   
                      </CategoryContent>
                    </StyledCategoryCard>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </CategorySection>
      
     
      
      {/* Products Section with Tabs */}
      <Box sx={{ py: 8, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#121212' : '#ffffff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="subtitle1" color="primary" fontWeight="bold" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1 }} data-aos="fade-up" data-aos-delay="100">
              Our Products
            </Typography>
            <ShimmerText 
              variant="h3" 
              component="h2" 
              fontWeight="bold" 
              sx={{ 
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }} 
              data-aos="fade-up" 
              data-aos-delay="200"
            >
              Featured Collections
            </ShimmerText>
            
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="scrollable"
              scrollButtons="auto"
              data-aos="fade-up"
              data-aos-delay="300"
              sx={{ 
                mb: 4,
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: 1.5,
                },
                '& .MuiTab-root': {
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  textTransform: 'none',
                  minWidth: 120,
                  '&.Mui-selected': {
                    color: 'primary.main',
                  }
                }
              }}
            >
              <Tab label="Best Sellers" />
              <Tab label="New Arrivals" />
              <Tab label="Sale Items" />
            </Tabs>
          </Box>
          
          <Box sx={{ position: 'relative' }}>
            <ProductGrid 
              products={activeProducts} 
              loading={loading} 
              error={error}
              wishlistItems={wishlistItems}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              onRemoveFromWishlist={handleRemoveFromWishlist}
              enhanced={true}
              gridProps={{
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}
            />
          </Box>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button 
              variant="outlined" 
              component={Link} 
              href="/products" 
              endIcon={<ArrowRightAlt />}
              sx={{
                borderRadius: '50px',
                px: 4,
                py: 1,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>
      
      {/* 4th Dimensional Animated Banner Section */}
      <Box sx={{ 
        py: 12, 
        position: 'relative',
        overflow: 'hidden',
        background: `
          radial-gradient(circle at 20% 80%, rgba(162, 146, 120, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(212, 192, 158, 0.06) 0%, transparent 50%),
          linear-gradient(135deg, 
            rgba(248, 246, 243, 0.98) 0%, 
            rgba(255, 253, 250, 1) 100%
          )
        `,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            conic-gradient(from 0deg at 25% 25%, 
              rgba(162, 146, 120, 0.03) 0deg,
              rgba(212, 192, 158, 0.05) 90deg,
              rgba(255, 215, 0, 0.02) 180deg,
              rgba(162, 146, 120, 0.04) 270deg,
              rgba(162, 146, 120, 0.03) 360deg
            )
          `,
          animation: 'dimensionalRotate 20s linear infinite',
          zIndex: 1
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `
            radial-gradient(circle, 
              rgba(162, 146, 120, 0.08) 0%, 
              transparent 70%
            )
          `,
          animation: 'cosmicPulse 8s ease-in-out infinite',
          zIndex: 1
        }
      }}>
        {/* Floating Gold Elements - Large Particles */}
        {[...Array(8)].map((_, i) => {
          const size = Math.random() * 6 + 4;
          const animationType = ['goldFloat', 'goldDrift', 'goldSparkle'][i % 3];
          const duration = 8 + Math.random() * 6;
          const delay = Math.random() * 4;
          
          return (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                background: `
                  radial-gradient(circle, 
                    rgba(255, 215, 0, 0.9) 0%, 
                    rgba(212, 192, 158, 0.7) 40%,
                    rgba(255, 215, 0, 0.3) 70%,
                    transparent 100%
                  )
                `,
                borderRadius: '50%',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `${animationType} ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite ${delay}s`,
                zIndex: 1,
                pointerEvents: 'none',
                filter: 'blur(0.3px)',
                boxShadow: `
                  0 0 ${size * 2}px rgba(255, 215, 0, 0.4),
                  inset 0 0 ${size}px rgba(255, 255, 255, 0.2)
                `
              }}
            />
          );
        })}
        
        {/* Medium Floating Particles */}
        {[...Array(10)].map((_, i) => {
          const size = Math.random() * 4 + 2;
          const animationType = ['goldFloat', 'goldDrift'][i % 2];
          const duration = 6 + Math.random() * 4;
          const delay = Math.random() * 3;
          
          return (
            <Box
              key={`medium-${i}`}
              sx={{
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                background: `
                  radial-gradient(circle, 
                    rgba(255, 215, 0, 0.8) 0%, 
                    rgba(212, 192, 158, 0.5) 60%,
                    transparent 100%
                  )
                `,
                borderRadius: '50%',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `${animationType} ${duration}s cubic-bezier(0.4, 0.0, 0.6, 1) infinite ${delay}s`,
                zIndex: 1,
                pointerEvents: 'none',
                filter: 'blur(0.2px)',
                boxShadow: `0 0 ${size * 1.5}px rgba(255, 215, 0, 0.3)`
              }}
            />
          );
        })}
        
        {/* Small Sparkle Elements */}
        {[...Array(15)].map((_, i) => {
          const duration = 4 + Math.random() * 3;
          const delay = Math.random() * 5;
          
          return (
            <Box
              key={`sparkle-${i}`}
              sx={{
                position: 'absolute',
                width: '1.5px',
                height: '1.5px',
                background: 'rgba(255, 215, 0, 0.95)',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `goldSparkle ${duration}s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite ${delay}s`,
                zIndex: 1,
                pointerEvents: 'none',
                borderRadius: '50%',
                boxShadow: `
                  0 0 4px rgba(255, 215, 0, 0.9),
                  0 0 8px rgba(255, 215, 0, 0.4)
                `
              }}
            />
          );
        })}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={{ xs: 3, md: 6 }} alignItems="center" justifyContent="center" sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
            {/* Left Side - Animated Content */}
            <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 1 } }}>
              <Box sx={{ 
                textAlign: { xs: 'center', md: 'left' },
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-20px',
                  left: { xs: '50%', md: '-20px' },
                  transform: { xs: 'translateX(-50%)', md: 'none' },
                  width: '60px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #a29278, #d4c09e, #a29278)',
                  borderRadius: '2px',
                  animation: 'shimmerLine 3s ease-in-out infinite'
                }
              }}>
                {/* Animated Chip */}
                <Box sx={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 4,
                  px: 3,
                  py: 1.5,
                  borderRadius: '50px',
                  background: `
                    linear-gradient(135deg, 
                      rgba(162, 146, 120, 0.1) 0%, 
                      rgba(212, 192, 158, 0.15) 50%,
                      rgba(162, 146, 120, 0.1) 100%
                    )
                  `,
                  border: '2px solid transparent',
                  backgroundClip: 'padding-box',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: 'floatChip 4s ease-in-out infinite',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent)',
                    animation: 'shimmerSweep 2s ease-in-out infinite'
                  }
                }}>
                  <Box sx={{ 
                    fontSize: '1.2rem',
                    animation: 'sparkle 2s ease-in-out infinite'
                  }}>
                    ✨
                  </Box>
                  <Typography sx={{ 
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: '#2c2c2c',
                    letterSpacing: '0.5px'
                  }}>
                    Deal of the Week
                  </Typography>
                </Box>

                {/* Main Heading with 4D Effects */}
                <Typography 
                  variant="h1" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3.2rem' },
                    lineHeight: 1.1,
                    mb: 2,
                    background: `
                      linear-gradient(135deg, 
                        #1a1a1a 0%, 
                        #2c2c2c 25%,
                        #8b7355 50%,
                        #2c2c2c 75%,
                        #1a1a1a 100%
                      )
                    `,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundSize: '300% 300%',
                    animation: 'gradientShift 4s ease-in-out infinite',
                    textShadow: '0 0 30px rgba(162, 146, 120, 0.3)',
                    position: 'relative',
                    '&::after': {
                      content: '"Hurry Up! Offer ends in."',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(90deg, #d4c09e, #a29278)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      opacity: 0,
                      animation: 'textReveal 6s ease-in-out infinite'
                    }
                  }}
                >
                  Hurry Up! Offer ends in.
                </Typography>

                {/* Discount Text */}
                <Typography 
                  variant="h2"
                  sx={{ 
                    fontWeight: 900,
                    fontSize: { xs: '1.6rem', sm: '2rem', md: '2.8rem' },
                    mb: 3,
                    background: '#b98844',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundSize: '300% 300%',
                    textShadow: '0 0 20px rgba(162, 146, 120, 0.3)',
                    animation: 'discountColorShift 3s ease-in-out infinite',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '120%',
                      height: '120%',
                      // background: '#b98844',
                      borderRadius: '50%',
                      animation: 'discountAura 3s ease-in-out infinite',
                      zIndex: -1
                    }
                  }}
                >
                  UP TO 80% OFF
                </Typography>

                {/* Animated Countdown Timer */}
                <Box sx={{ 
                  display: 'flex',
                  gap: { xs: 1, md: 1.5 },
                  mb: 4,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  flexWrap: { xs: 'wrap', sm: 'nowrap' }
                }}>
                  {[
                    { value: useCountdown().days, label: 'Days' },
                    { value: useCountdown().hours, label: 'Hours' },
                    { value: useCountdown().minutes, label: 'Min' },
                    { value: useCountdown().seconds, label: 'Sec' }
                  ].map((item, index) => (
                    <Box 
                      key={item.label}
                      sx={{ 
                        textAlign: 'center',
                        minWidth: { xs: '55px', md: '65px' },
                        p: { xs: 1, md: 1.5 },
                        borderRadius: '12px',
                        background: `
                          linear-gradient(145deg, 
                            rgba(255, 255, 255, 0.95) 0%,
                            rgba(248, 246, 243, 0.9) 100%
                          )
                        `,
                        border: '1px solid rgba(162, 146, 120, 0.15)',
                        boxShadow: `
                          0 6px 20px rgba(0, 0, 0, 0.08),
                          inset 0 1px 0 rgba(255, 255, 255, 0.9)
                        `,
                        animation: `countdownPulse 2s ease-in-out infinite ${index * 0.3}s`,
                        position: 'relative',
                        overflow: 'hidden',
                        transform: 'translateZ(0)',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(162, 146, 120, 0.25), transparent)',
                          animation: `timerShimmer 4s ease-in-out infinite ${index * 0.8}s`
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '80%',
                          height: '80%',
                          borderRadius: '50%',
                          background: 'radial-gradient(circle, rgba(162, 146, 120, 0.05) 0%, transparent 70%)',
                          animation: `timerGlow 3s ease-in-out infinite ${index * 0.4}s`,
                          zIndex: -1
                        }
                      }}
                    >
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 800,
                          color: '#2c2c2c',
                          fontSize: { xs: '1.2rem', md: '1.5rem' },
                          lineHeight: 1,
                          mb: 0.5,
                          background: 'linear-gradient(135deg, #2c2c2c 0%, #8b7355 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          animation: `numberPulse 2s ease-in-out infinite ${index * 0.2}s`
                        }}
                      >
                        {item.value}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#8b7355',
                          fontSize: { xs: '0.6rem', md: '0.7rem' },
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.8px'
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* CTA Button */}
                <Button 
                  variant="contained" 
                  size="large" 
                  sx={{ 
                    px: 4, 
                    py: 1.5, 
                    borderRadius: 0,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    background: '#a29278',
                    color: 'white',
                    boxShadow: 'none',
                    minWidth: '140px',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: 'shopNowPulse 2s ease-in-out infinite',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                      animation: 'shimmerSweep 3s ease-in-out infinite'
                    },
                    '&:hover': {
                      background: '#8b7355',
                      boxShadow: 'none',
                      transform: 'scale(1.1)',
                      animation: 'shopNowPulse 1s ease-in-out infinite'
                    },
                    transition: 'all 0.3s ease'
                  }}
                  component={Link}
                  href="/products"
                >
                  Shop Now
                </Button>
              </Box>
            </Grid>

            {/* Right Side - Animated Image */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', order: { xs: 2, md: 2 }, mt: { xs: 2, md: 0 } }}>
              <Box sx={{ 
                position: 'relative',
                textAlign: 'center',
                height: { xs: '500px', sm: '500px', md: '500px' },
                width: { xs: '500px', sm: '500px', md: '600px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Floating Background Elements */}
                <Box sx={{
                  position: 'absolute',
                  top: '10%',
                  right: '10%',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, rgba(162, 146, 120, 0.1), rgba(212, 192, 158, 0.15))',
                  animation: 'floatElement1 6s ease-in-out infinite',
                  zIndex: 1
                }} />
                
                <Box sx={{
                  position: 'absolute',
                  bottom: '15%',
                  left: '15%',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(212, 192, 158, 0.12))',
                  animation: 'floatElement2 8s ease-in-out infinite',
                  zIndex: 1
                }} />


                {/* Main Image Container */}
                <Box sx={{ 
                  position: 'relative',
                  transform: 'perspective(1000px) rotateY(-5deg) rotateX(2deg)',
                  animation: 'imageFloat 4s ease-in-out infinite',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-10px',
                    left: '-10px',
                    right: '-10px',
                    bottom: '-10px',
                    borderRadius: '24px',
                    background: `
                      conic-gradient(from 0deg, 
                        rgba(162, 146, 120, 0.2) 0deg,
                        rgba(212, 192, 158, 0.3) 90deg,
                        rgba(255, 215, 0, 0.15) 180deg,
                        rgba(162, 146, 120, 0.25) 270deg,
                        rgba(162, 146, 120, 0.2) 360deg
                      )
                    `,
                    animation: 'imageAura 8s linear infinite',
                    zIndex: -1
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '120%',
                    height: '120%',
                    borderRadius: '20px',
                    background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.05) 0%, transparent 30%, transparent 70%, rgba(255, 215, 0, 0.02) 100%)',
                    animation: 'sunlightOverlay 8s ease-in-out infinite',
                    zIndex: 1,
                    pointerEvents: 'none'
                  },
                  '& img': {
                    borderRadius: '20px',
                    animation: 'naturalSunshine 6s ease-in-out infinite',
                    position: 'relative',
                    zIndex: 2
                  }
                }}>
                  <Image 
                    src="/images/bnr1.png" 
                    alt="Special Offer - Couple Shopping" 
                    width={600} 
                    height={480} 
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      
       {/* About Us Section */}
       <Box sx={{ 
        py: { xs: 6, md: 12 }, 
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 3, md: 6 }} alignItems="center" sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
            {/* Left Side - Images Grid */}
            <Grid item xs={12} md={6} sx={{ 
              minWidth: { xs: '100%', sm: '360px', md: '440px' },
              maxWidth: { xs: '100%', md: '50%' },
              order: { xs: 2, md: 1 }
            }}>
              <Box sx={{ 
                position: 'relative',
                height: { xs: 300, sm: 400, md: 600 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
                maxWidth: '100%'
              }}>
                {/* Top Row - Two Images */}
                <Box sx={{ display: 'flex', gap: 2, height: '48%' }}>
                  <Box sx={{ 
                    flex: 1,
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative',
                    transform: 'perspective(1000px) rotateY(-5deg)',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'perspective(1000px) rotateY(0deg) scale(1.02)',
                      boxShadow: '0 20px 40px rgba(162, 146, 120, 0.3)'
                    }
                  }}>
                    <Box
                      component="img"
                      src="/images/abt1.png"
                      alt="Fashion Model 1"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'brightness(1.1) contrast(1.1)'
                      }}
                    />
                  </Box>
                  <Box sx={{ 
                    flex: 1,
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative',
                    transform: 'perspective(1000px) rotateY(5deg)',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'perspective(1000px) rotateY(0deg) scale(1.02)',
                      boxShadow: '0 20px 40px rgba(162, 146, 120, 0.3)'
                    }
                  }}>
                    <Box
                      component="img"
                      src="/images/abt2.png"
                      alt="Fashion Model 2"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'brightness(1.1) contrast(1.1)'
                      }}
                    />
                  </Box>
                </Box>

                {/* Bottom Row - Single Large Image */}
                <Box sx={{ 
                  height: '48%',
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  transform: 'perspective(1000px) rotateX(2deg)',
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'perspective(1000px) rotateX(0deg) scale(1.02)',
                    boxShadow: '0 25px 50px rgba(162, 146, 120, 0.4)'
                  }
                }}>
                  <Box
                    component="img"
                    src="/images/abt3.png"
                    alt="Fashion Collection"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(1.1) contrast(1.1)'
                    }}
                  />
                </Box>

                {/* Floating Stats Badge */}
                <Box sx={{
                  position: 'absolute',
                  bottom: 20,
                  right: 20,
                  bgcolor: '#a29278',
                  borderRadius: '50%',
                  width: 120,
                  height: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  transform: 'perspective(1000px) rotateZ(0deg)',
                  animation: 'float 3s ease-in-out infinite',
                  boxShadow: '0 15px 30px rgba(162, 146, 120, 0.4)',
                  zIndex: 10
                }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1 }}>
                    25
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center' }}>
                    Year's Experience
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right Side - Content */}
            <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
              <Box sx={{ pl: { md: 4 }, textAlign: { xs: 'center', md: 'left' } }} >
                {/* Section Tag */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                 justifyContent: { xs: 'center', md: 'left' },
                  mb: 3,
                  transform: 'translateX(0)',
                  animation: 'slideInRight 1s ease-out'
                }}>
                  <Box sx={{
                    width: 8,
                    height: 8,
                    bgcolor: '#a29278',
                    borderRadius: '50%',
                    mr: 2
                  }} />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#a29278',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      letterSpacing: '1px',
                      textTransform: 'uppercase'
                    }}
                  >
                    About us
                  </Typography>
                </Box>

                {/* Main Heading */}
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontWeight: 700,
                    color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : '#2c2c2c',
                    mb: 4,
                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.75rem' },
                    lineHeight: 1.3,
                    transform: 'translateY(0)',
                    animation: 'slideInUp 1s ease-out 0.2s both'
                  }}
                >
                  Traditional Punjabi Attire With Contemporary Style.
                </Typography>

                {/* Description */}
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: (theme) => theme.palette.mode === 'dark' ? '#b0b0b0' : '#666',
                    fontSize: { xs: '0.95rem', md: '1rem' },
                    lineHeight: 1.6,
                    mb: 4,
                    transform: 'translateY(0)',
                    animation: 'slideInUp 1s ease-out 0.4s both'
                  }}
                >
                  There are many variations of passages of Lorem Ipsum available, but the our majority have 
                  suffered alteration in some form, by injected humour, or randomised words which don't look 
                  even slightly believable you are going to.
                </Typography>

                {/* Features List */}
                <Box sx={{ mb: 6 }}>
                  {[
                    'We are provide 100% best products',
                    'Flexible and affordable price',
                    'All products is imported'
                  ].map((feature, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 2,
                        transform: 'translateX(0)',
                        animation: `slideInLeft 1s ease-out ${0.6 + index * 0.1}s both`
                      }}
                    >
                      <Box sx={{
                        width: 6,
                        height: 6,
                        bgcolor: '#a29278',
                        borderRadius: '50%',
                        mr: 3,
                        flexShrink: 0
                      }} />
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: (theme) => theme.palette.mode === 'dark' ? '#c0c0c0' : '#555',
                          fontSize: '1rem',
                          fontWeight: 500
                        }}
                      >
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Team Member Card */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 3,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2a2a2a' : '#f8f8f8',
                  borderRadius: 3,
                  border: (theme) => theme.palette.mode === 'dark' 
                    ? '1px solid rgba(162, 146, 120, 0.3)' 
                    : '1px solid rgba(162, 146, 120, 0.1)',
                  transform: 'translateY(0)',
                  animation: 'slideInUp 1s ease-out 1s both',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 30px rgba(162, 146, 120, 0.2)'
                  }
                }}>
                  <Avatar 
                    src="/images/team-member.jpg"
                    sx={{ 
                      width: 60, 
                      height: 60,
                      mr: 3,
                      border: '3px solid #a29278'
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : '#2c2c2c',
                        mb: 0.5
                      }}
                    >
                      INDIA INSPIRED
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#a29278',
                        fontWeight: 500
                      }}
                    >
                      INDIA INSPIRED
                    </Typography>
                  </Box>
                  <Box sx={{
                    width: 2,
                    height: 40,
                    bgcolor: '#a29278',
                    mx: 3
                  }} />
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 300,
                      color: '#a29278',
                      fontStyle: 'italic',
                      fontSize: '2rem'
                    }}
                  >
                    INDIA
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Background Decorative Elements */}
        <Box sx={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: 200,
          height: 200,
          bgcolor: 'rgba(162, 146, 120, 0.05)',
          borderRadius: '50%',
          animation: 'float 4s ease-in-out infinite reverse'
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '20%',
          left: '-3%',
          width: 150,
          height: 150,
          bgcolor: 'rgba(162, 146, 120, 0.03)',
          borderRadius: '50%',
          animation: 'float 5s ease-in-out infinite'
        }} />
      </Box>



      
      {/* 4th Dimensional Premium Testimonials Section */}
      <Box sx={{ 
        py: { xs: 8, md: 15 },
        pt: '0px !important',
        position: 'relative',
        overflow: 'hidden',
        background: (theme) => theme.palette.mode === 'dark' ? '#0f0f0f' : '#ffffff'
      }}>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={{ xs: 4, md: 0 }} alignItems="center" justifyContent="center" sx={{ minHeight: { xs: 'auto', md: '600px' } }}>
            
            {/* Left Side - Heading Container (45%) */}
            <Grid item xs={12} md={5.4} sx={{ order: { xs: 1, md: 1 } }}>
              <Box sx={{ 
                pr: { xs: 0, md: 6 },
                mb: { xs: 4, md: 0 },
                textAlign: { xs: 'center', md: 'left' },
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-30px',
                  left: { xs: '50%', md: '-20px' },
                  transform: { xs: 'translateX(-50%)', md: 'none' },
                  width: '80px',
                  height: '6px',
                  background: `
                    linear-gradient(90deg, 
                      rgba(162, 146, 120, 0.8) 0%, 
                      rgba(212, 192, 158, 1) 50%,
                      rgba(162, 146, 120, 0.8) 100%
                    )
                  `,
                  borderRadius: '3px',
                  animation: 'textShimmer 3s ease-in-out infinite'
                }
              }}>
                {/* Premium Chip */}
                <Box sx={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 4,
                  mt: 4,
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.5, md: 2 },
                  borderRadius: '60px',
                  background: `
                    linear-gradient(135deg, 
                      rgba(162, 146, 120, 0.08) 0%, 
                      rgba(212, 192, 158, 0.12) 50%,
                      rgba(162, 146, 120, 0.08) 100%
                    )
                  `,
                  border: '2px solid transparent',
                  backgroundClip: 'padding-box',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(212, 192, 158, 0.2), transparent)',
                    animation: 'textShimmer 4s ease-in-out infinite'
                  }
                }}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #a29278, #d4c09e)',
                    animation: 'goldFloat 2s ease-in-out infinite'
                  }} />
                  <Typography variant="body2" sx={{ 
                    fontWeight: 600,
                    color: '#a29278',
                    letterSpacing: '0.5px'
                  }}>
                    Customer Stories
                  </Typography>
                </Box>

                {/* Main Heading */}
                <Typography 
                  variant="h2" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2,
                    mb: 3,
                    background: `
                      linear-gradient(135deg, 
                        #2c2c2c 0%, 
                        #a29278 30%,
                        #2c2c2c 60%,
                        #d4c09e 100%
                      )
                    `,
                    backgroundSize: '300% 300%',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    animation: 'textShimmer 6s ease-in-out infinite',
                    position: 'relative'
                  }}
                >
                  What People Say
                  <br />
                  <Box component="span" sx={{ 
                    background: `
                      linear-gradient(135deg, 
                        #a29278 0%, 
                        #d4c09e 50%,
                        #a29278 100%
                      )
                    `,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                  }}>
                    About Us
                  </Box>
                </Typography>

                {/* Description */}
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    lineHeight: 1.8,
                    color: (theme) => theme.palette.mode === 'dark' ? '#b0b0b0' : '#666',
                    mb: 5,
                    maxWidth: '500px',
                    mx: { xs: 'auto', md: 0 }
                  }}
                >
                  Discover authentic experiences from our valued customers who have transformed their style with our premium collection.
                </Typography>

                {/* Navigation Controls */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 3,
                  justifyContent: { xs: 'center', md: 'flex-start' }
                }}>
                  <IconButton 
                    onClick={handlePrevTestimonial}
                    sx={{ 
                      width: { xs: 50, md: 60 }, 
                      height: { xs: 50, md: 60 },
                      background: `
                        linear-gradient(135deg, 
                          rgba(162, 146, 120, 0.1) 0%, 
                          rgba(212, 192, 158, 0.15) 100%
                        )
                      `,
                      border: '2px solid rgba(162, 146, 120, 0.2)',
                      color: '#a29278',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      '&:hover': { 
                        background: `
                          linear-gradient(135deg, 
                            rgba(162, 146, 120, 0.2) 0%, 
                            rgba(212, 192, 158, 0.25) 100%
                          )
                        `,
                        transform: 'translateY(-3px) scale(1.05)',
                        boxShadow: '0 15px 35px rgba(162, 146, 120, 0.3)'
                      }
                    }}
                  >
                    <ArrowBack />
                  </IconButton>
                  
                  <IconButton 
                    onClick={handleNextTestimonial}
                    sx={{ 
                      width: { xs: 50, md: 60 }, 
                      height: { xs: 50, md: 60 },
                      background: `
                        linear-gradient(135deg, 
                          rgba(162, 146, 120, 0.1) 0%, 
                          rgba(212, 192, 158, 0.15) 100%
                        )
                      `,
                      border: '2px solid rgba(162, 146, 120, 0.2)',
                      color: '#a29278',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      '&:hover': { 
                        background: `
                          linear-gradient(135deg, 
                            rgba(162, 146, 120, 0.2) 0%, 
                            rgba(212, 192, 158, 0.25) 100%
                          )
                        `,
                        transform: 'translateY(-3px) scale(1.05)',
                        boxShadow: '0 15px 35px rgba(162, 146, 120, 0.3)'
                      }
                    }}
                  >
                    <ArrowForward />
                  </IconButton>
                </Box>
              </Box>
            </Grid>

            {/* Right Side - Testimonial Slider (55%) */}
            <Grid item xs={12} md={6.6} sx={{ order: { xs: 2, md: 2 } }}>
              <Box sx={{ 
                position: 'relative',
                height: { xs: '400px', md: '500px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                perspective: '1000px'
              }}>
                {/* Testimonial Card */}
                <Box 
                  key={currentTestimonial}
                  sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: { xs: '100%', md: '600px' },
                    height: { xs: '350px', md: '400px' },
                    background: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
                    borderRadius: '30px',
                    padding: { xs: '30px 20px', md: '50px 40px' },
                    boxShadow: (theme) => theme.palette.mode === 'dark' 
                      ? '0 20px 60px rgba(0, 0, 0, 0.4)' 
                      : '0 20px 60px rgba(162, 146, 120, 0.15)',
                    border: (theme) => theme.palette.mode === 'dark' 
                      ? '1px solid rgba(162, 146, 120, 0.3)' 
                      : '1px solid rgba(162, 146, 120, 0.1)',
                    overflow: 'hidden',
                    animation: 'testimonialSlide 3s ease-in-out',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    zIndex: 100,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: (theme) => theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
                      zIndex: -1,
                      borderRadius: '30px'
                    }
                  }}
                >
                  
                  {/* Stars Rating */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    mb: 4,
                    justifyContent: 'center'
                  }}>
                    {[...Array(5)].map((_, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 20,
                          height: 20,
                          background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                          animation: `goldFloat ${2 + i * 0.2}s ease-in-out infinite ${i * 0.1}s`
                        }}
                      />
                    ))}
                  </Box>

                  {/* Testimonial Text */}
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontSize: { xs: '1rem', md: '1.3rem' },
                      lineHeight: 1.8,
                      fontStyle: 'italic',
                      color: (theme) => theme.palette.mode === 'dark' ? '#e0e0e0' : '#444',
                      textAlign: 'center',
                      mb: 4,
                      position: 'relative',
                      zIndex: 10
                    }}
                  >
                    {testimonials[currentTestimonial].text}
                  </Typography>

                  {/* Customer Info */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    zIndex: 10,
                    position: 'relative'
                  }}>
                    <Avatar 
                      src={testimonials[currentTestimonial].image} 
                      sx={{ 
                        width: 70, 
                        height: 70,
                        border: '3px solid rgba(162, 146, 120, 0.3)',
                        boxShadow: '0 8px 25px rgba(162, 146, 120, 0.2)',
                        zIndex: 10
                      }}
                    />
                    <Box sx={{ textAlign: 'left', zIndex: 10 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : '#2c2c2c',
                          fontSize: '1.2rem',
                          zIndex: 10
                        }}
                      >
                        {testimonials[currentTestimonial].name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#a29278',
                          fontSize: '1rem',
                          fontWeight: 500,
                          zIndex: 10
                        }}
                      >
                        {testimonials[currentTestimonial].location}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 4th Dimensional Newsletter Section */}
      <Box sx={{
        position: 'relative',
        py: 8,
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(162, 146, 120, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(212, 192, 158, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 70%, rgba(162, 146, 120, 0.05) 0%, transparent 50%)
          `,
          zIndex: 1
        }
      }}>
        {/* Floating Cosmic Elements */}
        <Box sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #a29278, #d4c09e)',
          animation: `${cosmicOrbit} 20s linear infinite`,
          zIndex: 2
        }} />
        <Box sx={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #d4c09e, #a29278)',
          animation: `${cosmicOrbit} 25s linear infinite reverse`,
          zIndex: 2
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '15%',
          left: '20%',
          width: 3,
          height: 3,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #a29278, #d4c09e)',
          animation: `${cosmicOrbit} 30s linear infinite`,
          zIndex: 2
        }} />

        {/* Energy Wave Effects */}
        <Box sx={{
          position: 'absolute',
          top: '30%',
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(162, 146, 120, 0.5), transparent)',
          animation: `${energyWave} 8s ease-in-out infinite`,
          zIndex: 2
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '40%',
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(212, 192, 158, 0.3), transparent)',
          animation: `${energyWave} 12s ease-in-out infinite 2s`,
          zIndex: 2
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3 }}>
          <Grid container spacing={0} alignItems="center" justifyContent="center">
            
            {/* Left Side - Newsletter Content */}
            <Grid item xs={12} md={6}>
              <Box sx={{
                pr: { xs: 0, md: 8 },
                textAlign: { xs: 'center', md: 'left' },
                position: 'relative',
                animation: `${newsletterFloat} 6s ease-in-out infinite`
              }}>
                {/* Premium Badge */}
                <Box sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 3,
                  px: 3,
                  py: 1.5,
                  borderRadius: '50px',
                  background: `
                    linear-gradient(135deg, 
                      rgba(162, 146, 120, 0.15) 0%, 
                      rgba(212, 192, 158, 0.2) 50%,
                      rgba(162, 146, 120, 0.15) 100%
                    )
                  `,
                  border: '1px solid rgba(162, 146, 120, 0.3)',
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(212, 192, 158, 0.3), transparent)',
                    animation: `${holographicShimmer} 4s ease-in-out infinite`
                  }
                }}>
                  <Box sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #a29278, #d4c09e)',
                    animation: `${dimensionalPulse} 3s ease-in-out infinite`
                  }} />
                  <Typography variant="body2" sx={{
                    fontWeight: 600,
                    color: '#d4c09e',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    fontSize: '0.8rem'
                  }}>
                    Stay Connected
                  </Typography>
                </Box>

                {/* Main Heading */}
                <Typography
                  variant="h2"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '2rem', md: '2.8rem' },
                    lineHeight: 1.2,
                    mb: 2,
                    background: `
                      linear-gradient(135deg, 
                        #ffffff 0%, 
                        #d4c09e 25%,
                        #ffffff 50%,
                        #a29278 75%,
                        #ffffff 100%
                      )
                    `,
                    backgroundSize: '400% 400%',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    animation: `${holographicShimmer} 8s ease-in-out infinite`,
                    position: 'relative'
                  }}
                >
                  Join Our
                  <br />
                  <Box component="span" sx={{
                    background: `
                      linear-gradient(135deg, 
                        #a29278 0%, 
                        #d4c09e 50%,
                        #a29278 100%
                      )
                    `,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                  }}>
                    Newsletter
                  </Box>
                </Typography>

                {/* Description */}
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    color: 'rgba(255, 255, 255, 0.8)',
                    mb: 4,
                    maxWidth: '450px',
                    mx: { xs: 'auto', md: 0 }
                  }}
                >
                  Be the first to discover our latest collections, exclusive offers, and style inspirations delivered straight to your inbox.
                </Typography>

                {/* Benefits List */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  mb: 4
                }}>
                  {[
                    'Exclusive early access to new collections',
                    'Special subscriber-only discounts',
                    'Style tips and fashion inspiration'
                  ].map((benefit, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        animation: `${slideInLeft} 0.8s ease forwards ${index * 0.2}s`
                      }}
                    >
                      <Box sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #a29278, #d4c09e)',
                        animation: `${dimensionalPulse} 2s ease-in-out infinite ${index * 0.3}s`
                      }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '0.95rem',
                          fontWeight: 500
                        }}
                      >
                        {benefit}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Right Side - Newsletter Form */}
            <Grid item xs={12} md={6}>
              <Box sx={{
                position: 'relative',
                pl: { xs: 0, md: 4 },
                animation: `${newsletterFloat} 6s ease-in-out infinite 1s`
              }}>
                {/* Form Container */}
                <Box sx={{
                  position: 'relative',
                  background: `
                    linear-gradient(135deg, 
                      rgba(255, 255, 255, 0.05) 0%, 
                      rgba(162, 146, 120, 0.1) 50%,
                      rgba(255, 255, 255, 0.05) 100%
                    )
                  `,
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  p: 4,
                  border: '1px solid rgba(162, 146, 120, 0.2)',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                      linear-gradient(45deg, 
                        transparent 30%, 
                        rgba(162, 146, 120, 0.05) 50%, 
                        transparent 70%
                      )
                    `,
                    animation: `${holographicShimmer} 6s ease-in-out infinite`,
                    zIndex: -1
                  }
                }}>
                  {/* Form Title */}
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: '#ffffff',
                      mb: 2,
                      textAlign: 'center',
                      fontSize: { xs: '1.5rem', md: '1.8rem' }
                    }}
                  >
                    Get Exclusive Access
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      textAlign: 'center',
                      mb: 3,
                      fontSize: '0.95rem'
                    }}
                  >
                    Join 10,000+ fashion enthusiasts
                  </Typography>

                  {/* Email Input */}
                  <Box sx={{
                    position: 'relative',
                    mb: 3
                  }}>
                    <Box
                      component="input"
                      type="email"
                      placeholder="Enter your email address"
                      sx={{
                        width: '100%',
                        p: 2.5,
                        borderRadius: '16px',
                        border: '2px solid rgba(162, 146, 120, 0.3)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        color: '#ffffff',
                        fontSize: '1rem',
                        fontWeight: 500,
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        '&::placeholder': {
                          color: 'rgba(255, 255, 255, 0.6)'
                        },
                        '&:focus': {
                          border: '2px solid rgba(162, 146, 120, 0.6)',
                          background: 'rgba(255, 255, 255, 0.15)',
                          animation: `${inputGlow} 2s ease-in-out infinite`
                        }
                      }}
                    />
                  </Box>

                  {/* Subscribe Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      py: 2.5,
                      borderRadius: '16px',
                      background: `
                        linear-gradient(135deg, 
                          #a29278 0%, 
                          #d4c09e 50%,
                          #a29278 100%
                        )
                      `,
                      backgroundSize: '200% 200%',
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      border: 'none',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.4s ease',
                      animation: `${buttonPulse} 3s ease-in-out infinite`,
                      '&:hover': {
                        backgroundPosition: 'right center',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 20px 40px rgba(162, 146, 120, 0.4)'
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        transition: 'left 0.5s ease'
                      },
                      '&:hover::before': {
                        left: '100%'
                      }
                    }}
                  >
                    Subscribe Now
                  </Button>

                  {/* Privacy Notice */}
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      textAlign: 'center',
                      color: 'rgba(255, 255, 255, 0.5)',
                      mt: 2,
                      fontSize: '0.8rem'
                    }}
                  >
                    We respect your privacy. Unsubscribe at any time.
                  </Typography>
                </Box>

                {/* Floating Particles */}
                {[...Array(6)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      position: 'absolute',
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #a29278, #d4c09e)',
                      top: `${20 + i * 15}%`,
                      right: `${10 + i * 5}%`,
                      animation: `${particleFloat} ${8 + i * 2}s ease-in-out infinite ${i * 0.5}s`,
                      opacity: 0.6
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Bottom Decorative Line */}
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `
            linear-gradient(90deg, 
              transparent 0%, 
              rgba(162, 146, 120, 0.5) 25%,
              rgba(212, 192, 158, 0.8) 50%,
              rgba(162, 146, 120, 0.5) 75%,
              transparent 100%
            )
          `,
          animation: `${holographicShimmer} 4s ease-in-out infinite`
        }} />
      </Box>
      
     
     
    </Box>
  );
}
