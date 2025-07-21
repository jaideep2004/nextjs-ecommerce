import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { isAuthenticated, isAdmin } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';
import { sendOrderStatusUpdate } from '@/utils/email';

// Get a single order (admin only)
export async function GET(req, { params }) {
  return handleApiRequest(req, async () => {
    // Verify admin access
    const decoded = await isAdmin(req);
    await connectToDatabase();
    
    const { id } = params;
    
    const order = await Order.findById(id).populate('user', 'name email');
    
    if (!order) {
      return Response.json(
        apiError(404, 'Order not found'),
        { status: 404 }
      );
    }
    
    return Response.json(
      apiResponse(200, order),
      { status: 200 }
    );
  });
}

// Update order status (admin only)
export async function PUT(req, { params }) {
  return handleApiRequest(req, async () => {
    const decoded = await isAdmin(req);
    await connectToDatabase();
    
    const { id } = params;
    const { orderStatus, trackingNumber, trackingUrl, statusNote } = await req.json();
    
    const order = await Order.findById(id);
    
    if (!order) {
      return Response.json(
        apiError(404, 'Order not found'),
        { status: 404 }
      );
    }
    
    // Update order fields
    if (orderStatus) {
      order.orderStatus = orderStatus;
      
      // Update related fields based on status
      if (orderStatus === 'Processing') {
        order.isPaid = true;
        if (!order.paidAt) order.paidAt = new Date();
      } else if (orderStatus === 'Shipped') {
        order.isShipped = true;
        order.shippedAt = new Date();
      } else if (orderStatus === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = new Date();
      }
    }
    
    if (trackingNumber !== undefined) {
      order.trackingNumber = trackingNumber;
    }
    
    if (trackingUrl !== undefined) {
      order.trackingUrl = trackingUrl;
    }
    
    if (statusNote !== undefined) {
      order.statusNote = statusNote;
    }
    
    // Save the updated order
    await order.save();
    
    // Send email notification about status update
    try {
      // Get user information
      const user = await User.findById(order.user);
      
      if (user) {
        await sendOrderStatusUpdate({
          user,
          order: {
            ...order.toObject(),
            _id: order._id.toString(),
            createdAt: order.createdAt
          }
        });
      }
    } catch (emailError) {
      console.error('Failed to send order status email:', emailError);
      // Continue with the response even if email fails
    }
    
    return Response.json(
      apiResponse(200, order),
      { status: 200 }
    );
  });
}