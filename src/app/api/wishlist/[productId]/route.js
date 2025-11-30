import connectToDatabase from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
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

// Remove item from wishlist
export async function DELETE(req, { params }) {
  return handleApiRequest(req, async () => {
    const user = await getUserFromRequest(req);
    await connectToDatabase();
    
    const { productId } = params;
    
    if (!productId) {
      return Response.json(
        apiError(400, 'Product ID is required'),
        { status: 400 }
      );
    }
    
    // Find and remove the wishlist item
    const result = await Wishlist.findOneAndDelete({
      user: user._id,
      product: productId
    });
    
    if (!result) {
      return Response.json(
        apiError(404, 'Item not found in wishlist'),
        { status: 404 }
      );
    }
    
    return Response.json(
      apiResponse(200, { success: true }, 'Product removed from wishlist'),
      { status: 200 }
    );
  });
}