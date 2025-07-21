'use client';

import { useState } from 'react';
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
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  Category as CategoriesIcon,
  ShoppingCart as OrdersIcon,
  People as CustomersIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

const drawerWidth = 240;

export default function AdminSidebar() {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
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
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Products', icon: <ProductsIcon />, path: '/admin/products' },
    { text: 'Categories', icon: <CategoriesIcon />, path: '/admin/categories' },
    { text: 'Orders', icon: <OrdersIcon />, path: '/admin/orders' },
    { text: 'Customers', icon: <CustomersIcon />, path: '/admin/customers' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  const drawer = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Admin Panel
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <Link href={item.path} key={item.text} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem disablePadding>
              <ListItemButton selected={pathname === item.path}>
                <ListItemIcon
                  sx={{
                    color: pathname === item.path ? theme.palette.primary.main : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: pathname === item.path ? 'bold' : 'regular',
                      color: pathname === item.path ? theme.palette.primary.main : 'inherit',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      <List>
        <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Back to Store" />
            </ListItemButton>
          </ListItem>
        </Link>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  return (
    <>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, position: 'fixed', top: 10, left: 10, zIndex: 1100, bgcolor: 'background.paper' }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="admin navigation"
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={open}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile
            }}
            sx={{
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
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