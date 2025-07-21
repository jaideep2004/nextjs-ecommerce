'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Box,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  Skeleton,
} from '@mui/material';
import {
  ArrowBackIos,
  ArrowForwardIos,
  ZoomIn,
  Close,
} from '@mui/icons-material';

export default function ProductImageGallery({ images = [], alt = 'Product image' }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleOpenLightbox = () => {
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  const handleImageLoad = (index) => {
    setImagesLoaded((prev) => ({ ...prev, [index]: true }));
  };

  // If no images provided, show placeholder
  if (!images.length) {
    images = ['/images/placeholder.png'];
  }

  return (
    <>
      <Grid container spacing={2}>
        {/* Thumbnails - only show on desktop */}
        <Grid item xs={0} sm={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {images.map((image, index) => (
              <Paper
                key={index}
                elevation={1}
                sx={{
                  position: 'relative',
                  paddingTop: '100%',
                  cursor: 'pointer',
                  border: selectedImage === index ? '2px solid' : 'none',
                  borderColor: 'primary.main',
                  overflow: 'hidden',
                }}
                onClick={() => handleThumbnailClick(index)}
              >
                {!imagesLoaded[`thumb-${index}`] && (
                  <Skeleton
                    variant="rectangular"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  />
                )}
                <Image
                  src={image}
                  alt={`${alt} thumbnail ${index + 1}`}
                  fill
                  sizes="100px"
                  style={{
                    objectFit: 'cover',
                    opacity: imagesLoaded[`thumb-${index}`] ? 1 : 0,
                  }}
                  onLoad={() => handleImageLoad(`thumb-${index}`)}
                />
              </Paper>
            ))}
          </Box>
        </Grid>

        {/* Main image */}
        <Grid item xs={12} sm={10}>
          <Paper
            elevation={2}
            sx={{
              position: 'relative',
              paddingTop: '100%',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
            onClick={handleOpenLightbox}
          >
            {!imagesLoaded[`main-${selectedImage}`] && (
              <Skeleton
                variant="rectangular"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
            )}
            <Image
              src={images[selectedImage]}
              alt={`${alt} ${selectedImage + 1}`}
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
              priority={selectedImage === 0}
              style={{
                objectFit: 'contain',
                opacity: imagesLoaded[`main-${selectedImage}`] ? 1 : 0,
              }}
              onLoad={() => handleImageLoad(`main-${selectedImage}`)}
            />

            {/* Zoom icon */}
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
              onClick={handleOpenLightbox}
            >
              <ZoomIn />
            </IconButton>

            {/* Navigation arrows - only show when there are multiple images */}
            {images.length > 1 && (
              <>
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: 8,
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                >
                  <ArrowBackIos />
                </IconButton>
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: 8,
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                >
                  <ArrowForwardIos />
                </IconButton>
              </>
            )}
          </Paper>

          {/* Mobile thumbnails */}
          <Box
            sx={{
              display: { xs: 'flex', sm: 'none' },
              justifyContent: 'center',
              gap: 1,
              mt: 2,
              flexWrap: 'wrap',
            }}
          >
            {images.map((image, index) => (
              <Paper
                key={index}
                elevation={1}
                sx={{
                  position: 'relative',
                  width: 60,
                  height: 60,
                  cursor: 'pointer',
                  border: selectedImage === index ? '2px solid' : 'none',
                  borderColor: 'primary.main',
                  overflow: 'hidden',
                }}
                onClick={() => handleThumbnailClick(index)}
              >
                <Image
                  src={image}
                  alt={`${alt} thumbnail ${index + 1}`}
                  fill
                  sizes="60px"
                  style={{ objectFit: 'cover' }}
                />
              </Paper>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Lightbox */}
      <Dialog
        open={lightboxOpen}
        onClose={handleCloseLightbox}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ position: 'relative', p: 0, bgcolor: 'black' }}>
          <IconButton
            onClick={handleCloseLightbox}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <Close />
          </IconButton>

          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: '50vh', sm: '70vh' },
            }}
          >
            <Image
              src={images[selectedImage]}
              alt={`${alt} ${selectedImage + 1}`}
              fill
              sizes="100vw"
              style={{ objectFit: 'contain' }}
            />
          </Box>

          {images.length > 1 && (
            <>
              <IconButton
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 16,
                  transform: 'translateY(-50%)',
                  color: 'white',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
                onClick={handlePrevImage}
              >
                <ArrowBackIos />
              </IconButton>
              <IconButton
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 16,
                  transform: 'translateY(-50%)',
                  color: 'white',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
                onClick={handleNextImage}
              >
                <ArrowForwardIos />
              </IconButton>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}