'use client';

import { createTheme } from '@mui/material/styles';
import { createContext, useContext, useMemo, useState, useEffect } from 'react';

// Color palette - Soft and modern color scheme
const themeColors = {
  light: {
    primary: {
      main: '#6366F1', // Soft indigo
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#EC4899', // Soft pink
      light: '#F472B6',
      dark: '#DB2777',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FAFAFA', // Very light gray
      paper: '#FFFFFF',
      accent: '#F8FAFC', // Subtle blue-gray tint
    },
    text: {
      primary: '#1F2937', // Dark gray
      secondary: '#6B7280', // Medium gray
    },
    divider: 'rgba(0, 0, 0, 0.08)',
    success: { main: '#10B981' }, // Soft green
    error: { main: '#EF4444' }, // Soft red
    warning: { main: '#F59E0B' }, // Soft amber
    info: { main: '#3B82F6' }, // Soft blue
  },
  dark: {
    primary: {
      main: '#818CF8', // Lighter indigo for dark mode
      light: '#A5B4FC',
      dark: '#6366F1',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F472B6', // Lighter pink for dark mode
      light: '#F9A8D4',
      dark: '#EC4899',
      contrastText: '#000000',
    },
    background: {
      default: '#0F172A', // Dark slate
      paper: '#1E293B', // Lighter slate
      accent: '#334155', // Medium slate
    },
    text: {
      primary: '#F1F5F9', // Light gray
      secondary: '#94A3B8', // Medium gray
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    success: { main: '#34D399' }, // Bright green
    error: { main: '#F87171' }, // Bright red
    warning: { main: '#FBBF24' }, // Bright amber
    info: { main: '#60A5FA' }, // Bright blue
  },
};

// Theme Context
export const ThemeContext = createContext({
  mode: 'light',
  toggleTheme: () => {},
  changeThemeColors: () => {},
  theme: null,
});

export const useThemeContext = () => useContext(ThemeContext);

export function ThemeContextProvider({ children }) {
  // Check if we're in the browser and if there's a stored preference
  const [mode, setMode] = useState('light');
  const [customColors, setCustomColors] = useState(themeColors);

  // Load saved theme preference
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  // Function to change theme colors
  const changeThemeColors = (newColors) => {
    setCustomColors(prevColors => ({
      ...prevColors,
      [mode]: {
        ...prevColors[mode],
        ...newColors,
      }
    }));
  };

  // Create the theme
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...customColors[mode],
        },
        typography: {
          fontFamily: '"Geist", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontWeight: 700 },
          h2: { fontWeight: 700 },
          h3: { fontWeight: 600 },
          h4: { fontWeight: 600 },
          h5: { fontWeight: 500 },
          h6: { fontWeight: 500 },
          button: {
            fontWeight: 500,
            textTransform: 'none',
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                },
              },
              contained: {
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s ease-in-out',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'light' 
                  ? '0px 2px 8px rgba(0, 0, 0, 0.08)'
                  : '0px 2px 8px rgba(0, 0, 0, 0.25)',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: mode === 'light'
                    ? '0px 4px 12px rgba(0, 0, 0, 0.12)'
                    : '0px 4px 12px rgba(0, 0, 0, 0.35)',
                },
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'light'
                  ? '0px 1px 4px rgba(0, 0, 0, 0.1)'
                  : '0px 1px 4px rgba(0, 0, 0, 0.3)',
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 500,
              },
            },
          },
        },
      }),
    [mode, customColors]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, changeThemeColors, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default function useTheme() {
  const context = useContext(ThemeContext);
  return context.theme || createTheme({
    palette: {
      ...themeColors.light,
    },
    typography: {
      fontFamily: '"Geist", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 500 },
      h6: { fontWeight: 500 },
      button: {
        fontWeight: 500,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  });
}