'use client';

import { Box, Skeleton, Container, Paper } from '@mui/material';

export default function ContentSkeleton({ 
  titleWidth = '40%',
  paragraphCount = 3,
  withContainer = true,
  withPaper = true,
  spacing = 2
}) {
  const content = (
    <Box sx={{ width: '100%', mb: spacing }}>
      <Skeleton variant="text" width={titleWidth} height={40} sx={{ mb: spacing }} />
      {Array.from(new Array(paragraphCount)).map((_, index) => (
        <Skeleton 
          key={index} 
          variant="text" 
          width={`${100 - (index * 5)}%`} 
          height={20} 
          sx={{ mb: 1 }} 
        />
      ))}
    </Box>
  );

  if (withContainer && withPaper) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          {content}
        </Paper>
      </Container>
    );
  }

  if (withContainer) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {content}
      </Container>
    );
  }

  if (withPaper) {
    return (
      <Paper sx={{ p: 3 }}>
        {content}
      </Paper>
    );
  }

  return content;
}

export function FormSkeleton({ fields = 4, buttonWidth = 120 }) {
  return (
    <Box sx={{ width: '100%' }}>
      {Array.from(new Array(fields)).map((_, index) => (
        <Skeleton 
          key={index} 
          variant="rectangular" 
          width="100%" 
          height={56} 
          sx={{ mb: 2, borderRadius: 1 }} 
        />
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Skeleton variant="rectangular" width={buttonWidth} height={36} sx={{ borderRadius: 1 }} />
      </Box>
    </Box>
  );
}