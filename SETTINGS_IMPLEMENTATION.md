# Admin Settings Implementation

This document describes the implementation of the admin settings functionality in the Next.js E-commerce application.

## Overview

The admin settings implementation ensures that all settings configured in the admin panel are properly persisted, retrieved, and applied throughout the application. This includes:

1. Payment settings (PayPal client ID, tax rates, payment methods)
2. Shipping settings (free shipping thresholds, flat rates, shipping options)
3. General store settings (store name, contact information, etc.)

## Key Components

### 1. Settings Utility Functions (`src/utils/settings.js`)

This module provides utility functions for managing application settings:

- `fetchSettings()` - Fetches settings from the API with caching
- `getSettings()` - Gets settings with caching
- `clearSettingsCache()` - Clears the settings cache
- `getDefaultSettings()` - Returns default settings structure
- `calculateTax()` - Calculates tax based on settings
- `getAvailablePaymentMethods()` - Returns available payment methods based on settings

### 2. Admin Settings Page (`src/app/admin/settings/page.js`)

The admin settings page has been enhanced to:

- Properly persist all settings to the database
- Clear the settings cache when saving to ensure fresh data
- Maintain PayPal client ID and other sensitive information after page refresh
- Provide better UI feedback when settings are saved

### 3. Checkout Page (`src/app/checkout/page.js`)

The checkout page now properly uses settings for:

- Tax calculation based on the configured tax rate
- Available payment methods based on admin settings
- Shipping cost calculation based on shipping settings

### 4. PayPal Button Component (`src/components/payment/PayPalButton.jsx`)

The PayPal button component now:

- Uses settings for tax and shipping calculations
- Properly fetches settings to ensure up-to-date configuration

## How It Works

### Settings Persistence

Settings are stored in MongoDB using Mongoose. The schema includes sections for:
- General settings
- Payment settings
- Shipping settings
- Email settings
- Notification settings

### Settings Retrieval

Settings are retrieved through two API endpoints:
1. `/api/settings` - Public endpoint for frontend consumption
2. `/api/admin/settings` - Admin endpoint for managing settings

The public endpoint filters out sensitive information like API keys while providing necessary settings for frontend functionality.

### Caching

Settings are cached in the frontend to reduce API calls. The cache is invalidated when:
- Settings are saved in the admin panel
- The cache expires (5 minutes)

## Key Improvements

### 1. Persistent PayPal Client ID

Previously, the PayPal client ID would not persist after a page refresh. This has been fixed by:
- Properly saving the client ID to the database
- Ensuring the frontend retrieves the saved value on page load
- Clearing the cache when settings are updated

### 2. Dynamic Tax Calculation

Tax calculation now uses the configured tax rate from settings instead of a hardcoded value:
- Admin can set tax rate in the settings panel
- Checkout page calculates tax based on this setting
- PayPal button also uses the configured tax rate

### 3. Dynamic Payment Methods

Payment methods in checkout are now based on admin settings:
- Admin can enable/disable payment methods
- Checkout page only shows enabled payment methods
- Default payment method is set based on available options

### 4. Dynamic Shipping Calculation

Shipping costs are calculated based on admin settings:
- Free shipping threshold is configurable
- Flat rate shipping cost is configurable
- Shipping options are customizable

## Usage

### Admin Settings Configuration

1. Navigate to `/admin/settings`
2. Configure settings in the appropriate tabs:
   - General: Store information, maintenance mode, etc.
   - Payment: Enable/disable payment methods, set tax rate, configure API keys
   - Shipping: Configure shipping costs and options
   - Email: Configure SMTP settings
   - Notifications: Configure admin notifications
3. Click "Save Settings" to persist changes

### Applying Settings

Settings are automatically applied throughout the application:
- Tax rates are used in checkout and PayPal processing
- Payment methods are shown/hidden based on admin configuration
- Shipping costs are calculated based on configured rates

## Testing

Utility functions have been tested to ensure proper functionality:
- Tax calculation with various rates
- Payment method filtering based on settings
- Default settings structure validation

## Security

Sensitive information like API keys is:
- Stored securely in the database
- Filtered out of public API responses
- Only accessible to authenticated admin users