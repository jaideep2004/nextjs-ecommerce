import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import Review from '@/models/Review';
import Order from '@/models/Order';
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

// Get all reviews for a product
export async function GET(req, { params }) {
  return handleApiRequest(req, async () => {
    await connectToDatabase();
    
    const { id } = params;
    
    const reviews = await Review.find({ product: id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    
    return Response.json(
      apiResponse(200, reviews),
      { status: 200 }
    );
  });
}

// Create a new review for a product
export async function POST(req, { params }) {
  return handleApiRequest(req, async () => {
    const user = await getUserFromRequest(req);
    await connectToDatabase();
    
    const { id } = params;
    const { rating, comment, title } = await req.json();
    
    // Validate input
    if (!rating || !comment) {
      return Response.json(
        apiError(400, 'Please provide rating and comment'),
        { status: 400 }
      );
    }
    
    // Find product
    const product = await Product.findById(id);
    
    if (!product) {
      return Response.json(
        apiError(404, 'Product not found'),
        { status: 404 }
      );
    }
    
    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      user: user._id,
      product: id,
    });
    
    if (existingReview) {
      return Response.json(
        apiError(400, 'You have already reviewed this product'),
        { status: 400 }
      );
    }
    
    // Check if user has purchased this product
    const hasPurchased = await Order.findOne({
      user: user._id,
      'orderItems.product': id,
      isPaid: true,
    });
    
    // Create new review
    const review = new Review({
      user: user._id,
      product: id,
      rating,
      comment,
      title,
      isVerifiedPurchase: !!hasPurchased,
    });
    
    await review.save();
    
    // Update product rating
    const allReviews = await Review.find({ product: id });
    product.numReviews = allReviews.length;
    product.rating = allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;
    
    await product.save();
    
    return Response.json(
      apiResponse(201, review, 'Review added successfully'),
      { status: 201 }
    );
  });
}