import { calculateTax, getAvailablePaymentMethods, getDefaultSettings } from './settings';

describe('Settings Utilities', () => {
  describe('calculateTax', () => {
    it('should calculate tax correctly based on settings', () => {
      const settings = {
        payment: {
          taxRate: 10
        }
      };
      
      const amount = 100;
      const tax = calculateTax(amount, settings);
      
      expect(tax).toBe(10);
    });
    
    it('should return 0 tax when no settings provided', () => {
      const amount = 100;
      const tax = calculateTax(amount, null);
      
      expect(tax).toBe(0);
    });
    
    it('should return 0 tax when no tax rate in settings', () => {
      const settings = {
        payment: {}
      };
      
      const amount = 100;
      const tax = calculateTax(amount, settings);
      
      expect(tax).toBe(0);
    });
    
    // New test for our fix
    it('should handle tax rate as zero correctly', () => {
      const settings = {
        payment: {
          taxRate: 0
        }
      };
      
      const amount = 100;
      const tax = calculateTax(amount, settings);
      
      expect(tax).toBe(0);
    });
  });
  
  describe('getAvailablePaymentMethods', () => {
    it('should return all available payment methods based on settings', () => {
      const settings = {
        payment: {
          enableCashOnDelivery: true,
          enablePaypal: true,
          enableStripe: true
        }
      };
      
      const methods = getAvailablePaymentMethods(settings);
      
      expect(methods).toHaveLength(3);
      expect(methods[0]).toEqual({
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay when you receive your order'
      });
      expect(methods[1]).toEqual({
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with PayPal (Credit/Debit Cards)'
      });
      expect(methods[2]).toEqual({
        id: 'stripe',
        name: 'Credit Card',
        description: 'Pay with credit/debit card'
      });
    });
    
    it('should return only enabled payment methods', () => {
      const settings = {
        payment: {
          enableCashOnDelivery: true,
          enablePaypal: false,
          enableStripe: true
        }
      };
      
      const methods = getAvailablePaymentMethods(settings);
      
      expect(methods).toHaveLength(2);
      expect(methods[0].id).toBe('cod');
      expect(methods[1].id).toBe('stripe');
    });
    
    it('should return empty array when no methods enabled', () => {
      const settings = {
        payment: {
          enableCashOnDelivery: false,
          enablePaypal: false,
          enableStripe: false
        }
      };
      
      const methods = getAvailablePaymentMethods(settings);
      
      expect(methods).toHaveLength(0);
    });
    
    it('should return empty array when no settings provided', () => {
      const methods = getAvailablePaymentMethods(null);
      
      expect(methods).toHaveLength(0);
    });
  });
  
  describe('getDefaultSettings', () => {
    it('should return default settings structure', () => {
      const settings = getDefaultSettings();
      
      expect(settings).toHaveProperty('general');
      expect(settings).toHaveProperty('payment');
      expect(settings).toHaveProperty('shipping');
      expect(settings).toHaveProperty('email');
      expect(settings).toHaveProperty('notification');
      
      // Check some default values
      expect(settings.general.storeName).toBe('Next.js E-commerce');
      expect(settings.payment.taxRate).toBe(5);
      expect(settings.payment.enableCashOnDelivery).toBe(true);
    });
  });
});