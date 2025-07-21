import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { isAuthenticated, isAdmin } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

// Get all customers (admin only)
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
    
    // Only get non-admin users (customers)
    filter.isAdmin = false;
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Get customers
    const customers = await User.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-password');
    
    // Get total count for pagination
    const totalCustomers = await User.countDocuments(filter);
    
    return Response.json(
      {
        customers,
        totalCustomers,
      },
      { status: 200 }
    );
  });
}