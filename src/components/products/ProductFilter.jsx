'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Slider,
  Button,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

export default function ProductFilter({
  categories = [],
  priceRange = [0, 1000],
  selectedCategories = [],
  selectedPriceRange = [0, 1000],
  selectedSort = 'newest',
  onFilterChange,
  onClearFilters,
  maxPrice = 1000,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState(selectedPriceRange);

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    let newCategories;
    
    if (checked) {
      newCategories = [...selectedCategories, value];
    } else {
      newCategories = selectedCategories.filter(cat => cat !== value);
    }
    
    onFilterChange('categories', newCategories);
  };

  const handleSortChange = (event) => {
    onFilterChange('sort', event.target.value);
  };

  const handlePriceChange = (event, newValue) => {
    setLocalPriceRange(newValue);
  };

  const handlePriceChangeCommitted = (event, newValue) => {
    onFilterChange('priceRange', newValue);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const filterContent = (
    <Box sx={{ p: isMobile ? 2 : 0 }}>
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Categories</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {categories.map((category) => (
              <FormControlLabel
                key={category._id}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(category._id)}
                    onChange={handleCategoryChange}
                    value={category._id}
                  />
                }
                label={category.name}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Price Range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Slider
              value={localPriceRange}
              onChange={handlePriceChange}
              onChangeCommitted={handlePriceChangeCommitted}
              valueLabelDisplay="auto"
              min={0}
              max={maxPrice}
              step={10}
              marks={[
                { value: 0, label: '$0' },
                { value: maxPrice, label: `$${maxPrice}` },
              ]}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <TextField
                label="Min"
                value={localPriceRange[0]}
                size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  readOnly: true,
                }}
              />
              <Box sx={{ mx: 1 }}>-</Box>
              <TextField
                label="Max"
                value={localPriceRange[1]}
                size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  readOnly: true,
                }}
              />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Sort By</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl component="fieldset">
            <RadioGroup value={selectedSort} onChange={handleSortChange}>
              <FormControlLabel value="newest" control={<Radio />} label="Newest" />
              <FormControlLabel value="price_asc" control={<Radio />} label="Price: Low to High" />
              <FormControlLabel value="price_desc" control={<Radio />} label="Price: High to Low" />
              <FormControlLabel value="rating" control={<Radio />} label="Highest Rated" />
              <FormControlLabel value="popular" control={<Radio />} label="Most Popular" />
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={onClearFilters}
        >
          Clear All Filters
        </Button>
      </Box>
    </Box>
  );

  // Mobile filter button
  const filterButton = isMobile && (
    <Button
      variant="outlined"
      startIcon={<FilterListIcon />}
      onClick={handleDrawerToggle}
      sx={{ mb: 2 }}
    >
      Filters
    </Button>
  );

  return (
    <>
      {filterButton}
      
      {isMobile ? (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            '& .MuiDrawer-paper': { width: 280, boxSizing: 'border-box' },
          }}
        >
          {filterContent}
        </Drawer>
      ) : (
        filterContent
      )}
    </>
  );
}