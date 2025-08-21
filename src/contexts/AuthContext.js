'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with default config
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Ensure cookies are sent with requests
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
            console.log('Added Authorization header:', config.headers.Authorization);
          } else {
            console.warn('No token found in user data');
          }
        } else {
          console.warn('No user data found in localStorage');
        }
      } catch (error) {
        console.error('Error setting auth header:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      const reqUrl = error?.config?.url || '';
      const isOnProtectedPage =
        typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

      // Never auto-redirect for /auth/me unless already on a protected page
      const isAuthMe = reqUrl.startsWith('/auth/me');

      if (isOnProtectedPage && !isAuthMe) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          const redirect = encodeURIComponent(window.location.pathname + window.location.search);
          window.location.href = `/login?session=expired&redirect=${redirect}`;
        }
      }
      // On public pages, do not redirect. Let pages/components decide.
    }
    return Promise.reject(error);
  }
);

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Function to persist user data in localStorage
  const persistUser = (userData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  // Function to get user data from localStorage
  const getPersistedUser = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  };

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkUserLoggedIn = async () => {
      try {
        // First try to get user from localStorage
        const persistedUser = getPersistedUser();
        
        if (persistedUser) {
          // Set the authorization header if we have a token
          if (persistedUser.token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${persistedUser.token}`;
          }
          
          // Set user immediately for better UX
          setUser(persistedUser);
          setLoading(false);
        }

        // Then verify with the server
        const { data } = await api.get('/auth/me');
        const userData = data.user || data; // Accept both { user: ... } and direct user object
        
        // Make sure we have the latest token
        if (persistedUser?.token) {
          userData.token = persistedUser.token;
        }
        
        setUser(userData);
        persistUser(userData);
      } catch (error) {
        console.error('Auth verification error:', error);
        // If server verification fails but we have persisted user, keep using it
        // This helps with temporary API issues while maintaining user session
        const persistedUser = getPersistedUser();
        if (persistedUser) {
          // Keep using persisted user if available
          setUser(persistedUser);
        } else {
          // Only clear if we don't have a persisted user
          setUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await api.post('/auth/login', { email, password });
      
      // The API returns { data: { user, token }, status, message }
      const user = data.data?.user || data;
      const token = data.data?.token || data.token;
      
      if (!token) {
        throw new Error('No authentication token received');
      }
      
      // Add token to user object for localStorage
      const userWithToken = { ...user, token };
      setUser(userWithToken);
      
      // Persist user data with token in localStorage
      persistUser(userWithToken);
      
      // Set default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      toast.success('Logged in successfully');
      // Get redirect URL from query parameters if it exists
      let redirectUrl = '';
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        redirectUrl = urlParams.get('redirect') || '';
      }
      setTimeout(() => {
        if (redirectUrl) {
          router.push(redirectUrl);
        } else if (user && user.isAdmin) {
          router.push('/admin/dashboard');
        } else {
          router.push('/customer/dashboard');
        }
      }, 100);
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const { data } = await api.post('/auth/register', userData);
      setUser(data.user);
      if (data.token) {
        // Set default authorization header for subsequent requests
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      }
      toast.success('Registered successfully');
      router.push('/');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      // Clear all auth related data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
      }
      router.push('/login');
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const { data } = await axios.put('/api/auth/update', userData);
      setUser(data.user);
      
      // Update user data in localStorage
      persistUser(data.user);
      
      toast.success('Profile updated successfully');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}