import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { isAuthenticated, isAdmin } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

// Get all orders (admin only)
export async function GET(req) {
  return handleApiRequest(req, async () => {
    try {
      // Verify admin access
      const decoded = await isAdmin(req);
      console.log('Admin authentication successful:', decoded);
      
      // Connect to database
      console.log('Connecting to MongoDB...');
      const db = await connectToDatabase();
      console.log('MongoDB connection successful');
      
      const { searchParams } = new URL(req.url);
      
      // Pagination
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;
      
      console.log(`Pagination: page=${page}, limit=${limit}, skip=${skip}`);
      
      // Sorting
      const sortBy = searchParams.get('sortBy') || 'createdAt';
      const sortOrder = searchParams.get('sortOrder') || 'desc';
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
      
      console.log(`Sorting: sortBy=${sortBy}, sortOrder=${sortOrder}`);
      
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
      
      if (status && status !== 'all') {
        filter.orderStatus = status;
      }
      
      console.log('Query filter:', JSON.stringify(filter));
      
      // Manually test database access
      try {
        const testOrder = await Order.findOne();
        console.log('Test database query result:', testOrder ? 'Successfully found an order' : 'No orders found');
        if (testOrder) {
          console.log('Sample order fields:', Object.keys(testOrder.toObject()));
        }
      } catch (err) {
        console.error('Test database query failed:', err);
      }
      
      // Get orders with populated user data
      console.log('Executing main orders query...');
      let orders = [];
      try {
        orders = await Order.find(filter)
          .populate('user', 'name email')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean();
          
        console.log(`Retrieved ${orders.length} orders from database`);
        
        // If no orders found but we know there are orders in the database
        if (orders.length === 0) {
          console.log('No orders found with filter, trying simpler query');
          // Try a simpler query to see if there are any orders at all
          orders = await Order.find({}).limit(limit).populate('user', 'name email').lean();
          console.log(`Simpler query returned ${orders.length} orders`);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
      
      console.log('Raw orders from DB:', orders);
      
      // Get total count for pagination
      let totalOrders = 0;
      try {
        totalOrders = await Order.countDocuments(filter);
        console.log('Total orders count:', totalOrders);
      } catch (err) {
        console.error('Error counting orders:', err);
      }
      
      // Return with consistent format
      const responseData = {
        orders: orders || [],
        totalOrders: totalOrders || 0
      };
      
      console.log('Final API response data:', responseData);
      
      return Response.json(
        apiResponse(200, responseData, 'Orders retrieved successfully'),
        { status: 200 }
      );
    } catch (error) {
      console.error('Unexpected error in orders API:', error);
      throw error;
    }
  });
}