import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { isAuthenticated } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';
import { sendOrderConfirmation, sendAdminOrderNotification } from '@/utils/email';

// Create a new order with PayPal payment already completed
export async function POST(req) {
  return handleApiRequest(req, async () => {
    const decoded = await isAuthenticated(req);
    await connectToDatabase();
    
    const orderData = await req.json();
    
    // Validate required fields
    const requiredFields = [
      'orderItems', 'shippingAddress', 'paymentMethod',
      'itemsPrice', 'taxPrice', 'totalPrice', 'paymentResult'
    ];
    
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return Response.json(
          apiError(400, `Please provide ${field}`),
          { status: 400 }
        );
      }
    }
    
    // Ensure shippingPrice is a number
    if (typeof orderData.shippingPrice !== 'number') {
      orderData.shippingPrice = parseFloat(orderData.shippingPrice) || 0;
    }
    
    // Make postalCode optional in shippingAddress
    if (orderData.shippingAddress && !orderData.shippingAddress.postalCode) {
      orderData.shippingAddress.postalCode = ''; // Set empty string as default
    }
    
    // Validate PayPal payment
    if (!orderData.paymentResult || !orderData.paymentResult.id) {
      return Response.json(
        apiError(400, 'Invalid PayPal payment result'),
        { status: 400 }
      );
    }
    
    // Create new order with payment already completed
    const order = new Order({
      ...orderData,
      user: decoded._id,
      isPaid: true,
      paidAt: orderData.paidAt || new Date(),
      orderStatus: 'Processing', // Set to processing since payment is complete
    });
    
    // Save the order
    await order.save();
    
    // Send email notifications
    try {
      // Get user information
      const user = await User.findById(decoded._id);
      
      if (user) {
        // Send order confirmation email to customer
        await sendOrderConfirmation({
          user,
          order: {
            ...order.toObject(),
            _id: order._id.toString(),
            createdAt: order.createdAt
          }
        });
        
        // Send order notification email to admin
        await sendAdminOrderNotification({
          user,
          order: {
            ...order.toObject(),
            _id: order._id.toString(),
            createdAt: order.createdAt
          }
        });
      }
    } catch (emailError) {
      console.error('Failed to send email notifications:', emailError);
      // Continue with the response even if email fails
    }
    
    return Response.json(
      apiResponse(201, order, 'PayPal order created successfully'),
      { status: 201 }
    );
  });
}