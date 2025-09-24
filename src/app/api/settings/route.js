import connectToDatabase from '@/lib/mongodb';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';
import Settings from '@/models/Settings';


// Get public settings (no authentication required)
export async function GET(req) {
  return handleApiRequest(req, async () => {
    await connectToDatabase();
    
    // Get settings using the model's helper method
    const settings = await Settings.getSettings();
    
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
    
    // Add cache control headers to prevent caching
    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
    
    return Response.json(
      apiResponse(publicSettings),
      { 
        status: 200,
        headers
      }
    );
  });
}