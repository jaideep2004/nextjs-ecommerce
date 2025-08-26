'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Box,
  Paper,
  Typography,
  Fade,
  Grow,
  ClickAwayListener,
  Skeleton,
  Grid,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// 4th Dimensional Animations
const dropdownSlide = keyframes`
  0% {
    opacity: 0;
    transform: perspective(1000px) rotateX(-15deg) translateY(-20px) scale(0.95);
    filter: blur(8px);
  }
  50% {
    opacity: 0.8;
    transform: perspective(1000px) rotateX(-5deg) translateY(-10px) scale(0.98);
    filter: blur(2px);
  }
  100% {
    opacity: 1;
    transform: perspective(1000px) rotateX(0deg) translateY(0px) scale(1);
    filter: blur(0px);
  }
`;

const categoryItemFloat = keyframes`
  0%, 100% {
    transform: translateY(0px) scale(1);
    filter: brightness(1);
  }
  50% {
    transform: translateY(-2px) scale(1.02);
    filter: brightness(1.05);
  }
`;

const shimmerEffect = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const StyledDropdownContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
}));

const StyledDropdownPaper = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  minWidth: '320px',
  maxWidth: '450px',
  marginTop: theme.spacing(1),
  borderRadius: '20px',
  overflow: 'hidden',
  zIndex: 1300,
  background: theme.palette.mode === 'light'
    ? `linear-gradient(145deg, 
        rgba(255, 255, 255, 0.98) 0%, 
        rgba(250, 250, 250, 0.95) 25%,
        rgba(245, 245, 245, 0.92) 50%,
        rgba(250, 250, 250, 0.95) 75%,
        rgba(255, 255, 255, 0.98) 100%
      )`
    : `linear-gradient(145deg, 
        rgba(25, 25, 25, 0.98) 0%, 
        rgba(30, 30, 30, 0.95) 25%,
        rgba(35, 35, 35, 0.92) 50%,
        rgba(30, 30, 30, 0.95) 75%,
        rgba(25, 25, 25, 0.98) 100%
      )`,
  backdropFilter: 'blur(20px)',
  border: theme.palette.mode === 'light'
    ? '1px solid rgba(162, 146, 120, 0.15)'
    : '1px solid rgba(162, 146, 120, 0.25)',
  boxShadow: theme.palette.mode === 'light'
    ? `
        0 20px 60px rgba(0, 0, 0, 0.15),
        0 0 40px rgba(162, 146, 120, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `
    : `
        0 20px 60px rgba(0, 0, 0, 0.4),
        0 0 40px rgba(162, 146, 120, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.05)
      `,
  animation: `${dropdownSlide} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 20%, rgba(162, 146, 120, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(212, 192, 158, 0.06) 0%, transparent 50%)
    `,
    zIndex: -1,
  },
}));

const CategoryItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2.5),
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  borderRadius: '12px',
  margin: theme.spacing(0.5, 1),
  position: 'relative',
  overflow: 'hidden',
  transformStyle: 'preserve-3d',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: theme.palette.mode === 'light'
      ? 'linear-gradient(90deg, transparent, rgba(162, 146, 120, 0.1), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(162, 146, 120, 0.15), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover': {
    background: theme.palette.mode === 'light'
      ? `linear-gradient(135deg, 
          rgba(162, 146, 120, 0.08) 0%, 
          rgba(212, 192, 158, 0.12) 50%,
          rgba(255, 215, 0, 0.06) 100%
        )`
      : `linear-gradient(135deg, 
          rgba(162, 146, 120, 0.12) 0%, 
          rgba(212, 192, 158, 0.18) 50%,
          rgba(255, 215, 0, 0.08) 100%
        )`,
    transform: 'perspective(500px) translateY(-2px) rotateX(2deg) scale(1.02)',
    boxShadow: theme.palette.mode === 'light'
      ? `
          0 8px 25px rgba(162, 146, 120, 0.15),
          0 0 20px rgba(212, 192, 158, 0.1)
        `
      : `
          0 8px 25px rgba(0, 0, 0, 0.3),
          0 0 20px rgba(162, 146, 120, 0.2)
        `,
    animation: `${categoryItemFloat} 2s ease-in-out infinite`,
    '&::before': {
      left: '100%',
    },
  },
}));

const CategoryName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  letterSpacing: '0.3px',
  color: theme.palette.text.primary,
  transition: 'all 0.3s ease',
  textTransform: 'capitalize',
  position: 'relative',
  zIndex: 1,
}));

const CategoryCount = styled(Typography)(({ theme }) => ({
  fontSize: '0.8rem',
  color: theme.palette.text.secondary,
  fontWeight: 500,
  marginTop: theme.spacing(0.5),
  transition: 'all 0.3s ease',
}));

const DropdownHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5, 2.5, 1.5),
  borderBottom: theme.palette.mode === 'light'
    ? '1px solid rgba(162, 146, 120, 0.1)'
    : '1px solid rgba(162, 146, 120, 0.15)',
  background: theme.palette.mode === 'light'
    ? `linear-gradient(135deg, 
        rgba(162, 146, 120, 0.03) 0%, 
        rgba(212, 192, 158, 0.05) 100%
      )`
    : `linear-gradient(135deg, 
        rgba(162, 146, 120, 0.05) 0%, 
        rgba(212, 192, 158, 0.08) 100%
      )`,
}));

const LoadingSkeleton = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  '& .shimmer': {
    background: theme.palette.mode === 'light'
      ? `linear-gradient(90deg, 
          rgba(162, 146, 120, 0.1) 0%, 
          rgba(212, 192, 158, 0.2) 50%, 
          rgba(162, 146, 120, 0.1) 100%
        )`
      : `linear-gradient(90deg, 
          rgba(162, 146, 120, 0.15) 0%, 
          rgba(212, 192, 158, 0.25) 50%, 
          rgba(162, 146, 120, 0.15) 100%
        )`,
    backgroundSize: '200px 100%',
    animation: `${shimmerEffect} 1.5s infinite linear`,
    borderRadius: '8px',
    height: '20px',
    marginBottom: theme.spacing(1),
  },
}));

export default function CategoriesDropdown({ trigger, onCategorySelect }) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Fetch categories from products API
  useEffect(() => {
    const fetchCategories = async () => {
      if (!open) return;
      
      setLoading(true);
      try {
        const response = await axios.get('/api/products?limit=1000');
        console.log('API Response:', response.data); // Debug log
        
        // Handle both direct array and nested data structure
        const products = response.data.data?.products || response.data.products || response.data || [];
        console.log('Products array:', products); // Debug log
        
        // Extract unique categories with counts
        const categoryMap = new Map();
        products.forEach(product => {
          console.log('Product category:', product.category); // Debug log
          if (product.category) {
            // Handle both populated category objects and string categories
            const categoryName = typeof product.category === 'object' 
              ? product.category.name 
              : product.category;
            
            if (categoryName) {
              const category = categoryName.toLowerCase();
              if (categoryMap.has(category)) {
                categoryMap.set(category, categoryMap.get(category) + 1);
              } else {
                categoryMap.set(category, 1);
              }
            }
          }
        });

        console.log('Category map:', categoryMap); // Debug log

        // Convert to array and sort by count
        const categoriesArray = Array.from(categoryMap.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        console.log('Categories array:', categoriesArray); // Debug log
        setCategories(categoriesArray);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [open]);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCategoryClick = (categoryName) => {
    router.push(`/products?category=${encodeURIComponent(categoryName)}`);
    setOpen(false);
    if (onCategorySelect) {
      onCategorySelect(categoryName);
    }
  };

  const handleViewAll = () => {
    router.push('/products');
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <StyledDropdownContainer ref={dropdownRef}>
        <Box onClick={handleToggle} sx={{ cursor: 'pointer' }}>
          {trigger}
        </Box>
        
        {open && (
          <Grow in={open} timeout={400}>
            <StyledDropdownPaper elevation={8}>
              <DropdownHeader>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #8b7355, #c4a876, #d4c09e)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textAlign: 'center',
                    letterSpacing: '0.5px',
                  }}
                >
                  Shop by Category
                </Typography>
              </DropdownHeader>

              <Box sx={{ maxHeight: '400px', overflowY: 'auto', py: 1 }}>
                {loading ? (
                  <LoadingSkeleton>
                    {[1, 2, 3, 4, 5].map((item) => (
                      <Box key={item} sx={{ p: 2, mx: 1 }}>
                        <Box className="shimmer" sx={{ width: '70%' }} />
                        <Box className="shimmer" sx={{ width: '40%', height: '16px' }} />
                      </Box>
                    ))}
                  </LoadingSkeleton>
                ) : categories.length > 0 ? (
                  <>
                    {categories.map((category, index) => (
                      <Fade in={true} timeout={300 + index * 100} key={category.name}>
                        <CategoryItem onClick={() => handleCategoryClick(category.name)}>
                          <CategoryName>{category.name}</CategoryName>
                          <CategoryCount>
                            {category.count} {category.count === 1 ? 'product' : 'products'}
                          </CategoryCount>
                        </CategoryItem>
                      </Fade>
                    ))}
                    
                    {/* View All Products */}
                    <Fade in={true} timeout={300 + categories.length * 100}>
                      <CategoryItem 
                        onClick={handleViewAll}
                        sx={(theme) => ({
                          borderTop: theme.palette.mode === 'light'
                            ? '1px solid rgba(162, 146, 120, 0.1)'
                            : '1px solid rgba(162, 146, 120, 0.15)',
                          mt: 1,
                          background: theme.palette.mode === 'light'
                            ? `linear-gradient(135deg, 
                                rgba(162, 146, 120, 0.05) 0%, 
                                rgba(212, 192, 158, 0.08) 100%
                              )`
                            : `linear-gradient(135deg, 
                                rgba(162, 146, 120, 0.08) 0%, 
                                rgba(212, 192, 158, 0.12) 100%
                              )`,
                        })}
                      >
                        <CategoryName
                          sx={{
                            background: 'linear-gradient(135deg, #8b7355, #c4a876)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontWeight: 700,
                          }}
                        >
                          View All Products
                        </CategoryName>
                        <CategoryCount>Browse our complete collection</CategoryCount>
                      </CategoryItem>
                    </Fade>
                  </>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      No categories available
                    </Typography>
                  </Box>
                )}
              </Box>
            </StyledDropdownPaper>
          </Grow>
        )}
      </StyledDropdownContainer>
    </ClickAwayListener>
  );
}
