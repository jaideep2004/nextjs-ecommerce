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
      {/* <Box
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
      </Box> */}

      {/* Contact Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>

        <Grid container spacing={{ xs: 3, md: 4 }} sx={{ alignItems: 'stretch', minHeight: { xs: 'auto', md: '600px' }, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
          {/* Contact Information */}
          <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }} style={{flex:'1'}}>
            <Box sx={{ 
              pr: { md: 2 }, 
              pt: { xs: 2, md: 0 },
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column' 
            }}>
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
                sx={{ 
                  mb: { xs: 3, md: 4 }, 
                  lineHeight: 1.7,
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  textAlign: { xs: 'center', md: 'left' },
                  px: { xs: 1, md: 0 }
                }}
              >
                Ready to start your shopping journey? Reach out to us through any of these channels.
              </Typography>

              {/* Contact Cards */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: { xs: 2, md: 3 }, 
                flex: 1, 
                justifyContent: { xs: 'flex-start', md: 'space-between' },
                px: { xs: 1, md: 0 }
              }}>
                {/* Email Card */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: { xs: 2.5, md: 3 },
                    border: '2px solid',
                    borderColor: 'grey.100',
                    borderRadius: { xs: 2, md: 3 },
                    transition: 'all 0.3s ease',
                    flex: { xs: 'none', md: 1 },
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: { xs: 'translateY(-1px)', md: 'translateY(-2px)' },
                      boxShadow: { xs: '0 4px 15px rgba(93, 64, 55, 0.12)', md: '0 8px 25px rgba(93, 64, 55, 0.15)' },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: { xs: 'center', md: 'flex-start' }, width: '100%' }}>
                    <Box
                      sx={{
                        width: { xs: 44, md: 48 },
                        height: { xs: 44, md: 48 },
                        borderRadius: { xs: '10px', md: '12px' },
                        background: 'linear-gradient(135deg, #FFA000 0%, #FF8F00 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: { xs: 1.5, md: 2 },
                        flexShrink: 0,
                      }}
                    >
                      <EmailIcon sx={{ color: 'white', fontSize: { xs: 20, md: 24 } }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        mb: { xs: 0.5, md: 1 },
                        fontSize: { xs: '1rem', md: '1.25rem' }
                      }}>
                        Email Us
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        mb: { xs: 0.5, md: 1 },
                        fontSize: { xs: '0.875rem', md: '0.875rem' }
                      }}>
                        <MuiLink 
                          href="mailto:info@ecommerce.com" 
                          underline="hover"
                          sx={{ color: 'primary.main', fontWeight: 500 }}
                        >
                          info@ecommerce.com
                        </MuiLink>
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{
                        fontSize: { xs: '0.875rem', md: '0.875rem' }
                      }}>
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
                    p: { xs: 2.5, md: 3 },
                    border: '2px solid',
                    borderColor: 'grey.100',
                    borderRadius: { xs: 2, md: 3 },
                    transition: 'all 0.3s ease',
                    flex: { xs: 'none', md: 1 },
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: { xs: 'translateY(-1px)', md: 'translateY(-2px)' },
                      boxShadow: { xs: '0 4px 15px rgba(93, 64, 55, 0.12)', md: '0 8px 25px rgba(93, 64, 55, 0.15)' },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: { xs: 'center', md: 'flex-start' }, width: '100%' }}>
                    <Box
                      sx={{
                        width: { xs: 44, md: 48 },
                        height: { xs: 44, md: 48 },
                        borderRadius: { xs: '10px', md: '12px' },
                        background: 'linear-gradient(135deg, #5D4037 0%, #3E2723 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: { xs: 1.5, md: 2 },
                        flexShrink: 0,
                      }}
                    >
                      <PhoneIcon sx={{ color: 'white', fontSize: { xs: 20, md: 24 } }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        mb: { xs: 0.5, md: 1 },
                        fontSize: { xs: '1rem', md: '1.25rem' }
                      }}>
                        Call Us
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        mb: { xs: 0.5, md: 1 },
                        fontSize: { xs: '0.875rem', md: '0.875rem' },
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: { xs: 0, sm: 1 }
                      }}>
                        <MuiLink 
                          href="tel:+1-800-123-4567" 
                          underline="hover"
                          sx={{ color: 'primary.main', fontWeight: 500 }}
                        >
                          +1 (800) 123-4567
                        </MuiLink>
                        <Typography component="span" sx={{ 
                          color: 'text.secondary',
                          fontSize: { xs: '0.75rem', md: '0.875rem' },
                          fontStyle: 'italic'
                        }}>
                          Sales
                        </Typography>
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{
                        fontSize: { xs: '0.875rem', md: '0.875rem' },
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: { xs: 0, sm: 1 }
                      }}>
                        <MuiLink 
                          href="tel:+1-800-765-4321" 
                          underline="hover"
                          sx={{ color: 'primary.main', fontWeight: 500 }}
                        >
                          +1 (800) 765-4321
                        </MuiLink>
                        <Typography component="span" sx={{ 
                          color: 'text.secondary',
                          fontSize: { xs: '0.75rem', md: '0.875rem' },
                          fontStyle: 'italic'
                        }}>
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
                    p: { xs: 2.5, md: 3 },
                    border: '2px solid',
                    borderColor: 'grey.100',
                    borderRadius: { xs: 2, md: 3 },
                    transition: 'all 0.3s ease',
                    flex: { xs: 'none', md: 1 },
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: { xs: 'translateY(-1px)', md: 'translateY(-2px)' },
                      boxShadow: { xs: '0 4px 15px rgba(93, 64, 55, 0.12)', md: '0 8px 25px rgba(93, 64, 55, 0.15)' },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: { xs: 'center', md: 'flex-start' }, width: '100%' }}>
                    <Box
                      sx={{
                        width: { xs: 44, md: 48 },
                        height: { xs: 44, md: 48 },
                        borderRadius: { xs: '10px', md: '12px' },
                        background: 'linear-gradient(135deg, #388E3C 0%, #2E7D32 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: { xs: 1.5, md: 2 },
                        flexShrink: 0,
                      }}
                    >
                      <TimeIcon sx={{ color: 'white', fontSize: { xs: 20, md: 24 } }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        mb: { xs: 0.5, md: 1 },
                        fontSize: { xs: '1rem', md: '1.25rem' }
                      }}>
                        Business Hours
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: { xs: 0.3, md: 0.5 }
                      }}>
                        <Typography variant="body2" sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          fontSize: { xs: '0.8rem', md: '0.875rem' },
                          flexDirection: { xs: 'row', sm: 'row' }
                        }}>
                          <span>Monday - Friday:</span>
                          <span style={{ fontWeight: 500, color: '#5D4037' }}>9:00 AM - 6:00 PM</span>
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          fontSize: { xs: '0.8rem', md: '0.875rem' }
                        }}>
                          <span>Saturday:</span>
                          <span style={{ fontWeight: 500, color: '#5D4037' }}>10:00 AM - 4:00 PM</span>
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          fontSize: { xs: '0.8rem', md: '0.875rem' }
                        }}>
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
          <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }} style={{flex:'1'}}>
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110180.69773653465!2d76.32665220262716!3d30.34677746323181!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391028935a3313df%3A0xd5bc56ad3b90bc7f!2sPatiala%2C%20Punjab!5e0!3m2!1sen!2sin!4v1758196441712!5m2!1sen!2sin"
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