// Test script to verify settings functionality
const axios = require('axios');

async function testSettings() {
  try {
    console.log('Testing settings API...');
    
    // Test getting settings
    const response = await axios.get('http://localhost:3000/api/settings');
    console.log('Settings fetched successfully:');
    console.log('Tax Rate:', response.data.data?.payment?.taxRate || 'Not set');
    console.log('Free Shipping Threshold:', response.data.data?.shipping?.freeShippingThreshold || 'Not set');
    console.log('Flat Rate Shipping:', response.data.data?.shipping?.flatRateShipping || 'Not set');
    console.log('PayPal Enabled:', response.data.data?.payment?.enablePaypal || false);
    console.log('Stripe Enabled:', response.data.data?.payment?.enableStripe || false);
    console.log('COD Enabled:', response.data.data?.payment?.enableCashOnDelivery || false);
    
  } catch (error) {
    console.error('Error testing settings:', error.message);
  }
}

testSettings();