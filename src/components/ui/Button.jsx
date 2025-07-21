'use client';

import { Button as MuiButton, CircularProgress } from '@mui/material';
import Link from 'next/link';

export default function Button({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  href,
  loading = false,
  disabled = false,
  startIcon,
  endIcon,
  fullWidth = false,
  onClick,
  type = 'button',
  sx = {},
  ...props
}) {
  const buttonProps = {
    variant,
    color,
    size,
    disabled: disabled || loading,
    startIcon: loading ? null : startIcon,
    endIcon: loading ? null : endIcon,
    fullWidth,
    onClick,
    type,
    sx: {
      position: 'relative',
      ...sx,
    },
    ...props,
  };

  // If loading, add a circular progress indicator
  const loadingIndicator = loading && (
    <CircularProgress
      size={24}
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: '-12px',
        marginLeft: '-12px',
      }}
    />
  );

  // If href is provided, render as a Next.js Link
  if (href) {
    return (
      <MuiButton
        component={Link}
        href={href}
        {...buttonProps}
      >
        {loading ? <span style={{ visibility: 'hidden' }}>{children}</span> : children}
        {loadingIndicator}
      </MuiButton>
    );
  }

  // Otherwise, render as a regular button
  return (
    <MuiButton {...buttonProps}>
      {loading ? <span style={{ visibility: 'hidden' }}>{children}</span> : children}
      {loadingIndicator}
    </MuiButton>
  );
}