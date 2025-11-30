import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import Wishlist from '@/models/Wishlist';
import { isAuthenticated } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

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

// Get user's wishlist
export async function GET(req) {
  return handleApiRequest(req, async () => {
    const user = await getUserFromRequest(req);
    await connectToDatabase();
    
    // Find all wishlist items for this user and populate product details
    const wishlistItems = await Wishlist.find({ user: user._id })
      .populate({
        path: 'product',
        select: '_id name slug price image countInStock rating numReviews'
      });
    
    // Transform the data to match the expected format in the frontend
    const wishlist = wishlistItems.map(item => {
      const product = item.product;
      return {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.image,
        countInStock: product.countInStock,
        rating: product.rating,
        numReviews: product.numReviews
      };
    });
    
    return Response.json(
      apiResponse(200, { wishlist }, 'Wishlist retrieved successfully'),
      { status: 200 }
    );
  });
}

// Add item to wishlist
export async function POST(req) {
  return handleApiRequest(req, async () => {
    const user = await getUserFromRequest(req);
    await connectToDatabase();
    
    const { productId } = await req.json();
    
    if (!productId) {
      return Response.json(
        apiError(400, 'Product ID is required'),
        { status: 400 }
      );
    }
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return Response.json(
        apiError(404, 'Product not found'),
        { status: 404 }
      );
    }
    
    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({
      user: user._id,
      product: productId
    });
    
    if (existingItem) {
      return Response.json(
        apiResponse(200, { success: true }, 'Product already in wishlist'),
        { status: 200 }
      );
    }
    
    // Add to wishlist
    const wishlistItem = new Wishlist({
      user: user._id,
      product: productId
    });
    
    await wishlistItem.save();
    
    return Response.json(
      apiResponse(201, { success: true }, 'Product added to wishlist'),
      { status: 201 }
    );
  });
}