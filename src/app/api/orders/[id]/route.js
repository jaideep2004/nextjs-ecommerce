import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { isAuthenticated, isAdmin } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

// Get a single order
export async function GET(req, { params }) {
  return handleApiRequest(req, async () => {
    const decoded = await isAuthenticated(req);
    await connectToDatabase();
    
    const { id } = params;
    
    const order = await Order.findById(id).populate('user', 'name email');
    
    if (!order) {
      return Response.json(
        apiError(404, 'Order not found'),
        { status: 404 }
      );
    }
    
    // Check if the user is authorized to view this order
    if (!decoded.isAdmin && order.user._id.toString() !== decoded._id) {
      return Response.json(
        apiError(403, 'Not authorized to view this order'),
        { status: 403 }
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
    const { orderStatus, trackingNumber, isDelivered, isPaid, paidAt, deliveredAt } = await req.json();
    
    const order = await Order.findById(id);
    
    if (!order) {
      return Response.json(
        apiError(404, 'Order not found'),
        { status: 404 }
      );
    }
    
    // Update order fields
    if (orderStatus) order.orderStatus = orderStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (isDelivered !== undefined) {
      order.isDelivered = isDelivered;
      if (isDelivered) order.deliveredAt = deliveredAt || new Date();
    }
    if (isPaid !== undefined) {
      order.isPaid = isPaid;
      if (isPaid) order.paidAt = paidAt || new Date();
    }
    
    await order.save();
    
    return Response.json(
      apiResponse(200, order, 'Order updated successfully'),
      { status: 200 }
    );
  });
}