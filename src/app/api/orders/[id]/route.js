import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { isAuthenticated, isAdmin } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';

// Helper function to get user from request (supports both NextAuth and JWT)
async function getUserFromRequest(req) {
  // First try NextAuth session
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      await connectToDatabase();
      const user = await User.findOne({ email: session.user.email });
      if (user) {
        return {
          _id: user._id,
          isAdmin: user.isAdmin,
          email: user.email
        };
      }
    }
  } catch (nextAuthError) {
    console.log('NextAuth session check failed:', nextAuthError.message);
  }

  // Fallback to custom JWT authentication
  try {
    const decoded = await isAuthenticated(req);
    return decoded;
  } catch (jwtError) {
    console.log('JWT authentication failed:', jwtError.message);
    throw new Error('Not authenticated, no valid authentication method');
  }
}

// Get a single order
export async function GET(req, { params }) {
  return handleApiRequest(req, async () => {
    const user = await getUserFromRequest(req);
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
    if (!user.isAdmin && order.user._id.toString() !== user._id) {
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
    const user = await getUserFromRequest(req);
    // Check if user is admin
    if (!user.isAdmin) {
      return Response.json(
        apiError(403, 'Not authorized as admin'),
        { status: 403 }
      );
    }
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