'use client';

import { Box, Container, Typography, Divider, Paper } from '@mui/material';

export default function SectionContainer({
  title,
  subtitle,
  children,
  maxWidth = 'lg',
  withPaper = true,
  withDivider = false,
  titleAlign = 'left',
  spacing = 4,
  paperProps = {},
  containerProps = {},
  titleProps = {},
  subtitleProps = {},
  sx = {},
}) {
  const content = (
    <>
      {title && (
        <Box sx={{ mb: subtitle ? 1 : 3, textAlign: titleAlign }}>
          <Typography variant="h4" component="h2" gutterBottom={false} {...titleProps}>
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mt: 1, mb: 3 }} 
              {...subtitleProps}
            >
              {subtitle}
            </Typography>
          )}
          {withDivider && <Divider sx={{ mt: 2, mb: 3 }} />}
        </Box>
      )}
      {children}
    </>
  );

  return (
    <Container maxWidth={maxWidth} sx={{ my: spacing, ...sx }} {...containerProps}>
      {withPaper ? (
        <Paper sx={{ p: 3 }} elevation={1} {...paperProps}>
          {content}
        </Paper>
      ) : (
        content
      )}
    </Container>
  );
}