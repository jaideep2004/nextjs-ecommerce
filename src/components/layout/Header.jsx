'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useThemeContext } from '@/theme';
import CategoriesDropdown from './CategoriesDropdown';
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
  CircularProgress,
  useTheme,
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

// Helper function to get user avatar background color
const getUserAvatarColor = (user) => {
  if (!user) return '#2196f3';
  
  if (user.isAdmin) {
    return '#8D6E63'; // Brown for admin
  }
  
  // Different colors for regular users based on first letter
  const firstLetter = user.name ? user.name.charAt(0).toLowerCase() : 'u';
  const colors = {
    'a': '#f44336', 'b': '#e91e63', 'c': '#9c27b0', 'd': '#673ab7',
    'e': '#3f51b5', 'f': '#2196f3', 'g': '#03a9f4', 'h': '#00bcd4',
    'i': '#009688', 'j': '#4caf50', 'k': '#8bc34a', 'l': '#cddc39',
    'm': '#ffeb3b', 'n': '#ffc107', 'o': '#ff9800', 'p': '#ff5722',
    'q': '#795548', 'r': '#607d8b', 's': '#e91e63', 't': '#9c27b0',
    'u': '#3f51b5', 'v': '#2196f3', 'w': '#009688', 'x': '#4caf50',
    'y': '#ff9800', 'z': '#f44336'
  };
  
  return colors[firstLetter] || '#2196f3';
};

// Helper function to get user initials
const getUserInitials = (user) => {
  if (!user || !user.name) return 'U';
  
  const names = user.name.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const adminAvatarPulse = keyframes`
  0%, 100% { 
    box-shadow: 0 2px 8px rgba(141, 110, 99, 0.3);
  }
  50% { 
    box-shadow: 0 4px 16px rgba(141, 110, 99, 0.5), 0 0 20px rgba(141, 110, 99, 0.3);
  }
`;

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



// Always show header (sticky)
function HideOnScrollUp(props) {
  const { children } = props;

  return (
    <>{children}</>
  );
}

export default function Header() {
  const theme = useTheme();
  const pathname = usePathname();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { cartItems } = useCart();
  const cartItemCount = useMemo(() => cartItems?.length || 0, [cartItems]);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const { mode, toggleTheme } = useThemeContext();

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

  // Navigation items (Categories now handled by dropdown)
  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'Categories', isDropdown: true },
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
        {pages.map((page) => {
          if (page.isDropdown && page.name === 'Categories') {
            return (
              <ListItem key={page.name} disablePadding>
                <ListItemButton 
                  component={Link} 
                  href="/products"
                  selected={pathname.startsWith('/products') && pathname.includes('category')}
                >
                  <ListItemText primary={page.name} />
                </ListItemButton>
              </ListItem>
            );
          }
          
          return (
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
          );
        })}
      </List>
      <Divider />
      <List>
        {/* Mobile-only actions */}
        <ListItem>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', py: 1 }}>
            <StyledIconButton
              onClick={toggleTheme}
              aria-label="toggle theme"
              size="medium"
              className="dark-mode-toggle"
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </StyledIconButton>
            <StyledIconButton
              onClick={() => {
                setMobileDrawerOpen(false);
                handleSearchIconClick();
              }}
              aria-label="search"
              size="medium"
            >
              <SearchIcon />
            </StyledIconButton>
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
          </Box>
        </ListItem>
        <Divider />
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
      <HideOnScrollUp>
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
                  src={mode === 'dark' ? "/images/indidark.png" : "/images/ll2.jpg"} 
                  alt="Punjabi Attire Logo" 
                  style={{
                    width: '65px',
                    height: '65px',
                    objectFit: 'cover',
                    borderRadius: '0px !important',
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
                  justifyContent: 'center',
                }}
              >
                <img 
                  src={mode === 'dark' ? "/images/indidark.png" : "/images/ll2.jpg"} 
                  alt="Punjabi Attire Logo" 
                  style={{
                    width: '50px',
                    height: '50px',
                    objectFit: 'cover',
                    borderRadius: '0px !important',
                  }}
                />
                <Box sx={{ ml: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      letterSpacing: '0.5px',
                      background: 'linear-gradient(135deg, #8b7355, #c4a876)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.1,
                    }}
                  >
                    INDIA
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.65rem',
                      letterSpacing: '1px',
                      color: '#8b7355',
                      opacity: 0.8,
                      textTransform: 'uppercase',
                      lineHeight: 1,
                    }}
                  >
                    INSPIRED
                  </Typography>
                </Box>
              </LogoContainer>

              {/* Desktop Navigation */}
              <Box sx={{ 
                flexGrow: 1, 
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
                gap: 1,
              }}>
                {pages.map((page) => {
                  if (page.isDropdown && page.name === 'Categories') {
                    return (
                      <CategoriesDropdown
                        key={page.name}
                        trigger={
                          <StyledNavButton
                            className={pathname.startsWith('/products') && pathname.includes('category') ? 'active' : ''}
                            sx={{ position: 'relative' }}
                          >
                            {page.name}
                          </StyledNavButton>
                        }
                      />
                    );
                  }
                  
                  return (
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
                  );
                })}
              </Box>

              {/* Right Side Actions */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 0.5, sm: 1 },
                flexShrink: 0,
              }}>
                {/* Theme Toggle */}
                <StyledIconButton
                  onClick={toggleTheme}
                  aria-label="toggle theme"
                  size="medium"
                  className="dark-mode-toggle"
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </StyledIconButton>

                {/* Search Icon Only */}
                <StyledIconButton
                  onClick={handleSearchIconClick}
                  aria-label="search"
                  size="medium"
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  <SearchIcon />
                </StyledIconButton>

                {/* Wishlist Icon */}
                <StyledIconButton 
                  component={Link}
                  href="/customer/wishlist"
                  aria-label="wishlist"
                  size="medium"
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
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
                    <StyledIconButton 
                      onClick={handleOpenUserMenu} 
                      sx={{ 
                        p: { xs: 0.25, sm: 0.5 },
                        '& .MuiAvatar-root': {
                          width: { xs: 32, sm: 36 },
                          height: { xs: 32, sm: 36 },
                        }
                      }}
                    >
                      {authLoading ? (
                        <Avatar 
                          sx={{ 
                            width: { xs: 32, sm: 36 }, 
                            height: { xs: 32, sm: 36 },
                            bgcolor: '#e0e0e0',
                            color: '#9e9e9e',
                          }}
                        >
                          <CircularProgress size={16} sx={{ color: '#9e9e9e' }} />
                        </Avatar>
                      ) : user ? (
                        <Avatar 
                          alt={user.name || 'User'}
                          sx={{ 
                            width: { xs: 32, sm: 36 }, 
                            height: { xs: 32, sm: 36 },
                            border: `2px solid ${user.isAdmin ? 'rgba(141, 110, 99, 0.3)' : 'rgba(33, 150, 243, 0.3)'}`,
                            transition: 'all 0.3s ease',
                            bgcolor: getUserAvatarColor(user),
                            color: 'white',
                            fontWeight: 700,
                            fontSize: { xs: '0.85rem', sm: '0.95rem' },
                            boxShadow: user.isAdmin 
                              ? '0 2px 8px rgba(141, 110, 99, 0.3)' 
                              : '0 2px 8px rgba(33, 150, 243, 0.3)',
                            '&:hover': {
                              border: `2px solid ${user.isAdmin ? 'rgba(141, 110, 99, 0.6)' : 'rgba(33, 150, 243, 0.6)'}`,
                              transform: 'scale(1.08)',
                              boxShadow: user.isAdmin 
                                ? '0 4px 16px rgba(141, 110, 99, 0.4)' 
                                : '0 4px 16px rgba(33, 150, 243, 0.4)',
                            },
                          }}
                        >
                          {getUserInitials(user)}
                        </Avatar>
                      ) : (
                        <AccountCircle sx={{ fontSize: { xs: 28, sm: 32 } }} />
                      )}
                    </StyledIconButton>
                  </Tooltip>
                  <Menu
                    sx={{ 
                      mt: '45px',
                      '& .MuiPaper-root': {
                        borderRadius: '16px',
                        background: theme.palette.mode === 'dark' 
                          ? `linear-gradient(135deg, 
                              rgba(17, 17, 17, 0.95) 0%, 
                              rgba(26, 26, 26, 0.9) 100%
                            )`
                          : `linear-gradient(135deg, 
                              rgba(255, 255, 255, 0.95) 0%, 
                              rgba(250, 250, 250, 0.9) 100%
                            )`,
                        backdropFilter: 'blur(20px)',
                        border: theme.palette.mode === 'dark' 
                          ? '1px solid rgba(162, 146, 120, 0.3)'
                          : '1px solid rgba(162, 146, 120, 0.1)',
                        boxShadow: theme.palette.mode === 'dark'
                          ? `0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(162, 146, 120, 0.2)`
                          : `0 20px 60px rgba(0, 0, 0, 0.15), 0 0 40px rgba(162, 146, 120, 0.1)`,
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
                        {user.isAdmin && (
                          <Box sx={{ mt: 0.5 }}>
                            <Chip 
                              label="Administrator" 
                              size="small" 
                              sx={{ 
                                bgcolor: 'linear-gradient(135deg, #8D6E63, #A1887F)',
                                background: 'linear-gradient(135deg, #8D6E63 0%, #A1887F 100%)',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '0.65rem',
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                                border: '1px solid rgba(141, 110, 99, 0.3)',
                                boxShadow: '0 2px 4px rgba(141, 110, 99, 0.3)',
                                '& .MuiChip-label': {
                                  px: 1.5
                                }
                              }} 
                            />
                          </Box>
                        )}
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
      </HideOnScrollUp>

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