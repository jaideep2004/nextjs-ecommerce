'use client';

import { useState, useEffect } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { getSettings } from '@/utils/settings';

export default function PayPalButton({ amount, cart, shippingData, formData, onSuccess, onError }) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState(null);

  // Fetch settings to ensure we have the latest
  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        const settingsData = await getSettings();
        setSettings(settingsData);
      } catch (err) {
        console.error('Error fetching settings in PayPalButton:', err);
      }
    };

    fetchSettingsData();
  }, []);

  const createOrder = async (data, actions) => {
    try {
      // Create PayPal order through PayPal's API
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: amount.toString(),
              currency_code: 'USD'
            },
          },
        ],
      });
    } catch (err) {
      setError('Failed to create PayPal order');
      console.error('Error creating PayPal order:', err);
      throw err;
    }
  };

  const onApprove = async (data, actions) => {
    setIsPending(true);
    try {
      // Capture the funds from the transaction
      const details = await actions.order.capture();
      
      // Create a payment result object from PayPal response
      const paymentResult = {
        id: details.id,
        status: details.status,
        email_address: details.payer.email_address,
        update_time: details.update_time,
        payer: details.payer
      };
      
      // Get authentication token from cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      
      // Set up headers with authentication token
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Calculate tax based on settings
      const taxRate = settings?.payment?.taxRate || 5;
      const taxAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0) * (taxRate / 100);
      
      // Calculate shipping based on settings
      let shippingPrice = settings?.shipping?.flatRateShipping || 10;
      if (settings?.shipping?.enableFreeShipping) {
        const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        if (total >= (settings?.shipping?.freeShippingThreshold || 100)) {
          shippingPrice = 0;
        }
      }
      
      // Prepare order data
      const orderData = {
        orderItems: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          color: item.color || '',
          size: item.size || '',
          product: item._id,
        })),
        shippingAddress: {
          fullName: shippingData.fullName,
          address: shippingData.address,
          city: shippingData.city,
          state: shippingData.state,
          zipCode: shippingData.zipCode,
          country: shippingData.country,
          phone: shippingData.phone,
          email: shippingData.email,
        },
        paymentMethod: 'paypal',
        itemsPrice: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
        shippingPrice: shippingPrice,
        taxPrice: taxAmount,
        totalPrice: cart.reduce((acc, item) => acc + item.price * item.quantity, 0) + shippingPrice + taxAmount,
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
        orderStatus: 'Processing' // Set to processing since payment is complete
      };
      
      // Create order with payment already complete
      const response = await axios.post('/api/orders/paypal', orderData, { headers });
      
      // Save address if requested
      if (formData.saveAddress) {
        await axios.put('/api/auth/update', {
          address: {
            street: shippingData.address,
            city: shippingData.city,
            state: shippingData.state,
            zipCode: shippingData.zipCode,
            country: shippingData.country,
          },
        }, { headers });
      }
      
      // Call the success callback with order ID
      onSuccess({ 
        orderId: response.data.data._id,
        paymentDetails: paymentResult 
      });
      return true;
    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error('Error processing payment:', err);
      onError(err);
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {isPending && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ ml: 1 }}>Processing payment...</Typography>
        </Box>
      )}
      
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => {
          setError('PayPal encountered an error. Please try again.');
          console.error('PayPal error:', err);
          onError(err);
        }}
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'pay',
        }}
        disabled={isPending}
      />
    </Box>
  );
}