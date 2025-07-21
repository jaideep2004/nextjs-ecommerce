'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import ProductGrid from '@/components/ProductGrid';

export default function CategoryPage() {
  const params = useParams();
  const { slug } = params;
  
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });
  
  // Format the category name for display
  const formatCategoryName = (slug) => {
    if (!slug) return '';
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  useEffect(() => {
    if (!slug) return;
    
    const formattedCategory = formatCategoryName(slug);
    setCategory(formattedCategory);
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const queryParams = new URLSearchParams();
        queryParams.append('category', formattedCategory);
        queryParams.append('page', pagination.page);
        queryParams.append('limit', 12); // Products per page
        
        const res = await axios.get(`/api/products?${queryParams.toString()}`);
        
        const responseData = res.data.data;
        setProducts(responseData.products);
        setPagination({
          page: responseData.pagination.page,
          pages: responseData.pagination.pages,
          total: responseData.pagination.total,
        });
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [slug, pagination.page]);
  
  const handlePageChange = (event, value) => {
    setPagination(prev => ({ ...prev, page: value }));
  };
  
  // Category banner images (would typically come from an API or CMS)
  const getCategoryBanner = (category) => {
    const banners = {
      'Punjabi Suits': '/images/category-banner-suits.jpg',
      'Turbans': '/images/category-banner-turbans.jpg',
      'Accessories': '/images/category-banner-accessories.jpg',
    };
    
    return banners[category] || '/images/category-banner-default.jpg';
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNext fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link href="/" passHref>
          <Typography color="inherit" sx={{ '&:hover': { textDecoration: 'underline' } }}>
            Home
          </Typography>
        </Link>
        <Link href="/products" passHref>
          <Typography color="inherit" sx={{ '&:hover': { textDecoration: 'underline' } }}>
            Products
          </Typography>
        </Link>
        <Typography color="text.primary">{category}</Typography>
      </Breadcrumbs>
      
      {/* Category Banner */}
      <Paper 
        sx={{
          height: 200,
          mb: 4,
          position: 'relative',
          backgroundImage: `url(${getCategoryBanner(category)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1,
          },
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            color: 'white', 
            fontWeight: 'bold',
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
          }}
        >
          {category}
        </Typography>
      </Paper>
      
      {/* Category Description */}
      <Typography variant="body1" sx={{ mb: 4 }}>
        Explore our collection of premium quality {category?.toLowerCase()}. 
        Each piece is crafted with attention to detail and authentic designs 
        to bring you the best of Punjabi tradition and culture.
      </Typography>
      
      {/* Products Grid */}
      <ProductGrid 
        products={products} 
        loading={loading} 
        error={error}
        title={`${category} Collection`}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </Container>
  );
}