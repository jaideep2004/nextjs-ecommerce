'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useThemeContext } from '@/theme';
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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Badge,
  InputBase,
  alpha,
  styled,
  useScrollTrigger,
  Slide,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  AccountCircle,
  ShoppingCart,
  Favorite,
  Close as CloseIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';

// Styled search component
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
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));



// Hide on scroll
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { cartItems } = useCart();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistItemCount, setWishlistItemCount] = useState(0); // We'll keep this for now but not display it
  const { mode, toggleTheme } = useThemeContext();

  // Get real data from contexts
  useEffect(() => {
    // Calculate cart count from cartItems
    if (cartItems && cartItems.length > 0) {
      setCartItemCount(cartItems.length);
    } else {
      setCartItemCount(0);
    }
  }, [cartItems]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const toggleMobileDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setMobileDrawerOpen(open);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const { logout } = useAuth();
  
  const handleLogout = async () => {
    // Handle logout logic here
    await logout();
    handleCloseUserMenu();
  };

  // Navigation items
  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'New Arrivals', path: '/products/new-arrivals' },
    { name: 'Sale', path: '/products/sale' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  // User menu items
  const userMenuItems = user
    ? [
        { name: 'Profile', icon: <PersonIcon fontSize="small" />, path: '/customer/dashboard' },
        { name: 'My Orders', icon: <ShoppingCart fontSize="small" />, path: '/customer/orders' },
        { name: 'Wishlist', icon: <Favorite fontSize="small" />, path: '/customer/wishlist' },
        { name: 'Logout', icon: <LogoutIcon fontSize="small" />, action: handleLogout },
      ]
    : [
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' },
      ];

  // Admin menu items
  const adminMenuItems = user && user.isAdmin
    ? [
        { name: 'Dashboard', icon: <DashboardIcon fontSize="small" />, path: '/admin/dashboard' },
        { name: 'Products', icon: <ShoppingCart fontSize="small" />, path: '/admin/products' },
        { name: 'Orders', icon: <ShoppingCart fontSize="small" />, path: '/admin/orders' },
        { name: 'Customers', icon: <PersonIcon fontSize="small" />, path: '/admin/customers' },
        { name: 'Settings', icon: <SettingsIcon fontSize="small" />, path: '/admin/settings' },
      ]
    : [];

  // Mobile drawer content
  const mobileDrawerContent = (
    <Box
      sx={{ width: 280 }}
      role="presentation"
      onClick={toggleMobileDrawer(false)}
      onKeyDown={toggleMobileDrawer(false)}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" component="div">
          Menu
        </Typography>
        <IconButton onClick={toggleMobileDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {pages.map((page) => (
          <ListItem key={page.name} disablePadding>
            <ListItemButton 
              component={Link} 
              href={page.path}
              selected={pathname === page.path}
            >
              <ListItemText primary={page.name} />
              {page.name === 'Sale' && (
                <Chip 
                  label="Hot" 
                  size="small" 
                  color="error" 
                  sx={{ ml: 1 }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {user ? (
          <>
            <ListItem>
              <Typography variant="subtitle2" color="text.secondary" sx={{ pl: 2 }}>
                Account
              </Typography>
            </ListItem>
            {userMenuItems.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton 
                  component={item.action ? 'button' : Link} 
                  href={item.action ? undefined : item.path}
                  onClick={item.action}
                  selected={!item.action && pathname === item.path}
                >
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
            {user && user.isAdmin && (
              <>
                <ListItem>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ pl: 2, pt: 1 }}>
                    Admin
                  </Typography>
                </ListItem>
                {adminMenuItems.map((item) => (
                  <ListItem key={item.name} disablePadding>
                    <ListItemButton 
                      component={Link} 
                      href={item.path}
                      selected={pathname === item.path}
                    >
                      <ListItemText primary={item.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </>
            )}
          </>
        ) : (
          userMenuItems.map((item) => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton 
                component={Link} 
                href={item.path}
                selected={pathname === item.path}
              >
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );

  return (
    <>
      <HideOnScroll>
        <AppBar position="sticky">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              {/* Logo - Desktop */}
              <Typography
                variant="h6"
                noWrap
                component={Link}
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                SHOP
              </Typography>

              {/* Mobile menu button */}
              <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={toggleMobileDrawer(true)}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
              </Box>

              {/* Logo - Mobile */}
              <Typography
                variant="h5"
                noWrap
                component={Link}
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                SHOP
              </Typography>

              {/* Desktop Navigation */}
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                  <Button
                    key={page.name}
                    component={Link}
                    href={page.path}
                    onClick={handleCloseNavMenu}
                    sx={{
                      my: 2, 
                      color: 'white', 
                      display: 'flex',
                      alignItems: 'center',
                      ...(pathname === page.path && {
                        borderBottom: '2px solid white',
                      }),
                    }}
                  >
                    {page.name}
                    {page.name === 'Sale' && (
                      <Chip 
                        label="Hot" 
                        size="small" 
                        color="error" 
                        sx={{ ml: 1, height: 20 }}
                      />
                    )}
                  </Button>
                ))}
              </Box>

              {/* Theme Toggle */}
              <IconButton
                sx={{ ml: 1 }}
                onClick={toggleTheme}
                color="inherit"
                aria-label="toggle theme"
              >
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              {/* Search */}
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <form onSubmit={handleSearchSubmit}>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </Search>

              {/* Wishlist Icon */}
              <Box sx={{ display: 'flex' }}>
                <IconButton 
                  size="large" 
                  aria-label="show wishlist items" 
                  color="inherit"
                  component={Link}
                  href="/customer/wishlist"
                >
                  <Badge badgeContent={wishlistItemCount} color="error">
                    <Favorite />
                  </Badge>
                </IconButton>

                {/* Cart Icon */}
                <IconButton
                  size="large"
                  aria-label="show cart items"
                  color="inherit"
                  component={Link}
                  href="/cart"
                >
                  <Badge badgeContent={cartItemCount} color="error">
                    <ShoppingCart />
                  </Badge>
                </IconButton>

                {/* User Menu */}
                <Box sx={{ flexGrow: 0, ml: 0.5 }}>
                  <Tooltip title="Account settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      {user ? (
                        <Avatar alt="User" src="/images/avatar/1.jpg" />
                      ) : (
                        <AccountCircle fontSize="large" />
                      )}
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
                    {user ? [
                      <Box sx={{ px: 2, py: 1 }} key="user-info">
                        <Typography variant="subtitle1">{user.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>,
                      <Divider key="divider-1" />,
                      ...userMenuItems.map((item) => (
                        <MenuItem 
                          key={item.name} 
                          onClick={item.action || handleCloseUserMenu}
                          component={item.action ? undefined : Link}
                          href={item.action ? undefined : item.path}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {item.icon && <Box sx={{ mr: 1 }}>{item.icon}</Box>}
                            <Typography textAlign="center">{item.name}</Typography>
                          </Box>
                        </MenuItem>
                      )),
                      user && user.isAdmin && [
                        <Divider key="divider-2" />,
                        <Box sx={{ px: 2, py: 1 }} key="admin-label">
                          <Typography variant="subtitle2" color="text.secondary">
                            Admin
                          </Typography>
                        </Box>,
                        ...adminMenuItems.map((item) => (
                          <MenuItem 
                            key={item.name} 
                            onClick={handleCloseUserMenu}
                            component={Link}
                            href={item.path}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {item.icon && <Box sx={{ mr: 1 }}>{item.icon}</Box>}
                              <Typography textAlign="center">{item.name}</Typography>
                            </Box>
                          </MenuItem>
                        ))
                      ]
                    ].flat().filter(Boolean) :
                      userMenuItems.map((item) => (
                        <MenuItem 
                          key={item.name} 
                          onClick={handleCloseUserMenu}
                          component={Link}
                          href={item.path}
                        >
                          <Typography textAlign="center">{item.name}</Typography>
                        </MenuItem>
                      ))
                    }
                  </Menu>
                </Box>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={toggleMobileDrawer(false)}
      >
        {mobileDrawerContent}
      </Drawer>
    </>
  );
}