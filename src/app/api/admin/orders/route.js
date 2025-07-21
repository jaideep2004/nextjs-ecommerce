import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { isAuthenticated, isAdmin } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

// Get all orders (admin only)
export async function GET(req) {
  return handleApiRequest(req, async () => {
    // Verify admin access
    const decoded = await isAdmin(req);
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '0') + 1; // Convert from 0-indexed to 1-indexed
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    // Filtering
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    
    const filter = {};
    
    if (search) {
      filter.$or = [
        { 'user.name': { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } },
        { '_id': search.length === 24 ? search : null }
      ];
    }
    
    if (status) {
      filter.status = status;
    }
    
    // Get orders with populated user data
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalOrders = await Order.countDocuments(filter);
    
    return Response.json(
      {
        orders,
        totalOrders,
      },
      { status: 200 }
    );
  });
}