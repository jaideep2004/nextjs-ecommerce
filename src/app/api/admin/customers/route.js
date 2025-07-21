import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { isAuthenticated, isAdmin } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

// Get all customers (admin only)
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
      
      // Only get non-admin users (customers)
      filter.isAdmin = false;
      
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }
      
      console.log('Query filter:', JSON.stringify(filter));
      
      // Manually test database access
      try {
        const testUser = await User.findOne();
        console.log('Test database query result:', testUser ? 'Successfully found a user' : 'No users found');
      } catch (err) {
        console.error('Test database query failed:', err);
      }
      
      // Get customers
      console.log('Executing main customers query...');
      let customers = [];
      try {
        customers = await User.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .select('-password')
          .lean();
          
        console.log(`Retrieved ${customers.length} customers from database`);
        
        // If no customers found but we know there are users in the database
        if (customers.length === 0) {
          console.log('No customers found with filter, trying simpler query');
          // Try a simpler query to see if there are any users at all
          customers = await User.find({ isAdmin: false }).limit(limit).select('-password').lean();
          console.log(`Simpler query returned ${customers.length} customers`);
        }
      } catch (err) {
        console.error('Error fetching customers:', err);
      }
      
      console.log('Raw customers from DB:', customers);
      
      // Get total count for pagination
      let totalCustomers = 0;
      try {
        totalCustomers = await User.countDocuments(filter);
        console.log('Total customers count:', totalCustomers);
      } catch (err) {
        console.error('Error counting customers:', err);
      }
      
      // Return with consistent format
      const responseData = {
        customers: customers || [],
        totalCustomers: totalCustomers || 0
      };
      
      console.log('Final API response data:', responseData);
      
      return Response.json(
        apiResponse(200, responseData, 'Customers retrieved successfully'),
        { status: 200 }
      );
    } catch (error) {
      console.error('Unexpected error in customers API:', error);
      throw error;
    }
  });
}