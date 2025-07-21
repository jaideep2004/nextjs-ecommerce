'use client';

import { Box, Pagination as MuiPagination, FormControl, Select, MenuItem, Typography } from '@mui/material';

export default function Pagination({
  count = 1,
  page = 1,
  rowsPerPage = 10,
  rowsPerPageOptions = [10, 25, 50, 100],
  onPageChange,
  onRowsPerPageChange,
  showRowsPerPage = true,
  sx = {},
}) {
  const handlePageChange = (event, value) => {
    if (onPageChange) {
      onPageChange(value);
    }
  };

  const handleRowsPerPageChange = (event) => {
    if (onRowsPerPageChange) {
      onRowsPerPageChange(event.target.value);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        py: 2,
        ...sx,
      }}
    >
      {showRowsPerPage && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
            Rows per page:
          </Typography>
          <FormControl size="small">
            <Select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              displayEmpty
              inputProps={{ 'aria-label': 'rows per page' }}
            >
              {rowsPerPageOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      <MuiPagination
        count={count}
        page={page}
        onChange={handlePageChange}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
      />
    </Box>
  );
}