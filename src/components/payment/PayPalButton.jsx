'use client';

import { useState, useEffect } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

export default function PayPalButton({ amount, orderId, onSuccess, onError }) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');

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
      
      // Send the payment result to your API
      const response = await axios.post(`/api/orders/${orderId}/pay`, {
        paymentResult,
      });
      
      // Call the success callback
      onSuccess(response.data);
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