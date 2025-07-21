import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { isAuthenticated, isAdmin } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

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
    const { status, trackingNumber, trackingUrl, statusNote } = await req.json();
    
    const order = await Order.findById(id);
    
    if (!order) {
      return Response.json(
        apiError(404, 'Order not found'),
        { status: 404 }
      );
    }
    
    // Update order fields
    if (status) {
      order.status = status;
      
      // Update related fields based on status
      if (status === 'Processing') {
        order.isPaid = true;
        if (!order.paidAt) order.paidAt = new Date();
      } else if (status === 'Shipped') {
        order.isShipped = true;
        order.shippedAt = new Date();
      } else if (status === 'Delivered') {
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
    
    await order.save();
    
    return Response.json(
      apiResponse(200, order),
      { status: 200 }
    );
  });
}