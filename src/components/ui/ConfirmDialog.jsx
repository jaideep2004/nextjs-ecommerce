'use client';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  cancelColor = 'inherit',
  confirmVariant = 'contained',
  cancelVariant = 'text',
  icon,
  maxWidth = 'sm',
  fullWidth = true,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  loading = false,
}) {
  const handleClose = (event, reason) => {
    if (disableBackdropClick && reason === 'backdropClick') return;
    if (disableEscapeKeyDown && reason === 'escapeKeyDown') return;
    if (onClose) onClose();
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">
        <Box display="flex" alignItems="center">
          {icon && <Box mr={1}>{icon}</Box>}
          <Typography variant="h6" component="span">
            {title}
          </Typography>
          <Box sx={{ ml: 'auto' }}>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              edge="end"
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          color={cancelColor}
          variant={cancelVariant}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          color={confirmColor}
          variant={confirmVariant}
          autoFocus
          disabled={loading}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}