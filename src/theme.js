'use client';

import { createTheme } from '@mui/material/styles';
import { createContext, useContext, useMemo, useState, useEffect } from 'react';

// Luxury color palette
const themeColors = {
  light: {
    primary: {
      main: '#a29278', // Gold
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#000000', // Black
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF', // Clean white
      paper: '#FAFAFA',   // Light gray for cards
      accent: '#F8F8F8',  // Subtle contrast
    },
    text: {
      primary: '#111111', // Near black for readability
      secondary: '#444444', // Softer dark gray
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  dark: {
    primary: {
      main: '#a29278', // Gold
      contrastText: '#000000',
    },
    secondary: {
      main: '#FFFFFF', // White accents
      contrastText: '#000000',
    },
    background: {
      default: '#000000', // Deep black
      paper: '#111111',   // Slightly lighter black
      accent: '#1A1A1A',  // Subtle gray-black
    },
    text: {
      primary: '#FFFFFF', // Clean white
      secondary: '#CCCCCC', // Softer gray
    },
    divider: 'rgba(255, 255, 255, 0.12)',
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
  const [mode, setMode] = useState('light');
  const [customColors, setCustomColors] = useState(themeColors);

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

  const changeThemeColors = (newColors) => {
    setCustomColors((prevColors) => ({
      ...prevColors,
      [mode]: {
        ...prevColors[mode],
        ...newColors,
      },
    }));
  };

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
            fontWeight: 600,
            textTransform: 'none',
            letterSpacing: '0.5px',
          },
        },
        shape: {
          borderRadius: 10,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                boxShadow: 'none',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: mode === 'light'
                    ? '0px 2px 6px rgba(0,0,0,0.15)'
                    : '0px 2px 8px rgba(255,255,255,0.15)',
                },
              },
              containedPrimary: {
                backgroundColor: customColors[mode].primary.main,
                color: customColors[mode].primary.contrastText,
                '&:hover': {
                  backgroundColor: '#8b7d65', // darker gold hover
                },
              },
              containedSecondary: {
                backgroundColor: customColors[mode].secondary.main,
                color: customColors[mode].secondary.contrastText,
                '&:hover': {
                  backgroundColor: mode === 'light' ? '#222222' : '#e6e6e6',
                },
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor:
                  mode === 'dark'
                    ? '#000000' // Black header in dark mode
                    : '#FFFFFF', // White header in light mode
                color: mode === 'dark' ? '#FFFFFF' : '#000000',
                boxShadow: 'none',
                borderBottom: mode === 'light'
                  ? '1px solid rgba(0,0,0,0.08)'
                  : '1px solid rgba(255,255,255,0.12)',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow:
                  mode === 'light'
                    ? '0px 2px 10px rgba(0, 0, 0, 0.08)'
                    : '0px 2px 12px rgba(0, 0, 0, 0.35)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow:
                    mode === 'light'
                      ? '0px 6px 20px rgba(0, 0, 0, 0.12)'
                      : '0px 6px 24px rgba(0, 0, 0, 0.5)',
                },
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
  return context.theme || createTheme({ palette: { ...themeColors.light } });
}
