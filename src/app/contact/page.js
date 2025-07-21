'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
} from '@mui/icons-material';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, you would send the form data to your API
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to send message');
      // }
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
      setSnackbar({
        open: true,
        message: 'Your message has been sent successfully! We will get back to you soon.',
        severity: 'success',
      });
      
    } catch (err) {
      console.error('Error sending message:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to send message. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link href="/" passHref>
          <MuiLink underline="hover" color="inherit">
            Home
          </MuiLink>
        </Link>
        <Typography color="text.primary">Contact Us</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Have questions or feedback? We'd love to hear from you. Fill out the form below or use our contact information to get in touch.
      </Typography>

      <Grid container spacing={4}>
        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
              <LocationIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Address
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  123 Commerce Street<br />
                  Suite 456<br />
                  New York, NY 10001<br />
                  United States
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
              <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Email
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <MuiLink href="mailto:info@yourecommerce.com" underline="hover">
                    info@yourecommerce.com
                  </MuiLink>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <MuiLink href="mailto:support@yourecommerce.com" underline="hover">
                    support@yourecommerce.com
                  </MuiLink>
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
              <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Phone
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <MuiLink href="tel:+1-800-123-4567" underline="hover">
                    +1 (800) 123-4567
                  </MuiLink> (Sales)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <MuiLink href="tel:+1-800-765-4321" underline="hover">
                    +1 (800) 765-4321
                  </MuiLink> (Support)
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
              Business Hours
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monday - Friday: 9:00 AM - 6:00 PM EST<br />
              Saturday: 10:00 AM - 4:00 PM EST<br />
              Sunday: Closed
            </Typography>
          </Paper>
        </Grid>
        
        {/* Contact Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Send Us a Message
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Your Name"
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
                    label="Your Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    error={!!errors.subject}
                    helperText={errors.subject}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Your Message"
                    name="message"
                    multiline
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    error={!!errors.message}
                    helperText={errors.message}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
        
        {/* Map */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Our Location
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ height: 400, width: '100%', position: 'relative' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215256349542!2d-73.99830082346288!3d40.75097623440235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9aeb1c6b5%3A0x35b1cfbc89a6097f!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1690214215440!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Store Location"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

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
    </Container>
  );
}