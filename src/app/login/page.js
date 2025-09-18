'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  useTheme,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  LockOutlined,
  EmailOutlined,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import FormField from '@/components/ui/FormField';

export default function LoginPage() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  
  // Update background based on theme mode
  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.mode === 'dark' ? '#000000' : '#ffffff';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [theme.palette.mode]);
  
  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (user.isAdmin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/customer/dashboard');
      }
    }
  }, [user, authLoading, router]);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError('');
      await login(formData.email, formData.password);
      // Redirect is handled in the AuthContext after successful login
      return;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setError('');
      
      // Get redirect URL from query parameters if it exists
      let redirectUrl = '';
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        redirectUrl = urlParams.get('redirect') || '';
      }
      
      // Use NextAuth signIn with Google provider
      const result = await signIn('google', {
        callbackUrl: redirectUrl || '/customer/dashboard',
        redirect: true, // Let NextAuth handle the redirect
      });
      
      if (result?.error) {
        setError('Google Sign-In failed. Please try again.');
      }
    } catch (err) {
      console.error('Google Sign-In error:', err);
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: theme.palette.mode === 'dark' ? '#000000' : 'white',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle Background Elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        {/* Light subtle shapes using site colors */}
        <Box sx={{
          position: 'absolute',
          top: '5%',
          right: '10%',
          width: { xs: 120, md: 180 },
          height: { xs: 120, md: 180 },
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(162, 146, 120, 0.03), rgba(162, 146, 120, 0.01))',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite',
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '15%',
          left: '8%',
          width: { xs: 80, md: 120 },
          height: { xs: 80, md: 120 },
          borderRadius: '20px',
          background: 'rgba(162, 146, 120, 0.02)',
          filter: 'blur(30px)',
          transform: 'rotate(45deg)',
          animation: 'float 8s ease-in-out infinite reverse',
        }} />
        <Box sx={{
          position: 'absolute',
          top: '40%',
          right: '5%',
          width: { xs: 60, md: 100 },
          height: { xs: 60, md: 100 },
          borderRadius: '15px',
          background: 'rgba(162, 146, 120, 0.015)',
          filter: 'blur(25px)',
          transform: 'rotate(-30deg)',
          animation: 'float 10s ease-in-out infinite',
        }} />
      </Box>

      {/* Floating Animation Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Breadcrumbs */}
     

        <Grid   
          container 
          spacing={4} 
          alignItems="center" 
          sx={{ 
            minHeight: 'calc(100vh - 200px)',
            flexWrap: 'nowrap',
            '@media (max-width: 960px)': {
              flexWrap: 'wrap',
            }
          }}
        >
          {/* Left Side - Welcome Content */}
          <Grid item xs={12} lg={6} style={{ flex: '1' }}>
            <Box sx={{ 
              textAlign: { xs: 'center', lg: 'left' },
              color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50',
              pr: { lg: 4 },
              
            }}>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '3.5rem' },
                  lineHeight: 1.2,
                  mb: 3,
                  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50',
                  textAlign: 'center',
                }}
              >
                Welcome Back!
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 400,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  lineHeight: 1.6,
                  mb: 4,
                  color: theme.palette.mode === 'dark' ? '#CCCCCC' : '#5f6368',
                  // maxWidth: { lg: '500px' }
                }}
              >
                Sign in to your India Inspired account to continue your journey with authentic fashion and traditional elegance.
              </Typography>
              
              {/* Features */}
              <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                <Grid container spacing={3} style={{flexWrap: 'nowrap'}}>
                  <Grid item xs={6} style={{flex: '1'}}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Box sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: 'rgba(162, 146, 120, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                      }}>
                        <LockOutlined sx={{ fontSize: 28, color: '#a29278' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50' }}>Secure Login</Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#CCCCCC' : '#5f6368' }}>Your data is protected with enterprise-grade security</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} style={{flex: '1'}}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Box sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: 'rgba(162, 146, 120, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                      }}>
                        <GoogleIcon sx={{ fontSize: 28, color: '#a29278' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50' }}>Quick Access</Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#CCCCCC' : '#5f6368' }}>Sign in with Google or your email account</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
          
          {/* Right Side - Login Form */}
          <Grid item xs={12} lg={6} style={{ flex: '1' }}>
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
             
            }}>
              <Card sx={{
                width: '100%',
                maxWidth: 480,
                borderRadius: 3,
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 4px 20px rgba(162, 146, 120, 0.3)' 
                  : '0 4px 20px rgba(162, 146, 120, 0.15)',
                background: theme.palette.mode === 'dark' ? '#111111' : 'white',
                border: theme.palette.mode === 'dark' 
                  ? '1px solid rgba(162, 146, 120, 0.3)' 
                  : '1px solid rgba(162, 146, 120, 0.1)',
              }}>
                <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                  {/* Logo/Header */}
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #a29278, #8b7d65)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 10px 30px rgba(162, 146, 120, 0.4)',
                    }}>
                      <LockOutlined sx={{ fontSize: 36, color: 'white' }} />
                    </Box>
                    <Typography variant="h4" component="h2" sx={{ 
                      fontWeight: 700,
                      color: 'text.primary',
                      mb: 1
                    }}>
                      Sign In
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Access your account to continue
                    </Typography>
                  </Box>

                  {error && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 3,
                        borderRadius: 2,
                        '& .MuiAlert-message': {
                          fontSize: '0.95rem'
                        }
                      }}
                    >
                      {error}
                    </Alert>
                  )}
                  
                  {/* Google Sign In Button */}
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading || loading}
                    startIcon={googleLoading ? <CircularProgress size={20} /> : <GoogleIcon />}
                    sx={{
                      mb: 3,
                      py: 1.8,
                      borderRadius: 2,
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(162, 146, 120, 0.5)' : '#dadce0',
                      color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#5f6368',
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      background: theme.palette.mode === 'dark' ? 'rgba(26, 26, 26, 0.7)' : 'white',
                      '&:hover': {
                        background: theme.palette.mode === 'dark' ? 'rgba(162, 146, 120, 0.2)' : '#f8f9fa',
                        borderColor: '#a29278',
                        boxShadow: theme.palette.mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                      },
                      '&:disabled': {
                        background: theme.palette.mode === 'dark' ? 'rgba(26, 26, 26, 0.5)' : '#f8f9fa',
                        color: theme.palette.mode === 'dark' ? '#CCCCCC' : '#9aa0a6',
                      }
                    }}
                  >
                    {googleLoading ? 'Signing in...' : 
                      <span style={{ 
                        color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#5f6368',
                        fontWeight: 500
                      }}>
                        Continue with Google
                      </span>
                    }
                  </Button>
                  
                  <Divider sx={{ 
                    my: 3,
                    '&::before, &::after': {
                      borderColor: 'rgba(162, 146, 120, 0.2)',
                    }
                  }}>
                    <Typography variant="body2" color="text.secondary" sx={{ px: 2, fontWeight: 500 }}>
                      OR
                    </Typography>
                  </Divider>
                  
                  {/* Email/Password Form */}
                  <form onSubmit={handleSubmit}>
                    <FormField
                      label="Email Address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      fullWidth
                      margin="normal"
                      type="email"
                      required
                      placeholder="Enter your email"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlined sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          background: theme.palette.mode === 'dark' 
                            ? 'rgba(26, 26, 26, 0.7)' 
                            : 'rgba(248, 248, 248, 0.7)',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#a29278',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#a29278',
                            borderWidth: 2,
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.mode === 'dark' 
                              ? 'rgba(162, 146, 120, 0.5)' 
                              : 'rgba(0, 0, 0, 0.23)',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#a29278',
                        },
                        '& .MuiInputLabel-root': {
                          color: theme.palette.mode === 'dark' 
                            ? '#CCCCCC' 
                            : 'rgba(0, 0, 0, 0.6)',
                        },
                        '& .MuiInputBase-input': {
                          color: theme.palette.mode === 'dark' 
                            ? '#FFFFFF' 
                            : '#000000',
                        },
                      }}
                    />
                    
                    <FormField
                      label="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      error={!!errors.password}
                      helperText={errors.password}
                      fullWidth
                      margin="normal"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                              sx={{ color: 'text.secondary' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 1,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          background: theme.palette.mode === 'dark' 
                            ? 'rgba(26, 26, 26, 0.7)' 
                            : 'rgba(248, 248, 248, 0.7)',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#a29278',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#a29278',
                            borderWidth: 2,
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.mode === 'dark' 
                              ? 'rgba(162, 146, 120, 0.5)' 
                              : 'rgba(0, 0, 0, 0.23)',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#a29278',
                        },
                        '& .MuiInputLabel-root': {
                          color: theme.palette.mode === 'dark' 
                            ? '#CCCCCC' 
                            : 'rgba(0, 0, 0, 0.6)',
                        },
                        '& .MuiInputBase-input': {
                          color: theme.palette.mode === 'dark' 
                            ? '#FFFFFF' 
                            : '#000000',
                        },
                      }}
                    />
                    
                    <Box sx={{ textAlign: 'right', mb: 3 }}>
                      <Link href="/forgot-password" style={{ textDecoration: 'none' }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#a29278',
                            fontWeight: 500,
                            '&:hover': {
                              textDecoration: 'underline',
                            }
                          }}
                        >
                          Forgot Password?
                        </Typography>
                      </Link>
                    </Box>
                    
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={loading || googleLoading}
                      sx={{
                        py: 1.8,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #a29278, #8b7d65)',
                        boxShadow: '0 8px 25px rgba(162, 146, 120, 0.4)',
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #8b7d65, #6d5d4a)',
                          boxShadow: '0 12px 35px rgba(162, 146, 120, 0.5)',
                          transform: 'translateY(-2px)',
                        },
                        '&:disabled': {
                          background: '#f5f5f5',
                          color: '#9e9e9e',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>
                  
                  {/* Register Link */}
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      Don't have an account?
                    </Typography>
                    <Button
                      component={Link}
                      href="/register"
                      variant="text"
                      size="large"
                      sx={{
                        color: '#a29278',
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
                        py: 1,
                        px: 3,
                        borderRadius: 2,
                        '&:hover': {
                          background: 'rgba(162, 146, 120, 0.08)',
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Create Account
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}