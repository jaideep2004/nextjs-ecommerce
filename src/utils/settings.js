import axios from 'axios';

// Cache for settings to avoid repeated API calls
let settingsCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 1000; // 30 seconds - shorter cache for better responsiveness

/**
 * Fetch settings from the API
 * @param {boolean} forceRefresh - Whether to bypass cache and fetch fresh data
 * @returns {Promise<Object>} Settings object
 */
export async function fetchSettings(forceRefresh = false) {
  try {
    // Check if we have cached settings that are still valid
    const now = Date.now();
    if (!forceRefresh && settingsCache && (now - lastFetchTime) < CACHE_DURATION) {
      return settingsCache;
    }

    // Add cache busting parameter to ensure fresh data
    const cacheBuster = forceRefresh ? `?t=${now}` : '';
    const response = await axios.get(`/api/settings${cacheBuster}`);
    const settings = response.data.data || response.data;
    
    // Update cache
    settingsCache = settings;
    lastFetchTime = now;
    
    return settings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    // Return default settings if API fails
    return getDefaultSettings();
  }
}

/**
 * Get settings with caching
 * @param {boolean} forceRefresh - Whether to bypass cache and fetch fresh data
 * @returns {Promise<Object>} Settings object
 */
export async function getSettings(forceRefresh = false) {
  return await fetchSettings(forceRefresh);
}

/**
 * Clear settings cache
 */
export function clearSettingsCache() {
  settingsCache = null;
  lastFetchTime = 0;
}

/**
 * Get default settings structure
 * @returns {Object} Default settings
 */
export function getDefaultSettings() {
  return {
    general: {
      storeName: 'Next.js E-commerce',
      storeEmail: 'store@example.com',
      storePhone: '',
      storeAddress: '',
      storeLogo: '',
      storeFavicon: '',
      maintenanceMode: false,
      allowGuestCheckout: true,
      defaultCurrency: 'USD',
      defaultLanguage: 'en',
      itemsPerPage: 12,
    },
    payment: {
      enableCashOnDelivery: true,
      enablePaypal: false,
      enableStripe: false,
      paypalClientId: '',
      stripePublishableKey: '',
      stripeSecretKey: '',
      taxRate: 5,
    },
    shipping: {
      enableFreeShipping: true,
      freeShippingThreshold: 100,
      flatRateShipping: 10,
      shippingOptions: [
        { name: 'Standard Shipping', price: 10, estimatedDays: '3-5' },
        { name: 'Express Shipping', price: 25, estimatedDays: '1-2' },
      ],
    },
    email: {
      smtpHost: '',
      smtpPort: '',
      smtpUser: '',
      smtpPassword: '',
      smtpFromEmail: '',
      smtpFromName: '',
      enableOrderConfirmation: true,
      enableShippingNotification: true,
      enableDeliveryNotification: true,
    },
    notification: {
      notifyLowStock: true,
      lowStockThreshold: 5,
      notifyOutOfStock: true,
      notifyNewOrder: true,
      notifyNewCustomer: true,
      notifyNewReview: true,
    },
  };
}

/**
 * Calculate tax amount based on settings
 * @param {number} amount - The amount to calculate tax for
 * @param {Object} settings - Settings object containing tax rate
 * @returns {number} Tax amount
 */
export function calculateTax(amount, settings) {
  const taxRate = settings?.payment?.taxRate || 0;
  return amount * (taxRate / 100);
}

/**
 * Get available payment methods based on settings
 * @param {Object} settings - Settings object
 * @returns {Array} Array of available payment methods
 */
export function getAvailablePaymentMethods(settings) {
  const methods = [];
  
  if (settings?.payment?.enableCashOnDelivery) {
    methods.push({
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order'
    });
  }
  
  if (settings?.payment?.enablePaypal && settings?.payment?.paypalClientId) {
    methods.push({
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with PayPal (Credit/Debit Cards)'
    });
  }
  
  if (settings?.payment?.enableStripe && settings?.payment?.stripePublishableKey && settings?.payment?.stripeSecretKey) {
    methods.push({
      id: 'stripe',
      name: 'Credit Card',
      description: 'Pay with credit/debit card'
    });
  }
  
  // If no payment methods are configured, default to COD
  if (methods.length === 0) {
    methods.push({
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order'
    });
  }
  
  return methods;
}