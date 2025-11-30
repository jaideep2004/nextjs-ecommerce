'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, getSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with default config
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Ensure cookies are sent with requests
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    // Log request details for debugging
    console.log('API Request:', config.method?.toUpperCase(), config.url);
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
  const { data: session, status } = useSession();
  
  console.log('AuthProvider render:', { user, loading, session, status });

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
        // First check NextAuth session
        if (status === 'loading') {
          return; // Wait for NextAuth to finish loading
        }
        
        if (session?.user) {
          // User is authenticated via NextAuth (Google)
          console.log('User authenticated via NextAuth:', session.user.email);
          
          // Convert NextAuth session to our user format
          // Ensure consistent ID format (convert to string)
          const nextAuthUser = {
            _id: (session.user.userId || session.user.id || '').toString(),
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            isAdmin: session.user.isAdmin || false,
            provider: 'google'
          };
          
          setUser(nextAuthUser);
          persistUser(nextAuthUser);
          setLoading(false);
          return;
        }
        
        // If no NextAuth session, check for custom JWT authentication
        // First try to get user from localStorage for immediate UX
        const persistedUser = getPersistedUser();
        
        if (persistedUser && !persistedUser.provider) {
          // Set user immediately for better UX (only for custom auth users)
          setUser(persistedUser);
        }

        // Always verify with the server using cookies or NextAuth
        // The server will check both httpOnly cookies and NextAuth sessions
        try {
          const { data } = await api.get('/auth/me');
          const userData = data.data || data; // Accept both { data: { user: ... } } and direct user object
          
          // Server verified user via cookies or NextAuth - update local data
          setUser(userData);
          persistUser(userData); // Save user data (without token) to localStorage
          
          console.log('User authenticated via server:', userData.name, userData.provider || 'custom');
        } catch (serverError) {
          console.log('Server authentication check failed (likely logged out):', serverError.response?.status);
          
          // Only clear session if it's actually a 401/403 error, not network issues
          // For Google users, don't clear the session immediately as NextAuth might still be valid
          const isGoogleUser = user?.provider === 'google' || session?.user;
          if (!isGoogleUser && (serverError.response?.status === 401 || serverError.response?.status === 403)) {
            setUser(null);
            if (typeof window !== 'undefined') {
              localStorage.removeItem('user');
              delete api.defaults.headers.common['Authorization'];
            }
          } else if (!isGoogleUser) {
            // For network errors or other issues, keep the user logged in locally
            console.log('Network error during auth check, maintaining local session');
          }
          // For Google users, we keep the session as NextAuth will handle it
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Only clear data for non-Google users
        const isGoogleUser = user?.provider === 'google' || session?.user;
        if (!isGoogleUser) {
          setUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            delete api.defaults.headers.common['Authorization'];
          }
        }
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, [session, status]); // Re-run when NextAuth session changes

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await api.post('/auth/login', { email, password });
      
      // The API returns { data: { user, token }, status, message }
      // The server sets httpOnly cookies automatically
      const userData = data.data?.user || data;
      
      if (!userData) {
        throw new Error('No user data received');
      }
      
      setUser(userData);
      
      // Persist user data (without token) in localStorage for better UX
      // The actual authentication will be handled by httpOnly cookies
      persistUser(userData);
      
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
        } else if (userData && userData.isAdmin) {
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
      
      // The API returns { data: { user, token }, status, message }
      // The server sets httpOnly cookies automatically
      const user = data.data?.user || data.user || data;
      
      if (user) {
        setUser(user);
        // Persist user data (without token) in localStorage for better UX
        persistUser(user);
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
      // If user was authenticated via NextAuth (Google), sign them out
      if (user?.provider === 'google' || session?.user) {
        const { signOut } = await import('next-auth/react');
        await signOut({ redirect: false });
      }
      
      // Always try to call custom logout endpoint for JWT users
      try {
        await api.post('/auth/logout');
      } catch (error) {
        console.log('Custom logout failed (likely not a JWT user):', error.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      // Clear user data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      router.push('/login');
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const { data } = await api.put('/auth/update', userData);
      
      // Update user data from server response
      const updatedUser = data.data?.user || data;
      
      setUser(updatedUser);
      
      // Update user data in localStorage (without token)
      persistUser(updatedUser);
      
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
        api, // Add the api instance to the context value
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}