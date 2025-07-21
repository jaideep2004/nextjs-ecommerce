import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { isAuthenticated } from '@/utils/auth';
import { apiResponse, handleApiRequest } from '@/utils/api';

export async function GET(req) {
  return handleApiRequest(req, async () => {
    // Verify authentication
    const decoded = await isAuthenticated(req);
    
    await connectToDatabase();
    
    // Get user from database
    const user = await User.findById(decoded._id).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return Response.json(
      apiResponse(200, user, 'User retrieved successfully'),
      { status: 200 }
    );
  });
}