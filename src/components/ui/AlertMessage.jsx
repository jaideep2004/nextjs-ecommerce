'use client';

import { useState, useEffect } from 'react';
import { Alert, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function AlertMessage({
  message,
  severity = 'info',
  onClose,
  autoHideDuration = 6000,
  showIcon = true,
  variant = 'filled',
}) {
  const [open, setOpen] = useState(!!message);

  useEffect(() => {
    setOpen(!!message);

    let timer;
    if (message && autoHideDuration) {
      timer = setTimeout(() => {
        setOpen(false);
        if (onClose) onClose();
      }, autoHideDuration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [message, autoHideDuration, onClose]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  if (!message) return null;

  return (
    <Collapse in={open}>
      <Alert
        severity={severity}
        variant={variant}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ mb: 2 }}
        icon={showIcon ? undefined : false}
      >
        {message}
      </Alert>
    </Collapse>
  );
}