'use client';

import { keyframes, styled, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Keyframes for the ring animation
const rotate = keyframes`
  0% { 
    transform: rotate(0deg) scale(1); 
    opacity: 0.8;
  }
  33% { 
    transform: rotate(120deg) scale(1.15) skewX(5deg); 
    opacity: 0.9;
  }
  66% { 
    transform: rotate(240deg) scale(0.95) skewX(-5deg); 
    opacity: 1;
  }
  100% { 
    transform: rotate(360deg) scale(1); 
    opacity: 0.8;
  }
`;

const float = keyframes`
  0% { 
    transform: translate(0, 0) rotate(0deg);
  }
  25% { 
    transform: translate(5px, -10px) rotate(2deg);
  }
  50% { 
    transform: translate(0, -20px) rotate(0deg);
  }
  75% { 
    transform: translate(-5px, -10px) rotate(-2deg);
  }
  100% { 
    transform: translate(0, 0) rotate(0deg);
  }
`;

const sparkle = keyframes`
  0% { 
    transform: translateY(0) scale(0.3) rotate(0deg);
    opacity: 0;
  }
  20% { 
    opacity: 0.8;
  }
  50% { 
    transform: translateY(-10px) scale(1) rotate(180deg);
    opacity: 1;
  }
  80% {
    opacity: 0.8;
  }
  100% { 
    transform: translateY(-20px) scale(0.3) rotate(360deg);
    opacity: 0;
  }
`;

// Styled components
const RingContainer = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  pointerEvents: 'none',
  zIndex: 1,
});

const Ring = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(212, 193, 156, 0.4)' : 'rgba(162, 146, 120, 0.2)'}`,
  width: '400px',
  height: '400px',
  left: '-150px',
  top: '50%',
  transform: 'translateY(-50%)',
  animation: `${rotate} 30s ease-in-out infinite`,
  opacity: 0.6,
  filter: 'blur(0.5px)',
  boxShadow: `0 0 10px ${theme.palette.mode === 'dark' ? 'rgba(212, 193, 156, 0.15)' : 'rgba(162, 146, 120, 0.1)'}`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    height: '95%',
    borderRadius: '50%',
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(212, 193, 156, 0.3)' : 'rgba(162, 146, 120, 0.15)'}`,
    filter: 'blur(0.3px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    height: '90%',
    borderRadius: '50%',
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(212, 193, 156, 0.15)' : 'rgba(162, 146, 120, 0.1)'}`,
    filter: 'blur(0.3px)',
  },
}));

const Sparkle = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: '4px',
  height: '4px',
  backgroundColor: theme.palette.mode === 'dark' ? '#d4c19c' : '#a29278',
  borderRadius: '50%',
  filter: 'blur(0.5px)',
  animation: `${sparkle} 4s ease-in-out infinite`,
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)',
    filter: 'blur(1px)',
  },
}));

// Generate random position for sparkles with better distribution
const getRandomPosition = (index, total) => {
  // Distribute sparkles in a grid-like pattern
  const row = Math.floor(index / 5);
  const col = index % 5;
  const rowSpacing = 100 / 4; // 4 rows
  const colSpacing = 100 / 6; // 6 columns (5 + 1 for offset)
  
  // Add some randomness but keep the grid structure
  const randomX = (Math.random() - 0.5) * 10;
  const randomY = (Math.random() - 0.5) * 10;
  
  return {
    top: `${Math.min(90, Math.max(10, row * rowSpacing + 5 + randomY))}%`,
    left: `${Math.min(90, Math.max(10, col * colSpacing + 10 + randomX))}%`,
    animationDelay: `${Math.random() * 2}s`,
    animationDuration: `${3 + Math.random() * 3}s`,
    size: `${1 + Math.random() * 3}px`,
    opacity: 0.3 + Math.random() * 0.7
  };
};

const AnimatedRing = () => {
  const theme = useTheme();
  // Generate more sparkles (30 total) with better distribution
  const sparkles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    ...getRandomPosition(i, 30),
  }));

  return (
    <RingContainer>
      <Ring 
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 0.8,
          transition: { duration: 1.5 }
        }}
      />
      {sparkles.map((sparkle) => (
        <Sparkle 
          key={sparkle.id}
          style={{
            top: sparkle.top,
            left: sparkle.left,
            animationDelay: sparkle.animationDelay,
            animationDuration: sparkle.animationDuration,
            width: sparkle.size,
            height: sparkle.size,
            opacity: sparkle.opacity,
          }}
        />
      ))}
    </RingContainer>
  );
};

export default AnimatedRing;
