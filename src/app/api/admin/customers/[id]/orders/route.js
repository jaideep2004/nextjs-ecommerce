import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { isAuthenticated, isAdmin } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

// Get orders for a specific customer (admin only)
export async function GET(req, { params }) {
  return handleApiRequest(req, async () => {
    try {
      // Verify admin access
      const decoded = await isAdmin(req);
      
      // Connect to database
      await connectToDatabase();
      
      const customerId = params.id;
      
      // Get orders for this customer
      const orders = await Order.find({ user: customerId })
        .sort({ createdAt: -1 })
        .populate('user', 'name email')
        .lean();
      
      return Response.json(
        apiResponse(200, { orders }, 'Customer orders retrieved successfully'),
        { status: 200 }
      );
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  });
} 