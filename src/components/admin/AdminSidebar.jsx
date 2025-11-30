"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
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
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  Category as CategoriesIcon,
  ShoppingCart as OrdersIcon,
  People as CustomersIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
  BarChart as AnalyticsIcon,
  Store as StoreIcon,
  LocalOffer as CouponsIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeContext } from "@/theme";
import { useAdminSidebar } from "@/contexts/AdminSidebarContext";

const drawerWidth = 280;
const collapsedDrawerWidth = 90;

export default function AdminSidebar() {
  const muiTheme = useTheme();
  const { theme } = useThemeContext();
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const [open, setOpen] = useState(!isMobile);
  const { collapsed, toggleSidebar } = useAdminSidebar();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Analytics", icon: <AnalyticsIcon />, path: "/admin/analytics" },
    { text: "Products", icon: <ProductsIcon />, path: "/admin/products" },
    { text: "Categories", icon: <CategoriesIcon />, path: "/admin/categories" },
    { text: "Coupons", icon: <CouponsIcon />, path: "/admin/coupons" },
    { text: "Orders", icon: <OrdersIcon />, path: "/admin/orders" },
    { text: "Customers", icon: <CustomersIcon />, path: "/admin/customers" },
    { text: "Settings", icon: <SettingsIcon />, path: "/admin/settings" },
  ];

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo and Brand */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          borderBottom:
            theme.palette.mode === "dark"
              ? "1px solid #333333"
              : "1px solid #e0e0e0",
          bgcolor: theme.palette.mode === "dark" ? "#111111" : "#f8f9fa",
        }}
      >
        {!collapsed && (
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}
          >
            <img
              src="/images/ll2.jpg"
              alt="Admin Logo"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#2c3e50",
                  fontSize: "1.1rem",
                  lineHeight: 1.2,
                }}
              >
                Admin Panel
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.mode === "dark" ? "#CCCCCC" : "#7f8c8d",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                }}
              >
                Management System
              </Typography>
            </Box>
          </Box>
        )}
        {collapsed && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <img
              src="/images/ll2.jpg"
              alt="Admin Logo"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          </Box>
        )}
        <IconButton onClick={toggleSidebar} sx={{ ml: "auto" }}>
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ ml: 1 }}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      {/* User Info */}
      {!collapsed && (
        <Box
          sx={{
            p: 2,
            borderBottom:
              theme.palette.mode === "dark"
                ? "1px solid #333333"
                : "1px solid #e0e0e0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "#8D6E63",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#2c3e50",
                  fontSize: "0.85rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.name || "Admin User"}
              </Typography>
              <Chip
                label="Administrator"
                size="small"
                sx={{
                  height: "18px",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  bgcolor:
                    theme.palette.mode === "dark" ? "#1a2e1a" : "#e8f5e8",
                  color: theme.palette.mode === "dark" ? "#66bb6a" : "#2e7d32",
                  "& .MuiChip-label": { px: 1 },
                }}
              />
            </Box>
          </Box>
        </Box>
      )}

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List sx={{ py: 1 }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ px: 1, mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  href={item.path}
                  selected={isActive}
                  sx={{
                    borderRadius: "8px",
                    mx: 1,
                    py: 1.5,
                    minHeight: 48,
                    justifyContent: collapsed ? "center" : "initial",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor:
                        theme.palette.mode === "dark" ? "#1a232d" : "#f0f7ff",
                      transform: "translateX(4px)",
                    },
                    "&.Mui-selected": {
                      bgcolor:
                        theme.palette.mode === "dark" ? "#1a232d" : "#e3f2fd",
                      borderLeft: "3px solid #2196f3",
                      "&:hover": {
                        bgcolor:
                          theme.palette.mode === "dark" ? "#1a232d" : "#e3f2fd",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive
                        ? "#2196f3"
                        : theme.palette.mode === "dark"
                        ? "#CCCCCC"
                        : "#6c757d",
                      minWidth: collapsed ? 0 : 40,
                      mr: collapsed ? 0 : 3,
                      justifyContent: "center",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.text}
                      sx={{
                        "& .MuiTypography-root": {
                          fontWeight: isActive ? 600 : 500,
                          color: isActive
                            ? "#2196f3"
                            : theme.palette.mode === "dark"
                            ? "#FFFFFF"
                            : "#2c3e50",
                          fontSize: "0.9rem",
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Bottom Actions */}
      <Box
        sx={{
          borderTop:
            theme.palette.mode === "dark"
              ? "1px solid #333333"
              : "1px solid #e0e0e0",
          p: 1,
        }}
      >
        <List>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              href="/"
              sx={{
                borderRadius: "8px",
                mx: 1,
                py: 1.5,
                minHeight: 48,
                justifyContent: collapsed ? "center" : "initial",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark" ? "#1a1a1a" : "#f8f9fa",
                  transform: "translateX(4px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: theme.palette.mode === "dark" ? "#CCCCCC" : "#6c757d",
                  minWidth: collapsed ? 0 : 40,
                  mr: collapsed ? 0 : 3,
                  justifyContent: "center",
                }}
              >
                <StoreIcon />
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary="Back to Store"
                  sx={{
                    "& .MuiTypography-root": {
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      color:
                        theme.palette.mode === "dark" ? "#FFFFFF" : "#2c3e50",
                    },
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: "8px",
                mx: 1,
                py: 1.5,
                minHeight: 48,
                justifyContent: collapsed ? "center" : "initial",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark" ? "#332a1a" : "#ffeaa7",
                  transform: "translateX(4px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#f39c12",
                  minWidth: collapsed ? 0 : 40,
                  mr: collapsed ? 0 : 3,
                  justifyContent: "center",
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary="Logout"
                  sx={{
                    "& .MuiTypography-root": {
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      color:
                        theme.palette.mode === "dark" ? "#f39c12" : "#f39c12",
                    },
                  }}
                />
              )}
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
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1300,
            bgcolor: theme.palette.mode === "dark" ? "#111111" : "white",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 2px 8px rgba(0,0,0,0.3)"
                : "0 2px 8px rgba(0,0,0,0.15)",
            "&:hover": {
              bgcolor: theme.palette.mode === "dark" ? "#1a1a1a" : "#f5f5f5",
            },
          }}
        >
          <MenuIcon
            sx={{
              color: theme.palette.mode === "dark" ? "#FFFFFF" : "#2c3e50",
            }}
          />
        </IconButton>
      )}
      <Box
        component="nav"
        sx={{
          width: { md: collapsed ? collapsedDrawerWidth : drawerWidth },
          flexShrink: { md: 0 },
          zIndex: 1200,
        }}
        aria-label="admin navigation"
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
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                border: "none",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "2px 0 10px rgba(0,0,0,0.3)"
                    : "2px 0 10px rgba(0,0,0,0.1)",
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: collapsed ? collapsedDrawerWidth : drawerWidth,
                border: "none",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "2px 0 10px rgba(0,0,0,0.3)"
                    : "2px 0 10px rgba(0,0,0,0.05)",
                bgcolor: theme.palette.mode === "dark" ? "#111111" : "#ffffff",
                transition: "width 0.3s ease",
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
