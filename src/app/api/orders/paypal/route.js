import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { isAuthenticated } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';
import { sendOrderConfirmation, sendAdminOrderNotification } from '@/utils/email';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req) {
  return handleApiRequest(req, async () => {
    let user = null;
    
    // First try NextAuth session
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        await connectToDatabase();
        user = await User.findOne({ email: session.user.email });
        if (user) {
          user = {
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
    if (!user) {
      try {
        const decoded = await isAuthenticated(req);
        user = decoded;
      } catch (jwtError) {
        console.log('JWT authentication failed:', jwtError.message);
        return Response.json(
          apiError(401, 'Not authenticated, no valid authentication method'),
          { status: 401 }
        );
      }
    }
    
    // If no user found with either method
    if (!user) {
      return Response.json(
        apiError(401, 'Not authenticated, no valid authentication method'),
        { status: 401 }
      );
    }
    
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
    
    // Send email notifications
    try {
      // Get user information
      const dbUser = await User.findById(user._id);
      
      if (dbUser) {
        // Send order confirmation email to customer
        await sendOrderConfirmation({
          user: dbUser,
          order: {
            ...savedOrder.toObject(),
            _id: savedOrder._id.toString(),
            createdAt: savedOrder.createdAt
          }
        });
        
        // Send order notification email to admin
        await sendAdminOrderNotification({
          user: dbUser,
          order: {
            ...savedOrder.toObject(),
            _id: savedOrder._id.toString(),
            createdAt: savedOrder.createdAt
          }
        });
      }
    } catch (emailError) {
      console.error('Failed to send email notifications:', emailError);
      // Continue with the response even if email fails
    }

    return Response.json(
      apiResponse(201, savedOrder, 'Order created successfully'),
      { status: 201 }
    );
  });
}