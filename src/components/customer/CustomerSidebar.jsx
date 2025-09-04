'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingBag as OrdersIcon,
  Favorite as WishlistIcon,
  Person as ProfileIcon,
  LocationOn as AddressIcon,
  VpnKey as PasswordIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

const drawerWidth = 280;

// Helper function to get user initials and color
const getUserInitials = (name) => {
  if (!name) return 'U';
  const nameParts = name.trim().split(' ');
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
};

const getUserAvatarColor = (name) => {
  if (!name) return '#8D6E63';
  
  const colors = [
    '#E57373', '#F06292', '#BA68C8', '#9575CD', 
    '#7986CB', '#64B5F6', '#4FC3F7', '#4DD0E1', 
    '#4DB6AC', '#81C784', '#AED581', '#FFB74D', 
    '#FF8A65', '#A1887F', '#90A4AE'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

export default function CustomerSidebar({ activeTab = 'profile', onTabChange }) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const menuItems = [
    { text: 'Profile', icon: <ProfileIcon />, value: 'profile' },
    { text: 'Orders', icon: <OrdersIcon />, value: 'orders' },
    { text: 'Addresses', icon: <AddressIcon />, value: 'addresses' },
    { text: 'Password', icon: <PasswordIcon />, value: 'password' },
    { text: 'Wishlist', icon: <WishlistIcon />, href: '/customer/wishlist' },
  ];

  const userInitials = getUserInitials(user?.name);
  const avatarColor = getUserAvatarColor(user?.name);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo and Brand */}
      <Box 
        sx={{ 
          p: 3, 
          display: 'flex', 
          alignItems: 'center', 
          borderBottom: '1px solid #e0e0e0',
          bgcolor: '#f8f9fa',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <img 
            src="/images/lp3.png" 
            alt="Customer Portal" 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: '#2c3e50',
                fontSize: '1.1rem',
                lineHeight: 1.2,
              }}
            >
              My Account
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#7f8c8d',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              Customer Portal
            </Typography>
          </Box>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ ml: 'auto' }}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      {/* User Info */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              width: 36, 
              height: 36, 
              bgcolor: avatarColor,
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            {userInitials}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600,
                color: '#2c3e50',
                fontSize: '0.85rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user?.name || 'Customer'}
            </Typography>
            <Chip 
              label="Customer" 
              size="small" 
              sx={{ 
                height: '18px',
                fontSize: '0.65rem',
                fontWeight: 600,
                bgcolor: '#e3f2fd',
                color: '#1976d2',
                '& .MuiChip-label': { px: 1 },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ py: 1 }}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.value;
            return (
              <ListItem key={item.text} disablePadding sx={{ px: 1, mb: 0.5 }}>
                <ListItemButton
                  component={item.href ? Link : 'div'}
                  href={item.href}
                  onClick={item.href ? undefined : () => onTabChange?.(item.value)}
                  selected={isActive}
                  sx={{
                    borderRadius: '8px',
                    mx: 1,
                    py: 1.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: '#f0f7ff',
                      transform: 'translateX(4px)',
                    },
                    '&.Mui-selected': {
                      bgcolor: '#e3f2fd',
                      borderLeft: '3px solid #2196f3',
                      '&:hover': {
                        bgcolor: '#e3f2fd',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? '#2196f3' : '#6c757d',
                      minWidth: 40,
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? '#2196f3' : '#2c3e50',
                        fontSize: '0.9rem',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Bottom Actions */}
      <Box sx={{ borderTop: '1px solid #e0e0e0', p: 1 }}>
        <List>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              href="/"
              sx={{
                borderRadius: '8px',
                mx: 1,
                py: 1.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#f8f9fa',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#6c757d', minWidth: 40 }}>
                <StoreIcon />
              </ListItemIcon>
              <ListItemText
                primary="Continue Shopping"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#2c3e50',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: '8px',
                mx: 1,
                py: 1.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#ffeaa7',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#f39c12', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#f39c12',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ 
            position: 'fixed', 
            top: 16, 
            left: 16, 
            zIndex: 1300, 
            bgcolor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            '&:hover': {
              bgcolor: '#f5f5f5',
            },
          }}
        >
          <MenuIcon sx={{ color: '#2c3e50' }} />
        </IconButton>
      )}
      <Box
        component="nav"
        sx={{ 
          width: { md: drawerWidth }, 
          flexShrink: { md: 0 },
          zIndex: 1200,
        }}
        aria-label="customer navigation"
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={open}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                border: 'none',
                boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                border: 'none',
                boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
                bgcolor: '#ffffff',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
    </>
  );
}