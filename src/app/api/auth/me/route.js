import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { isAuthenticated } from '@/utils/auth';
import { apiResponse, handleApiRequest } from '@/utils/api';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/route';

export async function GET(req) {
  return handleApiRequest(req, async () => {
    let user = null;
    
    console.log('=== /api/auth/me called ===');
    
    // First try NextAuth session
    try {
      console.log('Checking NextAuth session...');
      const session = await getServerSession(authOptions);
      console.log('NextAuth session result:', session ? 'Found session for ' + session.user?.email : 'No session');
      
      if (session?.user?.email) {
        await connectToDatabase();
        user = await User.findOne({ email: session.user.email }).select('-password');
        if (user) {
          console.log('Found user via NextAuth:', user.email);
          return Response.json(
            apiResponse(200, user, 'User retrieved successfully'),
            { status: 200 }
          );
        }
      }
    } catch (nextAuthError) {
      console.log('NextAuth session check failed:', nextAuthError.message);
    }
    
    // Fallback to custom JWT authentication
    try {
      console.log('Trying custom JWT authentication...');
      const decoded = await isAuthenticated(req);
      console.log('JWT decoded successfully for user:', decoded._id);
      
      await connectToDatabase();
      
      // Get user from database
      user = await User.findById(decoded._id).select('-password');
      
      if (!user) {
        throw new Error('User not found');
      }
      
      console.log('Found user via JWT:', user.email);
      return Response.json(
        apiResponse(200, user, 'User retrieved successfully'),
        { status: 200 }
      );
    } catch (jwtError) {
      console.log('JWT authentication failed:', jwtError.message);
    }
    
    // If both authentication methods fail
    console.log('Both authentication methods failed');
    throw new Error('Not authenticated');
  });
}