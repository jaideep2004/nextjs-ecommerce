import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { isAuthenticated, hashPassword } from '@/utils/auth';
import { apiResponse, handleApiRequest } from '@/utils/api';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

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

export async function PUT(req) {
  return handleApiRequest(req, async () => {
    // Verify authentication
    const user = await getUserFromRequest(req);
    
    await connectToDatabase();
    
    const { name, email, password, phone, address } = await req.json();
    
    // Get user from database
    const dbUser = await User.findById(user._id);
    
    if (!dbUser) {
      throw new Error('User not found');
    }
    
    // Update user fields
    if (name) dbUser.name = name;
    if (email) dbUser.email = email;
    if (password) dbUser.password = await hashPassword(password);
    if (phone) dbUser.phone = phone;
    if (address) dbUser.address = address;
    
    await dbUser.save();
    
    // Remove password from response
    const userWithoutPassword = {
      _id: dbUser._id,
      name: dbUser.name,
      email: dbUser.email,
      isAdmin: dbUser.isAdmin,
      phone: dbUser.phone,
      address: dbUser.address,
    };
    
    return Response.json(
      apiResponse(200, { user: userWithoutPassword }, 'Profile updated successfully'),
      { status: 200 }
    );
  });
}