import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  general: {
    storeName: { type: String, default: '' },
    storeEmail: { type: String, default: '' },
    storePhone: { type: String, default: '' },
    storeAddress: { type: String, default: '' },
    storeLogo: { type: String, default: '' },
    storeFavicon: { type: String, default: '' },
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
    paypalClientId: { type: String, default: '' },
    stripePublishableKey: { type: String, default: '' },
    stripeSecretKey: { type: String, default: '' },
    taxRate: { type: Number, default: 5 },
  },
  shipping: {
    enableFreeShipping: { type: Boolean, default: true },
    freeShippingThreshold: { type: Number, default: 100 },
    flatRateShipping: { type: Number, default: 10 },
    shippingOptions: [{
      name: { type: String, required: true },
      price: { type: Number, default: 0 },
      estimatedDays: { type: String, required: true },
    }],
  },
  email: {
    smtpHost: { type: String, default: '' },
    smtpPort: { type: String, default: '' },
    smtpUser: { type: String, default: '' },
    smtpPassword: { type: String, default: '' },
    smtpFromEmail: { type: String, default: '' },
    smtpFromName: { type: String, default: '' },
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
}, { timestamps: true });

settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne({});
  if (!settings) {
    settings = new this({});
    await settings.save();
  }
  return settings;
};

settingsSchema.statics.updateSettings = async function(data) {
  return this.findOneAndUpdate({}, data, { upsert: true, new: true });
};

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);