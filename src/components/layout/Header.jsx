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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import { keyframes } from '@mui/material/styles';
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

// 4th Dimensional Header Animations
const dimensionalFloat = keyframes`
  0%, 100% { 
    transform: perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px);
    filter: brightness(1) saturate(1);
  }
  25% { 
    transform: perspective(1000px) rotateX(2deg) rotateY(1deg) translateZ(10px);
    filter: brightness(1.05) saturate(1.1);
  }
  50% { 
    transform: perspective(1000px) rotateX(0deg) rotateY(2deg) translateZ(15px);
    filter: brightness(1.08) saturate(1.15);
  }
  75% { 
    transform: perspective(1000px) rotateX(-1deg) rotateY(1deg) translateZ(8px);
    filter: brightness(1.03) saturate(1.05);
  }
`;

const logoGlow = keyframes`
  0%, 100% { 
    filter: drop-shadow(0 0 10px rgba(162, 146, 120, 0.3));
    transform: scale(1);
  }
  50% { 
    filter: drop-shadow(0 0 20px rgba(212, 192, 158, 0.5));
    transform: scale(1.02);
  }
`;

const navItemHover = keyframes`
  0% { 
    transform: translateY(0px);
    text-shadow: none;
  }
  100% { 
    transform: translateY(-2px);
    text-shadow: 0 4px 8px rgba(162, 146, 120, 0.3);
  }
`;

const iconPulse = keyframes`
  0%, 100% { 
    transform: scale(1);
    filter: brightness(1);
  }
  50% { 
    transform: scale(1.1);
    filter: brightness(1.2);
  }
`;

const headerGradient = keyframes`
  0% { 
    background-position: 0% 50%;
  }
  50% { 
    background-position: 100% 50%;
  }
  100% { 
    background-position: 0% 50%;
  }
`;

const darkModeIconBlink = keyframes`
  0%, 50% { 
    opacity: 1;
    transform: scale(1);
    filter: brightness(1);
  }
  25% { 
    opacity: 0.7;
    transform: scale(1.1);
    filter: brightness(1.3);
  }
  75% { 
    opacity: 0.8;
    transform: scale(0.95);
    filter: brightness(1.1);
  }
`;

// Styled Components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? `linear-gradient(135deg, 
        rgba(18, 18, 18, 0.98) 0%, 
        rgba(24, 24, 24, 0.95) 25%,
        rgba(30, 30, 30, 0.92) 50%,
        rgba(24, 24, 24, 0.95) 75%,
        rgba(18, 18, 18, 0.98) 100%
      )`
    : `linear-gradient(135deg, 
        rgba(255, 255, 255, 0.98) 0%, 
        rgba(250, 250, 250, 0.95) 25%,
        rgba(245, 245, 245, 0.92) 50%,
        rgba(250, 250, 250, 0.95) 75%,
        rgba(255, 255, 255, 0.98) 100%
      )`,
  backgroundSize: '200% 200%',
  animation: `${headerGradient} 8s ease infinite`,
  backdropFilter: 'blur(20px)',
  borderBottom: theme.palette.mode === 'dark' 
    ? '1px solid rgba(162, 146, 120, 0.2)'
    : '1px solid rgba(162, 146, 120, 0.1)',
  boxShadow: theme.palette.mode === 'dark'
    ? `
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(162, 146, 120, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.05)
      `
    : `
        0 8px 32px rgba(0, 0, 0, 0.1),
        0 0 0 1px rgba(162, 146, 120, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `,
  position: 'sticky',
  top: 0,
  zIndex: 1100,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark'
      ? `
          radial-gradient(circle at 20% 50%, rgba(162, 146, 120, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 50%, rgba(212, 192, 158, 0.06) 0%, transparent 50%)
        `
      : `
          radial-gradient(circle at 20% 50%, rgba(162, 146, 120, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 50%, rgba(212, 192, 158, 0.03) 0%, transparent 50%)
        `,
    zIndex: -1,
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  transformStyle: 'preserve-3d',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  '&:hover': {
    animation: `${dimensionalFloat} 2s ease-in-out infinite`,
    '& img': {
      animation: `${logoGlow} 2s ease-in-out infinite`,
    },
  },
  '& img': {
    borderRadius: '20px',
    transition: 'all 0.4s ease',
    filter: 'drop-shadow(0 4px 12px rgba(162, 146, 120, 0.2))',
  },
}));

const StyledNavButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  fontWeight: 600,
  fontSize: '0.95rem',
  letterSpacing: '0.5px',
  textTransform: 'capitalize',
  padding: theme.spacing(1.5, 2.5),
  borderRadius: '12px',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  transformStyle: 'preserve-3d',
  overflow: 'hidden',
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#2c2c2c',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(90deg, transparent, rgba(162, 146, 120, 0.2), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(162, 146, 120, 0.1), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover': {
    transform: 'perspective(500px) translateY(-3px) rotateX(5deg)',
    background: theme.palette.mode === 'dark'
      ? `linear-gradient(135deg, 
          rgba(162, 146, 120, 0.15) 0%, 
          rgba(212, 192, 158, 0.2) 50%,
          rgba(255, 215, 0, 0.1) 100%
        )`
      : `linear-gradient(135deg, 
          rgba(162, 146, 120, 0.08) 0%, 
          rgba(212, 192, 158, 0.12) 50%,
          rgba(255, 215, 0, 0.06) 100%
        )`,
    boxShadow: theme.palette.mode === 'dark'
      ? `
          0 8px 25px rgba(0, 0, 0, 0.3),
          0 0 20px rgba(162, 146, 120, 0.2)
        `
      : `
          0 8px 25px rgba(162, 146, 120, 0.2),
          0 0 20px rgba(212, 192, 158, 0.15)
        `,
    color: '#c4a876',
    animation: `${navItemHover} 0.3s ease forwards`,
    '&::before': {
      left: '100%',
    },
  },
  '&.active': {
    background: theme.palette.mode === 'dark'
      ? `linear-gradient(135deg, 
          rgba(162, 146, 120, 0.25) 0%, 
          rgba(212, 192, 158, 0.3) 50%,
          rgba(255, 215, 0, 0.15) 100%
        )`
      : `linear-gradient(135deg, 
          rgba(162, 146, 120, 0.15) 0%, 
          rgba(212, 192, 158, 0.2) 50%,
          rgba(255, 215, 0, 0.1) 100%
        )`,
    color: '#c4a876',
    fontWeight: 700,
    boxShadow: theme.palette.mode === 'dark'
      ? `
          0 4px 15px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `
      : `
          0 4px 15px rgba(162, 146, 120, 0.25),
          inset 0 1px 0 rgba(255, 255, 255, 0.2)
        `,
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  transformStyle: 'preserve-3d',
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#2c2c2c',
  '&:hover': {
    transform: 'perspective(500px) translateY(-2px) rotateX(3deg) scale(1.05)',
    background: theme.palette.mode === 'dark'
      ? `linear-gradient(135deg, 
          rgba(162, 146, 120, 0.2) 0%, 
          rgba(212, 192, 158, 0.25) 50%,
          rgba(255, 215, 0, 0.12) 100%
        )`
      : `linear-gradient(135deg, 
          rgba(162, 146, 120, 0.1) 0%, 
          rgba(212, 192, 158, 0.15) 50%,
          rgba(255, 215, 0, 0.08) 100%
        )`,
    boxShadow: theme.palette.mode === 'dark'
      ? `
          0 6px 20px rgba(0, 0, 0, 0.3),
          0 0 15px rgba(162, 146, 120, 0.2)
        `
      : `
          0 6px 20px rgba(162, 146, 120, 0.2),
          0 0 15px rgba(212, 192, 158, 0.15)
        `,
    '& svg': {
      animation: `${iconPulse} 0.6s ease infinite`,
      color: '#c4a876',
    },
  },
  '&.dark-mode-toggle': {
    animation: `${darkModeIconBlink} 2s ease-in-out infinite`,
    '& svg': {
      filter: 'drop-shadow(0 0 8px rgba(162, 146, 120, 0.5))',
    },
  },
}));

const SearchDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '20px',
    background: `linear-gradient(135deg, 
      rgba(255, 255, 255, 0.95) 0%, 
      rgba(250, 250, 250, 0.9) 100%
    )`,
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(162, 146, 120, 0.1)',
    boxShadow: `
      0 20px 60px rgba(0, 0, 0, 0.15),
      0 0 40px rgba(162, 146, 120, 0.1)
    `,
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    background: `linear-gradient(135deg, 
      #ff4444 0%, 
      #ff6666 50%,
      #ff4444 100%
    )`,
    color: 'white',
    fontWeight: 700,
    fontSize: '0.7rem',
    minWidth: '20px',
    height: '20px',
    borderRadius: '10px',
    border: `2px solid ${theme.palette.mode === 'dark' ? '#1a1a1a' : 'white'}`,
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 2px 8px rgba(255, 68, 68, 0.4), 0 0 12px rgba(255, 68, 68, 0.2)'
      : '0 2px 8px rgba(255, 68, 68, 0.3)',
    animation: `${iconPulse} 2s ease-in-out infinite`,
    transform: 'scale(1) translate(50%, -50%)',
    transformOrigin: '100% 0%',
    top: '8px',
    right: '8px',
    zIndex: 10,
  },
  '& .MuiSvgIcon-root': {
    zIndex: 1,
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
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const { user } = useAuth();
  const { cartItems } = useCart();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
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
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
      setSearchDialogOpen(false);
    }
  };

  const handleSearchIconClick = () => {
    setSearchDialogOpen(true);
  };

  const { logout } = useAuth();
  
  const handleLogout = async () => {
    // Handle logout logic here
    await logout();
    handleCloseUserMenu();
  };

  // Navigation items (removed New Arrivals as requested)
  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'Categories', path: '/categories' },
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
        <StyledAppBar>
          <Container maxWidth="xl">
            <Toolbar 
              disableGutters 
              sx={{ 
                minHeight: '80px !important',
                py: 1.5,
                position: 'relative',
                zIndex: 2,
              }}
            >
              {/* Logo - Desktop */}
              <LogoContainer
                component={Link}
                href="/"
                sx={{
                  mr: 4,
                  display: { xs: 'none', md: 'flex' },
                  textDecoration: 'none',
                }}
              >
                <img 
                  src="/images/lp3.png" 
                  alt="Punjabi Attire Logo" 
                  style={{
                    width: '65px',
                    height: '65px',
                    objectFit: 'cover',
                  }}
                />
                <Box sx={{ ml: 2 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      fontSize: '1.4rem',
                      letterSpacing: '1px',
                      background: 'linear-gradient(135deg, #8b7355, #c4a876, #d4c09e)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.2,
                    }}
                  >
                    INDIA
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      letterSpacing: '2px',
                      color: '#8b7355',
                      opacity: 0.8,
                      textTransform: 'uppercase',
                    }}
                  >
                    INSPIRED
                  </Typography>
                </Box>
              </LogoContainer>

              {/* Mobile menu button */}
              <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
                <StyledIconButton
                  size="large"
                  aria-label="menu"
                  onClick={toggleMobileDrawer(true)}
                >
                  <MenuIcon />
                </StyledIconButton>
              </Box>

              {/* Logo - Mobile */}
              <LogoContainer
                component={Link}
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  textDecoration: 'none',
                }}
              >
                <img 
                  src="/images/l2.png" 
                  alt="Punjabi Attire Logo" 
                  style={{
                    width: '45px',
                    height: '45px',
                    objectFit: 'cover',
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    ml: 1.5,
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    letterSpacing: '0.5px',
                    background: 'linear-gradient(135deg, #8b7355, #c4a876)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  PUNJABI ATTIRE
                </Typography>
              </LogoContainer>

              {/* Desktop Navigation */}
              <Box sx={{ 
                flexGrow: 1, 
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
                gap: 1,
              }}>
                {pages.map((page) => (
                  <StyledNavButton
                    key={page.name}
                    component={Link}
                    href={page.path}
                    className={pathname === page.path ? 'active' : ''}
                    sx={{ position: 'relative' }}
                  >
                    {page.name}
                    {page.name === 'Sale' && (
                      <Chip 
                        label="Hot" 
                        size="small" 
                        sx={{ 
                          ml: 1, 
                          height: 18,
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #ff4444, #ff6666)',
                          color: 'white',
                          border: 'none',
                          animation: `${iconPulse} 2s ease-in-out infinite`,
                        }}
                      />
                    )}
                  </StyledNavButton>
                ))}
              </Box>

              {/* Right Side Actions */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Theme Toggle */}
                <StyledIconButton
                  onClick={toggleTheme}
                  aria-label="toggle theme"
                  size="medium"
                  className="dark-mode-toggle"
                >
                  {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </StyledIconButton>

                {/* Search Icon Only */}
                <StyledIconButton
                  onClick={handleSearchIconClick}
                  aria-label="search"
                  size="medium"
                >
                  <SearchIcon />
                </StyledIconButton>

                {/* Wishlist Icon */}
                <StyledIconButton 
                  component={Link}
                  href="/customer/wishlist"
                  aria-label="wishlist"
                  size="medium"
                >
                  <StyledBadge badgeContent={wishlistItemCount} color="error">
                    <Favorite />
                  </StyledBadge>
                </StyledIconButton>

                {/* Cart Icon */}
                <StyledIconButton
                  component={Link}
                  href="/cart"
                  aria-label="shopping cart"
                  size="medium"
                >
                  <StyledBadge badgeContent={cartItemCount} color="error">
                    <ShoppingCart />
                  </StyledBadge>
                </StyledIconButton>

                {/* User Menu */}
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Account settings">
                    <StyledIconButton onClick={handleOpenUserMenu} sx={{ p: 0.5 }}>
                      {user ? (
                        <Avatar 
                          alt="User" 
                          src="/images/avatar/1.jpg" 
                          sx={{ 
                            width: 36, 
                            height: 36,
                            border: '2px solid rgba(162, 146, 120, 0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              border: '2px solid rgba(162, 146, 120, 0.5)',
                              transform: 'scale(1.05)',
                            },
                          }}
                        />
                      ) : (
                        <AccountCircle sx={{ fontSize: 32 }} />
                      )}
                    </StyledIconButton>
                  </Tooltip>
                  <Menu
                    sx={{ 
                      mt: '45px',
                      '& .MuiPaper-root': {
                        borderRadius: '16px',
                        background: `linear-gradient(135deg, 
                          rgba(255, 255, 255, 0.95) 0%, 
                          rgba(250, 250, 250, 0.9) 100%
                        )`,
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(162, 146, 120, 0.1)',
                        boxShadow: `
                          0 20px 60px rgba(0, 0, 0, 0.15),
                          0 0 40px rgba(162, 146, 120, 0.1)
                        `,
                      },
                    }}
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
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {user.name}
                        </Typography>
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
                          sx={{
                            borderRadius: '8px',
                            mx: 1,
                            my: 0.5,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              background: `linear-gradient(135deg, 
                                rgba(162, 146, 120, 0.08) 0%, 
                                rgba(212, 192, 158, 0.12) 100%
                              )`,
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {item.icon && <Box sx={{ mr: 1.5, color: '#8b7355' }}>{item.icon}</Box>}
                            <Typography>{item.name}</Typography>
                          </Box>
                        </MenuItem>
                      )),
                      user && user.isAdmin && [
                        <Divider key="divider-2" />,
                        <Box sx={{ px: 2, py: 1 }} key="admin-label">
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Admin
                          </Typography>
                        </Box>,
                        ...adminMenuItems.map((item) => (
                          <MenuItem 
                            key={item.name} 
                            onClick={handleCloseUserMenu}
                            component={Link}
                            href={item.path}
                            sx={{
                              borderRadius: '8px',
                              mx: 1,
                              my: 0.5,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                background: `linear-gradient(135deg, 
                                  rgba(162, 146, 120, 0.08) 0%, 
                                  rgba(212, 192, 158, 0.12) 100%
                                )`,
                                transform: 'translateX(4px)',
                              },
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {item.icon && <Box sx={{ mr: 1.5, color: '#8b7355' }}>{item.icon}</Box>}
                              <Typography>{item.name}</Typography>
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
                          sx={{
                            borderRadius: '8px',
                            mx: 1,
                            my: 0.5,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              background: `linear-gradient(135deg, 
                                rgba(162, 146, 120, 0.08) 0%, 
                                rgba(212, 192, 158, 0.12) 100%
                              )`,
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          <Typography>{item.name}</Typography>
                        </MenuItem>
                      ))
                    }
                  </Menu>
                </Box>
              </Box>
            </Toolbar>
          </Container>
        </StyledAppBar>
      </HideOnScroll>

      {/* Search Dialog */}
      <SearchDialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '1.5rem',
          background: 'linear-gradient(135deg, #8b7355, #c4a876)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Search Products
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <form onSubmit={handleSearchSubmit}>
            <TextField
              autoFocus
              fullWidth
              variant="outlined"
              placeholder="Search for products, categories, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.8) 0%, 
                    rgba(250, 250, 250, 0.6) 100%
                  )`,
                  backdropFilter: 'blur(10px)',
                  '&:hover fieldset': {
                    borderColor: '#c4a876',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8b7355',
                    borderWidth: '2px',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: '#8b7355', mr: 1 }} />
                ),
              }}
            />
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setSearchDialogOpen(false)}
            sx={{ 
              borderRadius: '8px',
              color: '#8b7355',
              '&:hover': {
                background: 'rgba(162, 146, 120, 0.08)',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSearchSubmit}
            variant="contained"
            sx={{
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #8b7355, #c4a876)',
              '&:hover': {
                background: 'linear-gradient(135deg, #7a6449, #b39968)',
              },
            }}
          >
            Search
          </Button>
        </DialogActions>
      </SearchDialog>

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