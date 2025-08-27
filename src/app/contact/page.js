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
  AccessTime as TimeIcon,
  Business as BusinessIcon,
  Support as SupportIcon,
  ContactSupport as ContactIcon,
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
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #5D4037 0%, #3E2723 100%)',
          color: 'white',
          py: { xs: 6, md: 8 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        

          <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Get In Touch
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                fontWeight: 400,
                lineHeight: 1.6,
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Have questions about our products or need support? We're here to help you every step of the way.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Contact Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>

        <Grid container spacing={4} sx={{ alignItems: 'stretch', minHeight: '600px', flexWrap: 'nowrap' }}>
          {/* Contact Information */}
          <Grid item xs={12} md={6} style={{ flex: 1 }}>
            <Box sx={{ pr: { md: 2 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: 'primary.main',
                  mb: 2,
                  fontSize: { xs: '1.75rem', md: '2.125rem' },
                }}
              >
                Contact Information
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ mb: 4, lineHeight: 1.7 }}
              >
                Ready to start your shopping journey? Reach out to us through any of these channels.
              </Typography>

              {/* Contact Cards */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, justifyContent: 'space-between' }}>
                {/* Email Card */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3,
                    border: '2px solid',
                    borderColor: 'grey.100',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(93, 64, 55, 0.15)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #FFA000 0%, #FF8F00 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        flexShrink: 0,
                      }}
                    >
                      <EmailIcon sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Email Us
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <MuiLink 
                          href="mailto:info@ecommerce.com" 
                          underline="hover"
                          sx={{ color: 'primary.main', fontWeight: 500 }}
                        >
                          info@ecommerce.com
                        </MuiLink>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <MuiLink 
                          href="mailto:support@ecommerce.com" 
                          underline="hover"
                          sx={{ color: 'primary.main', fontWeight: 500 }}
                        >
                          support@ecommerce.com
                        </MuiLink>
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                {/* Phone Card */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3,
                    border: '2px solid',
                    borderColor: 'grey.100',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(93, 64, 55, 0.15)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #5D4037 0%, #3E2723 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        flexShrink: 0,
                      }}
                    >
                      <PhoneIcon sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Call Us
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <MuiLink 
                          href="tel:+1-800-123-4567" 
                          underline="hover"
                          sx={{ color: 'primary.main', fontWeight: 500 }}
                        >
                          +1 (800) 123-4567
                        </MuiLink>
                        <Typography component="span" sx={{ color: 'text.secondary', ml: 1 }}>
                          Sales
                        </Typography>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <MuiLink 
                          href="tel:+1-800-765-4321" 
                          underline="hover"
                          sx={{ color: 'primary.main', fontWeight: 500 }}
                        >
                          +1 (800) 765-4321
                        </MuiLink>
                        <Typography component="span" sx={{ color: 'text.secondary', ml: 1 }}>
                          Support
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                {/* Business Hours Card */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3,
                    border: '2px solid',
                    borderColor: 'grey.100',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(93, 64, 55, 0.15)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #388E3C 0%, #2E7D32 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        flexShrink: 0,
                      }}
                    >
                      <TimeIcon sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Business Hours
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Monday - Friday:</span>
                          <span style={{ fontWeight: 500, color: '#5D4037' }}>9:00 AM - 6:00 PM</span>
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Saturday:</span>
                          <span style={{ fontWeight: 500, color: '#5D4037' }}>10:00 AM - 4:00 PM</span>
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Sunday:</span>
                          <span style={{ fontWeight: 500, color: '#757575' }}>Closed</span>
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={6} style={{ flex: 1 }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                border: '2px solid',
                borderColor: 'grey.100',
                borderRadius: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: 'primary.main',
                  mb: 2,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                Send us a message
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <form onSubmit={handleSubmit} noValidate >
                <Grid container spacing={2} sx={{ flex: 1 }} style={{display: 'flex', flexDirection: 'column' }}>
                  <Grid item xs={12} >
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
                  <Grid item xs={12}>
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
      </Grid>
      </Container>

      {/* Map Section */}
      <Box 
        sx={{ 
          background: (theme) => theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
            : 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
          py: { xs: 6, md: 8 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: (theme) => theme.palette.mode === 'dark'
              ? 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/svg%3E")'
              : 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23000000" fill-opacity="0.02"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h2"
              sx={{ 
                fontWeight: 700,
                color: 'primary.main',
                mb: 2,
                fontSize: { xs: '2rem', md: '2.75rem' },
              }}
            >
              Visit Our Store
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '1rem', md: '1.125rem' },
                fontWeight: 400,
                lineHeight: 1.6,
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Find us at the heart of the city. We're always ready to welcome you with our premium collection.
            </Typography>
          </Box>

          <Paper 
            elevation={8}
            sx={{ 
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'background.paper',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: (theme) => theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0%, rgba(93, 64, 55, 0.1) 100%)'
                  : 'linear-gradient(45deg, rgba(93, 64, 55, 0.1) 0%, rgba(255, 160, 0, 0.1) 100%)',
                zIndex: 1,
                pointerEvents: 'none',
              },
            }}
          >
            <Box sx={{ height: { xs: 350, md: 500 }, width: '100%', position: 'relative' }}>
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

          {/* Store Details */}
         
        </Container>
      </Box>

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