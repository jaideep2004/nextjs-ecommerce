'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import ProductGrid from '@/components/ProductGrid';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    sort: 'newest',
  });
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  
  const itemsPerPage = 12;

  useEffect(() => {
    // Reset page when search query changes
    setPage(1);
    setSearchQuery(query);
    fetchProducts(1, query, filters);
    fetchCategories();
  }, [query]);

  const fetchProducts = async (pageNum, searchTerm, filterOptions) => {
    try {
      setLoading(true);
      
      // Build query string
      const queryParams = new URLSearchParams();
      queryParams.append('page', pageNum);
      queryParams.append('limit', itemsPerPage);
      queryParams.append('q', searchTerm);
      
      if (filterOptions.category) {
        queryParams.append('category', filterOptions.category);
      }
      
      if (filterOptions.minPrice > 0) {
        queryParams.append('minPrice', filterOptions.minPrice);
      }
      
      if (filterOptions.maxPrice < 1000) {
        queryParams.append('maxPrice', filterOptions.maxPrice);
      }
      
      if (filterOptions.sort) {
        queryParams.append('sort', filterOptions.sort);
      }
      
      const response = await axios.get(`/api/products/search?${queryParams.toString()}`);
      
      setProducts(response.data.products);
      setTotalProducts(response.data.total);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data.categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Don't set error state here as it would override product errors
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Update URL with search query
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchQuery.trim())}`);
      fetchProducts(1, searchQuery.trim(), filters);
      setPage(1);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handlePriceChangeCommitted = () => {
    setFilters(prev => ({
      ...prev,
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    }));
  };

  const applyFilters = () => {
    fetchProducts(1, searchQuery, filters);
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: 0,
      maxPrice: 1000,
      sort: 'newest',
    });
    setPriceRange([0, 1000]);
    fetchProducts(1, searchQuery, {
      category: '',
      minPrice: 0,
      maxPrice: 1000,
      sort: 'newest',
    });
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    fetchProducts(value, searchQuery, filters);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link href="/" passHref>
          <MuiLink underline="hover" color="inherit">
            Home
          </MuiLink>
        </Link>
        <Typography color="text.primary">Search Results</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSearch}>
          <TextField
            fullWidth
            label="Search products"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
      </Paper>

      <Grid container spacing={3}>
        {/* Filters - Desktop */}
        <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Typography gutterBottom>Price Range</Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              onChangeCommitted={handlePriceChangeCommitted}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="body2">${priceRange[0]}</Typography>
              <Typography variant="body2">${priceRange[1]}</Typography>
            </Box>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                label="Sort By"
              >
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="price_low">Price: Low to High</MenuItem>
                <MenuItem value="price_high">Price: High to Low</MenuItem>
                <MenuItem value="popular">Most Popular</MenuItem>
                <MenuItem value="rating">Highest Rated</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={applyFilters}
                fullWidth
              >
                Apply Filters
              </Button>
              <Button
                variant="outlined"
                onClick={resetFilters}
              >
                Reset
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Mobile Filter Toggle */}
        <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={toggleFilters}
            fullWidth
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Grid>

        {/* Filters - Mobile */}
        {showFilters && (
          <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Filters</Typography>
                <IconButton onClick={toggleFilters} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="category-mobile-label">Category</InputLabel>
                <Select
                  labelId="category-mobile-label"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Typography gutterBottom>Price Range</Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                onChangeCommitted={handlePriceChangeCommitted}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="body2">${priceRange[0]}</Typography>
                <Typography variant="body2">${priceRange[1]}</Typography>
              </Box>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="sort-mobile-label">Sort By</InputLabel>
                <Select
                  labelId="sort-mobile-label"
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  label="Sort By"
                >
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="price_low">Price: Low to High</MenuItem>
                  <MenuItem value="price_high">Price: High to Low</MenuItem>
                  <MenuItem value="popular">Most Popular</MenuItem>
                  <MenuItem value="rating">Highest Rated</MenuItem>
                </Select>
              </FormControl>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    applyFilters();
                    toggleFilters();
                  }}
                  fullWidth
                >
                  Apply Filters
                </Button>
                <Button
                  variant="outlined"
                  onClick={resetFilters}
                >
                  Reset
                </Button>
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Search Results */}
        <Grid item xs={12} md={showFilters ? 12 : 9}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="h5" component="h1">
                {query ? `Search Results for "${query}"` : 'All Products'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {totalProducts} {totalProducts === 1 ? 'product' : 'products'} found
              </Typography>
            </Box>
            
            {/* Active Filters */}
            {(filters.category || filters.minPrice > 0 || filters.maxPrice < 1000) && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Active Filters:
                </Typography>
                {filters.category && (
                  <Chip
                    label={`Category: ${categories.find(c => c._id === filters.category)?.name || 'Selected'}`}
                    onDelete={() => {
                      setFilters(prev => ({ ...prev, category: '' }));
                    }}
                    size="small"
                  />
                )}
                {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
                  <Chip
                    label={`Price: $${filters.minPrice} - $${filters.maxPrice}`}
                    onDelete={() => {
                      setFilters(prev => ({ ...prev, minPrice: 0, maxPrice: 1000 }));
                      setPriceRange([0, 1000]);
                    }}
                    size="small"
                  />
                )}
                <Button
                  variant="text"
                  size="small"
                  onClick={resetFilters}
                >
                  Clear All
                </Button>
              </Box>
            )}
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          ) : products.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your search or filter criteria
              </Typography>
            </Paper>
          ) : (
            <ProductGrid 
              products={products} 
              loading={loading} 
              error={error} 
              page={page} 
              totalPages={Math.ceil(totalProducts / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}