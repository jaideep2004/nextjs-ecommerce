'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Badge,
  InputBase,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  AccountCircle,
  ShoppingCart,
  Favorite,
  Close,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { itemsCount } = useCart();
  const router = useRouter();
  
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    handleCloseUserMenu();
  };

  const categories = [
    { name: 'Punjabi Suits', href: '/category/punjabi-suits' },
    { name: 'Turbans', href: '/category/turbans' },
    { name: 'Accessories', href: '/category/accessories' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" component="div">
          Punjabi Attire
        </Typography>
        <IconButton color="inherit">
          <Close />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {categories.map((category) => (
          <ListItem key={category.name} disablePadding>
            <ListItemButton component={Link} href={category.href} sx={{ textAlign: 'center' }}>
              <ListItemText primary={category.name} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/products" sx={{ textAlign: 'center' }}>
            <ListItemText primary="All Products" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#5D4037' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobile menu button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleDrawerToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            PUNJABI ATTIRE
          </Typography>

          {/* Desktop navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {categories.map((category) => (
              <Button
                key={category.name}
                component={Link}
                href={category.href}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {category.name}
              </Button>
            ))}
            <Button
              component={Link}
              href="/products"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              All Products
            </Button>
          </Box>

          {/* Search */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <form onSubmit={handleSearch}>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </Search>

          {/* Cart icon */}
          <Box sx={{ display: 'flex' }}>
            <IconButton
              size="large"
              aria-label="show cart items"
              color="inherit"
              component={Link}
              href="/cart"
            >
              <Badge badgeContent={itemsCount} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* Wishlist icon */}
            <IconButton
              size="large"
              aria-label="show wishlist"
              color="inherit"
              component={Link}
              href="/wishlist"
            >
              <Favorite />
            </IconButton>

            {/* User menu */}
            {isAuthenticated ? (
              <Box sx={{ flexGrow: 0, ml: 1 }}>
                <Tooltip title={user?.name || 'User Settings'}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar 
                      alt={user?.name || 'User'} 
                      src={user?.avatar || '/static/images/avatar/default.jpg'}
                      sx={{ bgcolor: user?.avatar ? 'transparent' : '#8D6E63', width: 32, height: 32 }}
                    >
                      {!user?.avatar && user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Box sx={{ px: 2, py: 1, textAlign: 'center' }}>
                    <Typography variant="subtitle1">{user?.name || 'User'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email || ''}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem component={Link} href="/profile" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem component={Link} href="/orders" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">My Orders</Typography>
                  </MenuItem>
                  {isAdmin && (
                    <MenuItem component={Link} href="/admin/dashboard" onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">Admin Dashboard</Typography>
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button color="inherit" component={Link} href="/login">
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;