'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import Image from 'next/image';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  InputAdornment,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Save,
  Cancel,
  Add,
  Delete,
  CloudUpload,
} from '@mui/icons-material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function ProductForm({ product, categories = [], isEdit = false }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    richDescription: '',
    brand: '',
    price: '',
    oldPrice: '',
    category: '',
    countInStock: '',
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    isNew: false,
    tags: [],
    image: '', // Main product image
    images: [], // Gallery images
    colors: [],
    sizes: [],
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  
  // Initialize form with product data if editing
  useEffect(() => {
    if (isEdit && product) {
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        richDescription: product.richDescription || '',
        brand: product.brand || '',
        price: product.price || '',
        oldPrice: product.oldPrice || '',
        category: product.category || '',
        countInStock: product.countInStock || '',
        rating: product.rating || 0,
        numReviews: product.numReviews || 0,
        isFeatured: product.isFeatured || false,
        isNew: product.isNew || false,
        tags: product.tags || [],
        image: product.image || '', // Main image
        images: product.images || [], // Gallery images
        colors: product.colors || [],
        sizes: product.sizes || [],
      });
      
      if (product.image) {
        setImagePreview(product.image);
      }
      
      if (product.images && product.images.length > 0) {
        setGalleryPreviews(product.images);
      }
    }
  }, [isEdit, product]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox fields
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }
    
    // Handle number fields
    if (name === 'price' || name === 'oldPrice' || name === 'countInStock') {
      // Allow empty string or valid numbers
      if (value === '' || !isNaN(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
      return;
    }
    
    // Handle all other fields
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.match('image.*')) {
      setErrors(prev => ({ ...prev, image: 'Please select an image file' }));
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
      return;
    }
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setFormData(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
    
    // Clear error
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };
  
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    // Check if adding these files would exceed the limit (max 5 gallery images)
    if (galleryPreviews.length + files.length > 5) {
      setErrors(prev => ({ ...prev, gallery: 'Maximum 5 gallery images allowed' }));
      return;
    }
    
    const newPreviews = [];
    const newImages = [];
    let processedFiles = 0;
    
    files.forEach((file, index) => {
      // Check file type
      if (!file.type.match('image.*')) {
        setErrors(prev => ({ ...prev, gallery: 'Please select only image files' }));
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, gallery: 'Image size should be less than 5MB' }));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        newPreviews.push(reader.result);
        newImages.push(reader.result);
        processedFiles++;
        
        // When all files are processed, update state
        if (processedFiles === files.length) {
          setGalleryPreviews(prev => [...prev, ...newPreviews]);
          setFormData(prev => ({ 
            ...prev, 
            images: [...prev.images, ...newImages] 
          }));
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Clear error
    if (errors.gallery) {
      setErrors(prev => ({ ...prev, gallery: '' }));
    }
  };
  
  const handleRemoveGalleryImage = (indexToRemove) => {
    setGalleryPreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };
  
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    if (!formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
    }
    
    setNewTag('');
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };
  
  const handleAddColor = () => {
    if (!newColor.trim()) return;
    
    if (!formData.colors.includes(newColor.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()],
      }));
    }
    
    setNewColor('');
  };
  
  const handleRemoveColor = (colorToRemove) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(color => color !== colorToRemove),
    }));
  };
  
  const handleAddSize = () => {
    if (!newSize.trim()) return;
    
    if (!formData.sizes.includes(newSize.trim())) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()],
      }));
    }
    
    setNewSize('');
  };
  
  const handleRemoveSize = (sizeToRemove) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(size => size !== sizeToRemove),
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Product slug is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (formData.oldPrice !== '' && (isNaN(formData.oldPrice) || Number(formData.oldPrice) <= 0)) {
      newErrors.oldPrice = 'Old price must be a positive number';
    }
    
    if (formData.countInStock === '' || isNaN(formData.countInStock) || Number(formData.countInStock) < 0) {
      newErrors.countInStock = 'Valid stock quantity is required';
    }
    
    if (!imagePreview && !isEdit) {
      newErrors.image = 'Product image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log('Form validation failed with errors:', errors);
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Prepare data for API
      const productData = {
        ...formData,
        price: Number(formData.price),
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
        countInStock: Number(formData.countInStock),
      };
      
      console.log('Submitting product data:', productData);
      
      // API endpoint and method based on whether we're editing or creating
      const url = isEdit ? `/api/admin/products/${product._id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';
      console.log(`Making ${method} request to ${url}`);
      
      let response;
      if (method === 'PUT') {
        response = await axios.put(url, productData);
      } else {
        response = await axios.post(url, productData);
      }
      
      console.log('API response:', response.data);
      const data = response.data;
      
      setSuccess(isEdit ? 'Product updated successfully' : 'Product created successfully');
      
      // Show toast notification
      toast.success(isEdit ? 'Product updated successfully!' : 'Product created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
    } catch (err) {
      console.error('Error saving product:', err);
      const errorMessage = err.message || 'Failed to save product';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 4 }}>
          {/* Basic Information Section */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 3, 
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              backgroundColor: '#fafafa'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontWeight: 600, 
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                '&:before': {
                  content: '"1"',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: '#2196f3',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  mr: 2,
                }
              }}
            >
              Basic Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Product Slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  error={!!errors.slug}
                  helperText={errors.slug || 'URL-friendly version of the name'}
                  required
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button 
                          onClick={handleSlugGeneration}
                          size="small"
                          sx={{ color: '#2196f3' }}
                        >
                          Generate
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Short Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  required
                  multiline
                  rows={3}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Detailed Description"
                  name="richDescription"
                  value={formData.richDescription}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  variant="outlined"
                  helperText="Rich description for the product page"
                />
              </Grid>
            </Grid>
          </Paper>
          {/* Pricing and Inventory Section */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 3, 
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              backgroundColor: '#fafafa'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontWeight: 600, 
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                '&:before': {
                  content: '"2"',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  mr: 2,
                }
              }}
            >
              Pricing and Inventory
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  error={!!errors.price}
                  helperText={errors.price}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Old Price (Sale)"
                  name="oldPrice" 
                  value={formData.oldPrice}
                  onChange={handleChange}
                  error={!!errors.oldPrice}
                  helperText={errors.oldPrice || 'Set higher than current price to show as sale'}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  variant="outlined"
                  helperText="Product brand or manufacturer"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  name="countInStock"
                  value={formData.countInStock}
                  onChange={handleChange}
                  error={!!errors.countInStock}
                  helperText={errors.countInStock}
                  required
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.category} required variant="outlined">
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                  >
                    <MenuItem value=""><em>Select a category</em></MenuItem>
                    {Array.isArray(categories) && categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
          {/* Product Options Section */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 3, 
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              backgroundColor: '#fafafa'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontWeight: 600, 
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                '&:before': {
                  content: '"3"',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: '#ff9800',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  mr: 2,
                }
              }}
            >
              Product Options
            </Typography>
            
            <Grid container spacing={3}>
              {/* Colors */}
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Available Colors
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, minHeight: 40 }}>
                    {formData.colors.map((color) => (
                      <Chip
                        key={color}
                        label={color}
                        onDelete={() => handleRemoveColor(color)}
                        sx={{ m: 0.5 }}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      label="Add Color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      size="small"
                      sx={{ flexGrow: 1 }}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                      placeholder="e.g., Red, Blue, Green"
                    />
                    <Button 
                      onClick={handleAddColor} 
                      variant="outlined"
                      startIcon={<Add />}
                      disabled={!newColor.trim()}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>
              </Grid>
              
              {/* Sizes */}
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Available Sizes
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, minHeight: 40 }}>
                    {formData.sizes.map((size) => (
                      <Chip
                        key={size}
                        label={size}
                        onDelete={() => handleRemoveSize(size)}
                        sx={{ m: 0.5 }}
                        color="secondary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      label="Add Size"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      size="small"
                      sx={{ flexGrow: 1 }}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                      placeholder="e.g., S, M, L, XL"
                    />
                    <Button 
                      onClick={handleAddSize} 
                      variant="outlined"
                      startIcon={<Add />}
                      disabled={!newSize.trim()}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>
              </Grid>
              
              {/* Tags */}
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Product Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, minHeight: 40 }}>
                    {formData.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        sx={{ m: 0.5 }}
                        color="info"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      label="Add Tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      size="small"
                      sx={{ flexGrow: 1 }}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="e.g., trending, new"
                    />
                    <Button 
                      onClick={handleAddTag} 
                      variant="outlined"
                      startIcon={<Add />}
                      disabled={!newTag.trim()}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Product Images Section */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 3, 
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              backgroundColor: '#fafafa'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontWeight: 600, 
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                '&:before': {
                  content: '"4"',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: '#9c27b0',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  mr: 2,
                }
              }}
            >
              Product Images
            </Typography>
            
            <Grid container spacing={3}>
              {/* Main Product Image */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Main Product Image *
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUpload />}
                      sx={{ mb: 2, width: '100%' }}
                    >
                      Upload Main Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>
                    {errors.image && (
                      <FormHelperText error sx={{ ml: 0 }}>{errors.image}</FormHelperText>
                    )}
                  </Box>
                  
                  {imagePreview ? (
                    <Box 
                      sx={{ 
                        position: 'relative', 
                        width: '100%', 
                        minWidth: '300px',
                        height: 250, 
                        border: '2px solid #e0e0e0',
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}
                    >
                      <Image
                        src={imagePreview}
                        alt="Product preview"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      <IconButton
                        sx={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8, 
                          bgcolor: 'rgba(255,255,255,0.9)',
                          '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                        }}
                        onClick={() => {
                          setImagePreview('');
                          setFormData(prev => ({ ...prev, image: '' }));
                        }}
                      >
                        <Delete color="error" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box 
                      sx={{ 
                        width: '100%', 
                        minWidth: '300px',
                        height: 250, 
                        border: '2px dashed #ccc', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        bgcolor: '#f9f9f9',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No main image selected
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
              
              {/* Gallery Images */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Gallery Images (Optional)
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUpload />}
                      sx={{ mb: 2, width: '100%' }}
                      disabled={galleryPreviews.length >= 5}
                    >
                      Add Gallery Images (Max 5)
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        multiple
                        onChange={handleGalleryChange}
                      />
                    </Button>
                    {errors.gallery && (
                      <FormHelperText error sx={{ ml: 0 }}>{errors.gallery}</FormHelperText>
                    )}
                    <Typography variant="caption" color="text.secondary" display="block">
                      {galleryPreviews.length}/5 images added
                    </Typography>
                  </Box>
                  
                  {galleryPreviews.length > 0 ? (
                    <Box 
                      sx={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: 1,
                        minWidth: '300px',
                        maxHeight: 250,
                        overflowY: 'auto',
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        p: 1
                      }}
                    >
                      {galleryPreviews.map((preview, index) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            position: 'relative', 
                            width: '100%', 
                            height: 80,
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            overflow: 'hidden'
                          }}
                        >
                          <Image
                            src={preview}
                            alt={`Gallery ${index + 1}`}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                          <IconButton
                            sx={{ 
                              position: 'absolute', 
                              top: 2, 
                              right: 2, 
                              bgcolor: 'rgba(255,255,255,0.8)',
                              width: 20,
                              height: 20,
                              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                            }}
                            onClick={() => handleRemoveGalleryImage(index)}
                          >
                            <Delete sx={{ fontSize: 12 }} color="error" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box 
                      sx={{ 
                        width: '100%', 
                        minWidth: '300px',
                        height: 120, 
                        border: '2px dashed #ccc', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        bgcolor: '#f9f9f9',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No gallery images added
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Product Flags Section */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 3, 
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              backgroundColor: '#fafafa'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontWeight: 600, 
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                '&:before': {
                  content: '"5"',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: '#f44336',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  mr: 2,
                }
              }}
            >
              Product Flags & Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      name="isFeatured"
                      color="primary"
                    />
                  }
                  label="Featured Product"
                  sx={{ mb: 1 }}
                />
                <Typography variant="caption" color="text.secondary" display="block">
                  Show this product in featured sections
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isNew}
                      onChange={handleChange}
                      name="isNew"
                      color="primary"
                    />
                  }
                  label="New Arrival"
                  sx={{ mb: 1 }}
                />
                <Typography variant="caption" color="text.secondary" display="block">
                  Mark this product as a new arrival
                </Typography>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Form Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button 
              onClick={() => router.push('/admin/products')} 
              startIcon={<Cancel />}
              disabled={loading}
              size="large"
              sx={{ minWidth: 120 }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              disabled={loading}
              size="large"
              sx={{ 
                bgcolor: '#2196f3',
                '&:hover': { bgcolor: '#1976d2' },
                minWidth: 150,
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
              }}
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
}