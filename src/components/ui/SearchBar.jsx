'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Paper, InputBase, IconButton, Box } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

export default function SearchBar({
  placeholder = 'Search...',
  initialValue = '',
  onSearch,
  fullWidth = true,
  size = 'medium',
  sx = {},
  inputProps = {},
  searchPath = '/search',
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialValue);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (onSearch) {
      onSearch(searchQuery.trim());
    } else {
      // Default behavior: navigate to search page
      router.push(`${searchPath}?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Box component="form" onSubmit={handleSearch} sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <Paper
        sx={{
          p: size === 'small' ? '2px 4px' : '4px 8px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          ...sx,
        }}
        elevation={1}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleChange}
          inputProps={{
            'aria-label': placeholder,
            ...inputProps,
          }}
        />
        {searchQuery && (
          <IconButton
            size={size === 'small' ? 'small' : 'medium'}
            aria-label="clear"
            onClick={handleClear}
          >
            <ClearIcon fontSize={size === 'small' ? 'small' : 'medium'} />
          </IconButton>
        )}
        <IconButton
          type="submit"
          size={size === 'small' ? 'small' : 'medium'}
          aria-label="search"
          disabled={!searchQuery.trim()}
        >
          <SearchIcon fontSize={size === 'small' ? 'small' : 'medium'} />
        </IconButton>
      </Paper>
    </Box>
  );
}