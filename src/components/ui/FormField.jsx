'use client';

import {
  TextField,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  RadioGroup,
  Radio,
  Switch,
  Box,
  Typography,
  Chip,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';

export default function FormField({
  type = 'text',
  name,
  label,
  value,
  onChange,
  error,
  helperText,
  required = false,
  fullWidth = true,
  disabled = false,
  options = [],
  multiple = false,
  rows = 4,
  placeholder,
  startAdornment,
  endAdornment,
  sx = {},
  InputProps = {},
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Password field with toggle visibility
  if (type === 'password') {
    return (
      <TextField
        type={showPassword ? 'text' : 'password'}
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        error={!!error}
        helperText={error || helperText}
        required={required}
        fullWidth={fullWidth}
        disabled={disabled}
        placeholder={placeholder}
        sx={sx}
        InputProps={{
          ...InputProps,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...props}
      />
    );
  }

  // Textarea
  if (type === 'textarea') {
    return (
      <TextField
        multiline
        rows={rows}
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        error={!!error}
        helperText={error || helperText}
        required={required}
        fullWidth={fullWidth}
        disabled={disabled}
        placeholder={placeholder}
        sx={sx}
        InputProps={{
          ...InputProps,
          startAdornment: startAdornment && (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          ),
          endAdornment: endAdornment && (
            <InputAdornment position="end">{endAdornment}</InputAdornment>
          ),
        }}
        {...props}
      />
    );
  }

  // Select dropdown
  if (type === 'select') {
    return (
      <FormControl
        fullWidth={fullWidth}
        error={!!error}
        required={required}
        disabled={disabled}
        sx={sx}
      >
        <InputLabel id={`${name}-label`}>{label}</InputLabel>
        <Select
          labelId={`${name}-label`}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          label={label}
          multiple={multiple}
          input={<OutlinedInput label={label} />}
          renderValue={multiple ? (selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => {
                const option = options.find(opt => opt.value === value);
                return (
                  <Chip key={value} label={option ? option.label : value} size="small" />
                );
              })}
            </Box>
          ) : undefined}
          {...props}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {(error || helperText) && <FormHelperText>{error || helperText}</FormHelperText>}
      </FormControl>
    );
  }

  // Checkbox
  if (type === 'checkbox') {
    return (
      <FormControl
        error={!!error}
        required={required}
        disabled={disabled}
        fullWidth={fullWidth}
        sx={sx}
      >
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!value}
                onChange={onChange}
                name={name}
                {...props}
              />
            }
            label={label}
          />
        </FormGroup>
        {(error || helperText) && <FormHelperText>{error || helperText}</FormHelperText>}
      </FormControl>
    );
  }

  // Radio group
  if (type === 'radio') {
    return (
      <FormControl
        error={!!error}
        required={required}
        disabled={disabled}
        fullWidth={fullWidth}
        sx={sx}
      >
        {label && <Typography variant="subtitle2">{label}</Typography>}
        <RadioGroup
          name={name}
          value={value}
          onChange={onChange}
          row={props.row}
          {...props}
        >
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
        {(error || helperText) && <FormHelperText>{error || helperText}</FormHelperText>}
      </FormControl>
    );
  }

  // Switch
  if (type === 'switch') {
    return (
      <FormControl
        error={!!error}
        required={required}
        disabled={disabled}
        fullWidth={fullWidth}
        sx={sx}
      >
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={!!value}
                onChange={onChange}
                name={name}
                {...props}
              />
            }
            label={label}
          />
        </FormGroup>
        {(error || helperText) && <FormHelperText>{error || helperText}</FormHelperText>}
      </FormControl>
    );
  }

  // Default text input
  return (
    <TextField
      type={type}
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error || helperText}
      required={required}
      fullWidth={fullWidth}
      disabled={disabled}
      placeholder={placeholder}
      sx={sx}
      InputProps={{
        ...InputProps,
        startAdornment: startAdornment && (
          <InputAdornment position="start">{startAdornment}</InputAdornment>
        ),
        endAdornment: endAdornment && (
          <InputAdornment position="end">{endAdornment}</InputAdornment>
        ),
      }}
      {...props}
    />
  );
}