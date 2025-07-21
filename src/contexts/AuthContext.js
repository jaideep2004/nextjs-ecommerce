'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

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
          setUser(persistedUser);
          setLoading(false); // Set loading to false immediately after getting persisted user
        }

        // Then verify with the server
        const { data } = await axios.get('/api/auth/me');
        const userData = data.user || data; // Accept both { user: ... } and direct user object
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
      const { data } = await axios.post('/api/auth/login', { email, password });
      const user = data.data?.user || data.user;
      setUser(user);
      
      // Persist user data in localStorage
      persistUser(user);
      
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
      const { data } = await axios.post('/api/auth/register', userData);
      setUser(data.user);
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
      await axios.post('/api/auth/logout');
      setUser(null);
      
      // Remove user data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Logout failed');
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