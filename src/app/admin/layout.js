'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeContext } from '@/theme';
import { AdminSidebarProvider, useAdminSidebar } from '@/contexts/AdminSidebarContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import {
  Box,
  CssBaseline,
  Container,
  CircularProgress,
  Typography,
} from '@mui/material';

// Inner component that can access the sidebar context
function AdminLayoutContent({ children, user }) {
  const { theme } = useThemeContext();
  const { collapsed, drawerWidth, collapsedDrawerWidth } = useAdminSidebar();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Admin Sidebar */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${collapsed ? collapsedDrawerWidth : drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: theme.palette.mode === 'dark' ? '#000000' : '#f8f9fa',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease',
        }}
      >
        {/* Admin Header */}
        <Box
          sx={{
            bgcolor: theme.palette.mode === 'dark' ? '#111111' : 'white',
            borderBottom: theme.palette.mode === 'dark' ? '1px solid #333333' : '1px solid #e0e0e0',
            boxShadow: theme.palette.mode === 'dark' ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
            zIndex: 1,
            position: 'sticky',
            top: 0,
          }}
        >
          <Container maxWidth="xl" sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2c3e50',
                    mb: 0.5,
                  }}
                >
                  Admin Dashboard
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? '#CCCCCC' : 'text.secondary' 
                  }}
                >
                  Welcome back, {user?.name}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: '8px',
                    bgcolor: '#e8f5e8',
                    border: '1px solid #4caf50',
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#4caf50',
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                    Admin Access
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
        
        {/* Page Content */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login?redirect=/admin/dashboard');
      } else if (!user.isAdmin) {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: useThemeContext().theme.palette.mode === 'dark' ? '#000000' : '#f5f5f5',
        }}
      >
        <CircularProgress sx={{ color: '#8D6E63' }} />
      </Box>
    );
  }

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <AdminSidebarProvider>
      <AdminLayoutContent user={user}>
        {children}
      </AdminLayoutContent>
    </AdminSidebarProvider>
  );
}