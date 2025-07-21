'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper, 
  Button,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  Breadcrumbs,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  MoreVert,
  Visibility,
  NavigateNext,
  FilterList,
  Clear,
} from '@mui/icons-material';
import ListItemIcon from '@mui/material/ListItemIcon';
import EditIcon from '@mui/icons-material/Edit';


export default function AdminProducts() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  // Redirect if user is not admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/admin/products');
      } else if (!user.isAdmin) {
        router.push('/');
      }
    }
  }, [user, authLoading, router]);
  
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!user || !user.isAdmin) return;
      
      try {
        setLoading(true);
        console.log('Fetching products with params:', { page, rowsPerPage, searchQuery, categoryFilter, stockFilter, sortBy });
        
        // Build query parameters
        const params = new URLSearchParams({
          page: page + 1, // API uses 1-indexed pages
          limit: rowsPerPage,
        });
        
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        if (categoryFilter) {
          params.append('category', categoryFilter);
        }
        
        if (stockFilter !== 'all') {
          params.append('stock', stockFilter);
        }
        
        if (sortBy) {
          let sort = '';
          switch (sortBy) {
            case 'newest':
              sort = '-createdAt';
              break;
            case 'oldest':
              sort = 'createdAt';
              break;
            case 'priceAsc':
              sort = 'price';
              break;
            case 'priceDesc':
              sort = '-price';
              break;
            case 'nameAsc':
              sort = 'name';
              break;
            case 'nameDesc':
              sort = '-name';
              break;
            default:
              sort = '-createdAt';
          }
          params.append('sort', sort);
        }
        
        const url = `/api/admin/products?${params.toString()}`;
        console.log('Fetching products from URL:', url);
        
        const res = await axios.get(url);
        console.log('Products data received:', res.data);
        
        const responseData = res.data.data;
        setProducts(responseData.products);
        setTotalCount(responseData.totalCount);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [user, page, rowsPerPage, searchQuery, categoryFilter, stockFilter, sortBy]);
  
  // Fetch categories for filter
  useEffect(() => {
    const fetchCategories = async () => {
      if (!user || !user.isAdmin) return;
      
      try {
        const res = await axios.get('/api/categories');
        
        // Check if response has the expected structure
        if (res.data && res.data.data && res.data.data.categories) {
          setCategories(res.data.data.categories);
        } else if (res.data && res.data.categories) {
          // Fallback for different response structure
          setCategories(res.data.categories);
        } else {
          console.error('Unexpected categories response format:', res.data);
          setCategories([]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
        // Not setting error state here as it's not critical
      }
    };
    
    fetchCategories();
  }, [user]);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      setPage(0); // Reset to first page when searching
    }
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
    setPage(0);
  };
  
  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
    setPage(0);
  };
  
  const handleStockFilterChange = (event) => {
    setStockFilter(event.target.value);
    setPage(0);
  };
  
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(0);
  };
  
  const handleMenuOpen = (event, productId) => {
    setAnchorEl(event.currentTarget);
    setSelectedProductId(productId);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProductId(null);
  };
  
  const handleEditProduct = () => {
    handleMenuClose();
    router.push(`/admin/products/${selectedProductId}/edit`);
  };
  
  const handleViewProduct = () => {
    handleMenuClose();
    // Find the product to get its slug
    const product = products.find(p => p._id === selectedProductId);
    if (product && product.slug) {
      window.open(`/product/${product.slug}`, '_blank');
    }
  };
  
  const handleDeleteClick = () => {
    handleMenuClose();
    const product = products.find(p => p._id === selectedProductId);
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };
  
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    try {
      setActionLoading(true);
      setActionError('');
      
      await axios.delete(`/api/admin/products/${productToDelete._id}`);
      
      
      // Remove product from state
      setProducts(products.filter(p => p._id !== productToDelete._id));
      setTotalCount(prev => prev - 1);
      
      // Close dialog
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      setActionError(err.message || 'Failed to delete product');
    } finally {
      setActionLoading(false);
    }
  };
  
  const clearAllFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setStockFilter('all');
    setSortBy('newest');
    setPage(0);
  };
  
  if (authLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#8D6E63' }} />
      </Container>
    );
  }
  
  if (!user || !user.isAdmin) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs 
        separator={<NavigateNext fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Typography 
          component={Link} 
          href="/" 
          color="inherit" 
          sx={{ '&:hover': { textDecoration: 'underline' } }}
        >
          Home
        </Typography>
        <Typography 
          component={Link} 
          href="/admin/dashboard" 
          color="inherit" 
          sx={{ '&:hover': { textDecoration: 'underline' } }}
        >
          Admin Dashboard
        </Typography>
        <Typography color="text.primary">Products</Typography>
      </Breadcrumbs>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Products Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          component={Link}
          href="/admin/products/new"
          sx={{ 
            bgcolor: '#8D6E63',
            '&:hover': { bgcolor: '#6D4C41' },
          }}
        >
          Add New Product
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        {/* Filters and Search */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Products"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClearSearch} edge="end">
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="category-filter-label">Category</InputLabel>
              <Select
                labelId="category-filter-label"
                value={categoryFilter}
                onChange={handleCategoryFilterChange}
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
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="stock-filter-label">Stock</InputLabel>
              <Select
                labelId="stock-filter-label"
                value={stockFilter}
                onChange={handleStockFilterChange}
                label="Stock"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="inStock">In Stock</MenuItem>
                <MenuItem value="lowStock">Low Stock (≤ 5)</MenuItem>
                <MenuItem value="outOfStock">Out of Stock</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="sort-by-label">Sort By</InputLabel>
              <Select
                labelId="sort-by-label"
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By"
              >
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="oldest">Oldest</MenuItem>
                <MenuItem value="priceAsc">Price: Low to High</MenuItem>
                <MenuItem value="priceDesc">Price: High to Low</MenuItem>
                <MenuItem value="nameAsc">Name: A to Z</MenuItem>
                <MenuItem value="nameDesc">Name: Z to A</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<FilterList />}
              onClick={clearAllFilters}
              sx={{ height: '100%' }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
        
        {/* Products Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#8D6E63' }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : !products || products.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              No products found. Try adjusting your filters or add a new product.
            </Typography>
            <Button 
              component={Link} 
              href="/admin/products/new" 
              variant="contained"
              startIcon={<Add />}
              sx={{ 
                bgcolor: '#8D6E63',
                '&:hover': { bgcolor: '#6D4C41' },
              }}
            >
              Add New Product
            </Button>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Stock</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ position: 'relative', width: 50, height: 50, mr: 2 }}>
                            <Image
                              src={product.image || '/images/placeholder.png'}
                              alt={product.name}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          </Box>
                          <Typography variant="body1">{product.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell align="right">
                        ${product.price.toFixed(2)}
                        {product.oldPrice && product.oldPrice > product.price && (
                          <Typography 
                            variant="body2" 
                            component="span" 
                            sx={{ 
                              textDecoration: 'line-through', 
                              color: 'text.secondary',
                              ml: 1,
                            }}
                          >
                            ${product.oldPrice.toFixed(2)}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          color={
                            product.countInStock === 0 ? 'error.main' :
                            product.countInStock <= 5 ? 'warning.main' :
                            'text.primary'
                          }
                          fontWeight={product.countInStock <= 5 ? 'bold' : 'normal'}
                        >
                          {product.countInStock}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={product.countInStock > 0 ? 'In Stock' : 'Out of Stock'} 
                          color={product.countInStock > 0 ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          aria-label="more" 
                          onClick={(e) => handleMenuOpen(e, product._id)}
                          size="small"
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>
      
      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewProduct}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">View Product</Typography>
        </MenuItem>
        <MenuItem onClick={handleEditProduct}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Edit</Typography>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <Typography variant="inherit">Delete</Typography>
        </MenuItem>
      </Menu>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &quot;{productToDelete?.name}&quot;? This action cannot be undone.
          </DialogContentText>
          {actionError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {actionError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={actionLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} /> : null}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}