'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
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

export default function ProductForm({ product, categories, isEdit = false }) {
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
    images: [],
    colors: [],
    sizes: [],
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState('');
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
        images: product.images || [],
        colors: product.colors || [],
        sizes: product.sizes || [],
      });
      
      if (product.image) {
        setImagePreview(product.image);
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
      // In a real app, you would upload the image to a server/cloud storage
      // and get back a URL to store in formData
      setFormData(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
    
    // Clear error
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
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
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message || 'Failed to save product');
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
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Basic Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Product Slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              error={!!errors.slug}
              helperText={errors.slug || 'URL-friendly version of the name'}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button 
                      onClick={handleSlugGeneration}
                      size="small"
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
              rows={2}
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
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          
          {/* Pricing and Inventory */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Pricing and Inventory
            </Typography>
          </Grid>
          
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
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Old Price (Optional)"
              name="oldPrice" 
              value={formData.oldPrice}
              onChange={handleChange}
              error={!!errors.oldPrice}
              helperText={errors.oldPrice}
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
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.category} required>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
              >
                <MenuItem value=""><em>Select a category</em></MenuItem>
                {categories?.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          
          {/* Product Options */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Product Options
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Colors
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {formData.colors.map((color) => (
                  <Chip
                    key={color}
                    label={color}
                    onDelete={() => handleRemoveColor(color)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex' }}>
                <TextField
                  label="Add Color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  size="small"
                  sx={{ flexGrow: 1, mr: 1 }}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                />
                <Button 
                  onClick={handleAddColor} 
                  variant="outlined"
                  startIcon={<Add />}
                >
                  Add
                </Button>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Sizes
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {formData.sizes.map((size) => (
                  <Chip
                    key={size}
                    label={size}
                    onDelete={() => handleRemoveSize(size)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex' }}>
                <TextField
                  label="Add Size"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  size="small"
                  sx={{ flexGrow: 1, mr: 1 }}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                />
                <Button 
                  onClick={handleAddSize} 
                  variant="outlined"
                  startIcon={<Add />}
                >
                  Add
                </Button>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex' }}>
                <TextField
                  label="Add Tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  size="small"
                  sx={{ flexGrow: 1, mr: 1 }}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button 
                  onClick={handleAddTag} 
                  variant="outlined"
                  startIcon={<Add />}
                >
                  Add
                </Button>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          
          {/* Product Image */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Product Image
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                sx={{ mb: 2 }}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {errors.image && (
                <FormHelperText error>{errors.image}</FormHelperText>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            {imagePreview ? (
              <Box sx={{ position: 'relative', width: '100%', height: 200 }}>
                <Image
                  src={imagePreview}
                  alt="Product preview"
                  fill
                  style={{ objectFit: 'contain' }}
                />
                <IconButton
                  sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(255,255,255,0.7)' }}
                  onClick={() => {
                    setImagePreview('');
                    setFormData(prev => ({ ...prev, image: '' }));
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            ) : (
              <Box 
                sx={{ 
                  width: '100%', 
                  height: 200, 
                  border: '1px dashed #ccc', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: '#f9f9f9',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No image selected
                </Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          
          {/* Product Flags */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Product Flags
            </Typography>
          </Grid>
          
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
            />
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
            />
          </Grid>
          
          {/* Form Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                onClick={() => router.push('/admin/products')} 
                sx={{ mr: 2 }}
                startIcon={<Cancel />}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                disabled={loading}
                sx={{ 
                  bgcolor: '#8D6E63',
                  '&:hover': { bgcolor: '#6D4C41' },
                }}
              >
                {loading ? 'Saving...' : 'Save Product'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}