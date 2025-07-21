import connectToDatabase from '@/lib/mongodb';
import { isAdmin } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';
import mongoose from 'mongoose';

// Define the Settings schema if it doesn't exist
let Settings;
if (!mongoose.models.Settings) {
  const settingsSchema = new mongoose.Schema(
    {
      general: {
        storeName: { type: String, default: 'Next.js E-commerce' },
        storeEmail: { type: String, default: 'store@example.com' },
        storePhone: { type: String },
        storeAddress: { type: String },
        storeLogo: { type: String },
        storeFavicon: { type: String },
        maintenanceMode: { type: Boolean, default: false },
        allowGuestCheckout: { type: Boolean, default: true },
        defaultCurrency: { type: String, default: 'USD' },
        defaultLanguage: { type: String, default: 'en' },
        itemsPerPage: { type: Number, default: 12 },
      },
      payment: {
        enableCashOnDelivery: { type: Boolean, default: true },
        enablePaypal: { type: Boolean, default: false },
        enableStripe: { type: Boolean, default: false },
        paypalClientId: { type: String },
        stripePublishableKey: { type: String },
        stripeSecretKey: { type: String },
        taxRate: { type: Number, default: 5 },
      },
      shipping: {
        enableFreeShipping: { type: Boolean, default: true },
        freeShippingThreshold: { type: Number, default: 100 },
        flatRateShipping: { type: Number, default: 10 },
        shippingOptions: [
          {
            name: { type: String },
            price: { type: Number },
            estimatedDays: { type: String },
          },
        ],
      },
      email: {
        smtpHost: { type: String },
        smtpPort: { type: String },
        smtpUser: { type: String },
        smtpPassword: { type: String },
        smtpFromEmail: { type: String },
        smtpFromName: { type: String },
        enableOrderConfirmation: { type: Boolean, default: true },
        enableShippingNotification: { type: Boolean, default: true },
        enableDeliveryNotification: { type: Boolean, default: true },
      },
      notification: {
        notifyLowStock: { type: Boolean, default: true },
        lowStockThreshold: { type: Number, default: 5 },
        notifyOutOfStock: { type: Boolean, default: true },
        notifyNewOrder: { type: Boolean, default: true },
        notifyNewCustomer: { type: Boolean, default: true },
        notifyNewReview: { type: Boolean, default: true },
      },
    },
    {
      timestamps: true,
    }
  );
  
  Settings = mongoose.model('Settings', settingsSchema);
} else {
  Settings = mongoose.models.Settings;
}

// Get all settings
export async function GET(req) {
  return handleApiRequest(req, async () => {
    // Verify admin access
    await isAdmin(req);
    await connectToDatabase();
    
    // Find settings or create default if not exists
    let settings = await Settings.findOne({});
    
    if (!settings) {
      settings = await Settings.create({});
    }
    
    return Response.json(
      apiResponse(settings),
      { status: 200 }
    );
  });
}

// Update settings
export async function PUT(req) {
  return handleApiRequest(req, async () => {
    // Verify admin access
    await isAdmin(req);
    await connectToDatabase();
    
    const settingsData = await req.json();
    
    // Find settings or create default if not exists
    let settings = await Settings.findOne({});
    
    if (!settings) {
      settings = new Settings({});
    }
    
    // Update settings with new data
    if (settingsData.general) settings.general = { ...settings.general, ...settingsData.general };
    if (settingsData.payment) settings.payment = { ...settings.payment, ...settingsData.payment };
    if (settingsData.shipping) settings.shipping = { ...settings.shipping, ...settingsData.shipping };
    if (settingsData.email) settings.email = { ...settings.email, ...settingsData.email };
    if (settingsData.notification) settings.notification = { ...settings.notification, ...settingsData.notification };
    
    await settings.save();
    
    return Response.json(
      apiResponse(settings),
      { status: 200 }
    );
  });
}