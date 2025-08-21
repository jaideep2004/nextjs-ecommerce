'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  Breadcrumbs,
  Link as MuiLink,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/contexts/AuthContext';

export default function CategoriesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', slug: '', image: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && (!user || !user.isAdmin)) {
      router.push('/login?redirect=/admin/categories');
      return;
    }

    if (user && user.isAdmin) {
      fetchCategories();
    }
  }, [user, authLoading, router]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/categories');
      
      // Check if response has the expected structure
      if (data && data.categories) {
        setCategories(data.categories);
      } else if (data && data.data && data.data.categories) {
        // Handle both response formats for backward compatibility
        setCategories(data.data.categories);
      } else {
        console.error('Unexpected API response format:', data);
        setError('Received unexpected data format from server');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setCurrentCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        slug: category.slug,
        image: category.image || '',
      });
      setImagePreview(category.image || '');
    } else {
      setCurrentCategory(null);
      setFormData({ name: '', description: '', slug: '', image: '' });
      setImageFile(null);
      setImagePreview('');
    }
    setFormErrors({});
    setUploadingImage(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (category) => {
    setCurrentCategory(category);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSlugGeneration = () => {
    if (!formData.name) return;
    
    // Generate slug from name
    const slug = formData.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
    
    setFormData(prev => ({ ...prev, slug }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Category name is required';
    }
    if (!formData.slug.trim()) {
      errors.slug = 'Category slug is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name) {
      setFormErrors({ name: 'Category name is required' });
      return;
    }
    
    try {
      setLoading(true);
      
      // Use the locally selected/previewed image (same approach as ProductForm)
      // If a new image has been selected and previewed, it will be in imagePreview
      const imageUrl = imagePreview || formData.image || '';

      const dataToSubmit = {
        ...formData,
        image: imageUrl,
      };

      const url = currentCategory
        ? `/admin/categories/${currentCategory._id}`
        : '/admin/categories';
      const method = currentCategory ? 'PUT' : 'POST';

      await api[method.toLowerCase()](url, dataToSubmit);
      await fetchCategories();
      handleCloseDialog();
      setSnackbar({ 
        open: true,
        message: currentCategory
          ? 'Category updated successfully'
          : 'Category created successfully',
        severity: 'success',
      });
    } catch (err) {
      console.error('Error saving category:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to save category',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentCategory) return;

    try {
      setLoading(true);
      await api.delete(`/admin/categories/${currentCategory._id}`);
      await fetchCategories();
      handleCloseDeleteDialog();
      setSnackbar({
        open: true,
        message: 'Category deleted successfully',
        severity: 'success',
      });
    } catch (err) {
      console.error('Error deleting category:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to delete category',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Match ProductForm: on image select, create a base64 preview and store in formData.image
  // (No server-side upload at this step)

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setImagePreview(dataUrl);
        setFormData(prev => ({ ...prev, image: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (authLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
              <MuiLink 
                component={Link} 
                href="/admin/dashboard" 
                underline="hover" 
                color="inherit" 
                sx={{ cursor: 'pointer' }}
              >
                Dashboard
              </MuiLink>
              <Typography color="text.primary">Categories</Typography>
            </Breadcrumbs>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" component="h2">
                Categories Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ 
                  bgcolor: '#8D6E63',
                  '&:hover': { bgcolor: '#6D4C41' },
                }}
              >
                Add Category
              </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {loading && !error ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Slug</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Products</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <TableRow key={category._id}>
                          <TableCell>{category.name}</TableCell>
                          <TableCell>{category.slug}</TableCell>
                          <TableCell>
                            {category.description
                              ? category.description.length > 50
                                ? `${category.description.substring(0, 50)}...`
                                : category.description
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={category.productCount || 0} 
                              size="small" 
                              sx={{ bgcolor: '#EFEBE9' }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              color="primary"
                              onClick={() => router.push(`/category/${category.slug}`)}
                              size="small"
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenDialog(category)}
                              size="small"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleOpenDeleteDialog(category)}
                              size="small"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No categories found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Container>
      </Box>

      {/* Add/Edit Category Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{currentCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
            {/* Left Column - Form Fields */}
            <Box sx={{ flex: 1 }}>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Category Name"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                name="slug"
                label="Category Slug"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.slug}
                onChange={handleChange}
                error={!!formErrors.slug}
                helperText={formErrors.slug || 'URL-friendly version of the name'}
                InputProps={{
                  endAdornment: (
                    <Button 
                      onClick={handleSlugGeneration}
                      size="small"
                    >
                      Generate
                    </Button>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                name="description"
                label="Description (Optional)"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Box>

            {/* Right Column - Image Upload */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Category Image
              </Typography>
              
              {/* Image Preview */}
              {imagePreview ? (
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      border: '2px dashed #ddd',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleRemoveImage}
                      color="error"
                    >
                      Remove
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      component="label"
                    >
                      Change Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: 200,
                    border: '2px dashed #ddd',
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'rgba(0,0,0,0.02)',
                    },
                    mb: 2,
                  }}
                  component="label"
                >
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" align="center">
                    Click to upload category image
                  </Typography>
                  <Typography variant="caption" color="text.secondary" align="center">
                    Recommended: 400x300px, JPG or PNG
                  </Typography>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Box>
              )}

              {uploadingImage && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" color="text.secondary">
                    Uploading image...
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading || uploadingImage}
            sx={{ 
              bgcolor: '#8D6E63',
              '&:hover': { bgcolor: '#6D4C41' },
            }}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the category "{currentCategory?.name}"? This action cannot be undone.
            {currentCategory?.productCount > 0 && (
              <Typography color="error" sx={{ mt: 1 }}>
                Warning: This category has {currentCategory.productCount} products associated with it.
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}