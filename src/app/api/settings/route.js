import connectToDatabase from '@/lib/mongodb';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';
import mongoose from 'mongoose';

// Use the same Settings model as in the admin settings route
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

// Get public settings (no authentication required)
export async function GET(req) {
  return handleApiRequest(req, async () => {
    await connectToDatabase();
    
    // Find settings or create default if not exists
    let settings = await Settings.findOne({});
    
    if (!settings) {
      settings = await Settings.create({});
    }
    
    // Create a filtered version of settings for public consumption
    // Only include necessary fields and exclude sensitive information
    const publicSettings = {
      general: {
        storeName: settings.general?.storeName,
        storeEmail: settings.general?.storeEmail,
        storePhone: settings.general?.storePhone,
        storeAddress: settings.general?.storeAddress,
        storeLogo: settings.general?.storeLogo,
        storeFavicon: settings.general?.storeFavicon,
        maintenanceMode: settings.general?.maintenanceMode,
        allowGuestCheckout: settings.general?.allowGuestCheckout,
        defaultCurrency: settings.general?.defaultCurrency,
        defaultLanguage: settings.general?.defaultLanguage,
        itemsPerPage: settings.general?.itemsPerPage,
      },
      payment: {
        enableCashOnDelivery: settings.payment?.enableCashOnDelivery,
        enablePaypal: settings.payment?.enablePaypal,
        enableStripe: settings.payment?.enableStripe,
        paypalClientId: settings.payment?.paypalClientId,
        // Exclude sensitive keys
        // stripePublishableKey: settings.payment?.stripePublishableKey,
        // stripeSecretKey: settings.payment?.stripeSecretKey,
        taxRate: settings.payment?.taxRate,
      },
      shipping: {
        enableFreeShipping: settings.shipping?.enableFreeShipping,
        freeShippingThreshold: settings.shipping?.freeShippingThreshold,
        flatRateShipping: settings.shipping?.flatRateShipping,
        shippingOptions: settings.shipping?.shippingOptions,
      },
    };
    
    return Response.json(
      apiResponse(publicSettings),
      { status: 200 }
    );
  });
}