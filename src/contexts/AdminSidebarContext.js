'use client';

import { createContext, useContext, useState } from 'react';

const DRAWER_WIDTH = 280;
const COLLAPSED_DRAWER_WIDTH = 80;

const AdminSidebarContext = createContext({
  collapsed: false,
  toggleSidebar: () => {},
  drawerWidth: DRAWER_WIDTH,
  collapsedDrawerWidth: COLLAPSED_DRAWER_WIDTH,
});

export function AdminSidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <AdminSidebarContext.Provider value={{ 
      collapsed, 
      toggleSidebar,
      drawerWidth: DRAWER_WIDTH,
      collapsedDrawerWidth: COLLAPSED_DRAWER_WIDTH,
    }}>
      {children}
    </AdminSidebarContext.Provider>
  );
}

export const useAdminSidebar = () => useContext(AdminSidebarContext);