'use client';

import { Box, Typography, Breadcrumbs, Link as MuiLink, Divider, Button } from '@mui/material';
import Link from 'next/link';

export default function PageHeader({
  title,
  description,
  breadcrumbs = [],
  action,
  actionText,
  actionIcon,
  actionProps = {},
  divider = true,
  sx = {},
}) {
  return (
    <Box sx={{ mb: 4, ...sx }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            if (isLast || !crumb.href) {
              return (
                <Typography color="text.primary" key={index}>
                  {crumb.label}
                </Typography>
              );
            }
            
            return (
              <MuiLink 
                component={Link} 
                href={crumb.href} 
                underline="hover" 
                color="inherit" 
                key={index}
              >
                {crumb.label}
              </MuiLink>
            );
          })}
        </Breadcrumbs>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom={!!description}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body1" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>
        
        {action && (
          <Button
            variant="contained"
            color="primary"
            onClick={action}
            startIcon={actionIcon}
            {...actionProps}
          >
            {actionText}
          </Button>
        )}
      </Box>
      
      {divider && <Divider sx={{ mt: 2, mb: 3 }} />}
    </Box>
  );
}