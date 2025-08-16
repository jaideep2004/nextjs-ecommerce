
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
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
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

const CategoryButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  borderRadius: '50px',
  textTransform: 'none',
  fontWeight: 'bold',
  padding: theme.spacing(0.5, 3),
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

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
        
        // Fetch featured products
        const featuredRes = await axios.get('/api/products?featured=true&limit=8');
        
        // Fetch new arrivals
        const newArrivalsRes = await axios.get('/api/products?sort=-createdAt&limit=8');
        
        // Fetch sale products
        const saleRes = await axios.get('/api/products?discount[gt]=0&limit=8');

        // Fetch trending products
        const trendingRes = await axios.get('/api/products?sort=-rating&limit=6');
        
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

  // Slider settings for trending products
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : isTablet ? 2 : 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: !isMobile,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
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
      
      {/* Trending Products Carousel Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
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
            <ShimmerText variant="h3" component="h2" fontWeight="bold" sx={{ mb: 2 }} data-aos="fade-up" data-aos-delay="200">
              Trending Products
            </ShimmerText>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }} data-aos="fade-up" data-aos-delay="300">
              Discover our most popular and highest-rated products that customers love
            </Typography>
          </Box>
          
          <Box sx={{ position: 'relative', px: { xs: 0, md: 4 }, py: 2 }}>
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
      
      {/* Modern Categories Section */}
      <Box sx={{ py: 10, bgcolor: 'background.accent' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="subtitle1" color="primary" fontWeight="bold" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1 }} data-aos="fade-up" data-aos-delay="100">
              Collections
            </Typography>
            <ShimmerText variant="h3" component="h2" fontWeight="bold" sx={{ mb: 2 }} data-aos="fade-up" data-aos-delay="200">
              Shop by Category
            </ShimmerText>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }} data-aos="fade-up" data-aos-delay="300">
              Explore our carefully curated collections designed for every occasion
            </Typography>
          </Box>
          
          {/* Dynamic Categories Grid */}
          <Grid container spacing={3}>
            {categories && categories.length > 0 ? (
              categories.map((category, index) => (
                <Grid item xs={12} sm={6} md={4} key={category._id || index} data-aos="fade-up" data-aos-delay={200 + (index * 100)}>
                  <CategoryCard component={Link} href={`/category/${category.slug}`} sx={{ textDecoration: 'none' }}>
                    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
                      <Image 
                        src={category.image || `/images/category-${index + 1}.jpg`}
                        alt={category.name}
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                        style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        className="category-image"
                      />
                      <Box 
                        className="category-content"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          p: 3,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                          {category.name}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: 'white',
                          opacity: 0.9,
                        }}>
                          <Typography variant="body2">Explore Collection</Typography>
                          <ArrowForward sx={{ ml: 1, fontSize: '0.9rem' }} />
                        </Box>
                      </Box>
                    </Box>
                  </CategoryCard>
                </Grid>
              ))
            ) : (
              // Fallback categories if API doesn't return any
              ["Women's Collection", "Men's Collection", "Accessories", "Traditional Wear", "Modern Fusion", "Wedding Collection"].map((name, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <CategoryCard component={Link} href={`/category/category-${index + 1}`} sx={{ textDecoration: 'none' }}>
                    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
                      <Image 
                        src={`/images/category-${index + 1}.jpg`}
                        alt={name}
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                        style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        className="category-image"
                      />
                      <Box 
                        className="category-content"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          p: 3,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                          {name}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: 'white',
                          opacity: 0.9,
                        }}>
                          <Typography variant="body2">Explore Collection</Typography>
                          <ArrowForward sx={{ ml: 1, fontSize: '0.9rem' }} />
                        </Box>
                      </Box>
                    </Box>
                  </CategoryCard>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>
      
      {/* Products Section with Tabs */}
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="subtitle1" color="primary" fontWeight="bold" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1 }} data-aos="fade-up" data-aos-delay="100">
              Our Products
            </Typography>
            <ShimmerText variant="h3" component="h2" fontWeight="bold" sx={{ mb: 2 }} data-aos="fade-up" data-aos-delay="200">
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
          
          <ProductGrid 
            products={activeProducts} 
            loading={loading} 
            error={error}
            wishlistItems={wishlistItems}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onRemoveFromWishlist={handleRemoveFromWishlist}
          />
          
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
        </Box>
      </Container>
      
      {/* Modern Deal Banner with Image */}
      <Box sx={{ 
        py: 10, 
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center" data-aos="fade-up">
            <Grid item xs={12} md={6} data-aos="fade-right" data-aos-delay="100">
              <Box sx={{ color: 'white', textAlign: { xs: 'center', md: 'left' } }}>
                <Chip 
                  label="✨ Special Offer" 
                  sx={{ 
                    mb: 3, 
                    fontWeight: 'bold', 
                    fontSize: '0.9rem', 
                    py: 2, 
                    px: 2,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    backdropFilter: 'blur(10px)'
                  }} 
                />
                <Typography variant="h2" component="h2" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2
                }}>
                  Premium Collection
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}>
                  Discover authentic designs with up to 70% off on selected items
                </Typography>
                <Button 
                  variant="contained" 
                  size="large" 
                  sx={{ 
                    mt: 2, 
                    px: 6, 
                    py: 2, 
                    borderRadius: '50px',
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                  component={Link}
                  href="/products"
                >
                  Explore Collection
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} data-aos="fade-left" data-aos-delay="200">
              <Box sx={{ 
                position: 'relative',
                textAlign: 'center',
                '& img': {
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  transform: 'rotate(5deg)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(0deg) scale(1.05)'
                  }
                }
              }}>
                <Image 
                  src="/images/img1.jpg" 
                  alt="Premium Collection" 
                  width={400} 
                  height={500} 
                  style={{ objectFit: 'cover' }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Testimonials Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <SectionTitle variant="h3" component="h2" gutterBottom data-aos="fade-up">
              What Our Clients Say About Us
            </SectionTitle>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }} data-aos="fade-right">
              <IconButton 
                onClick={handlePrevTestimonial} 
                sx={{ width: 64, height: 64, bgcolor: 'background.paper', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
              >
                <ArrowBack />
              </IconButton>
            </Grid>
            
            <Grid item xs={12} md={6} data-aos="fade-up" data-aos-delay="200">
              <TestimonialCard>
                <CardContent sx={{ flexGrow: 1, pt: 5 }}>
                  <Typography variant="body1" sx={{ mb: 4, fontStyle: 'italic', fontSize: '1.1rem', position: 'relative', zIndex: 1 }}>
                    {testimonials[currentTestimonial].text}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      src={testimonials[currentTestimonial].image} 
                      alt={testimonials[currentTestimonial].name}
                      sx={{ width: 64, height: 64, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6">{testimonials[currentTestimonial].name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonials[currentTestimonial].location}
                      </Typography>
                      <Rating 
                        value={testimonials[currentTestimonial].rating} 
                        precision={0.5} 
                        readOnly 
                      />
                    </Box>
                  </Box>
                </CardContent>
              </TestimonialCard>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton 
                  onClick={handlePrevTestimonial} 
                  size="small"
                  sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
                >
                  <ArrowBack />
                </IconButton>
                <IconButton 
                  onClick={handleNextTestimonial}
                  size="small"
                  sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
                >
                  <ArrowForward />
                </IconButton>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }} data-aos="fade-left">
              <IconButton 
                onClick={handleNextTestimonial} 
                sx={{ width: 64, height: 64, bgcolor: 'background.paper', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
              >
                <ArrowForward />
              </IconButton>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* New Arrivals Section */}
      <Container maxWidth="lg">
        <Box sx={{ py: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <SectionTitle variant="h4" component="h2" data-aos="fade-right">
              Trending Products
            </SectionTitle>
            <Button 
              variant="outlined" 
              endIcon={<ArrowForward />}
              href="/products/new-arrivals"
              data-aos="fade-left"
            >
              View All
            </Button>
          </Box>
          
          <ProductGrid 
            products={newArrivals.slice(0, 4)} 
            loading={loading} 
            error={error}
            wishlistItems={wishlistItems}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onRemoveFromWishlist={handleRemoveFromWishlist}
            gridProps={{ spacing: 4 }}
            itemProps={{ xs: 12, sm: 6, md: 3 }}
          />
        </Box>
      </Container>
    </Box>
  );
}
