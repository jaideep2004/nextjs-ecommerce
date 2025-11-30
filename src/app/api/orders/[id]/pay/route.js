import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { isAuthenticated } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../auth/[...nextauth]/route';

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

// Process payment for an order
export async function POST(req, { params }) {
  return handleApiRequest(req, async () => {
    const user = await getUserFromRequest(req);
    await connectToDatabase();
    
    const { id } = params;
    const { paymentResult } = await req.json();
    
    const order = await Order.findById(id);
    
    if (!order) {
      return Response.json(
        apiError(404, 'Order not found'),
        { status: 404 }
      );
    }
    
    // Check if the user is authorized to pay for this order
    if (order.user.toString() !== user._id && !user.isAdmin) {
      return Response.json(
        apiError(403, 'Not authorized to pay for this order'),
        { status: 403 }
      );
    }
    
    // Update order with payment information
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: paymentResult.id,
      status: paymentResult.status,
      email_address: paymentResult.email_address,
    };
    
    // Update order status to Processing after payment
    order.orderStatus = 'Processing';
    
    const updatedOrder = await order.save();
    
    return Response.json(
      apiResponse(200, updatedOrder, 'Payment processed successfully'),
      { status: 200 }
    );
  });
}