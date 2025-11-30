import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { isAuthenticated } from '@/utils/auth';
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

export async function POST(req) {
  return handleApiRequest(req, async () => {
    // Verify user is authenticated
    const user = await getUserFromRequest(req);
    await connectToDatabase();

    const orderData = await req.json();

    // Create order with PayPal payment data
    const order = new Order({
      ...orderData,
      user: user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedOrder = await order.save();

    return Response.json(
      apiResponse(savedOrder, 'Order created successfully'),
      { status: 201 }
    );
  });
}