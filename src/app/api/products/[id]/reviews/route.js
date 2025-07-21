import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import Review from '@/models/Review';
import Order from '@/models/Order';
import { isAuthenticated } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

// Get all reviews for a product
export async function GET(req, { params }) {
  return handleApiRequest(req, async () => {
    await connectToDatabase();
    
    const { id } = params;
    const { searchParams } = new URL(req.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Sorting
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    
    // Find product
    const product = await Product.findById(id);
    
    if (!product) {
      return Response.json(
        apiError(404, 'Product not found'),
        { status: 404 }
      );
    }
    
    // Get reviews for the product
    const reviews = await Review.find({ product: id })
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name');
    
    // Get total count for pagination
    const total = await Review.countDocuments({ product: id });
    
    return Response.json(
      apiResponse(200, {
        reviews,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      }),
      { status: 200 }
    );
  });
}

// Create a new review for a product
export async function POST(req, { params }) {
  return handleApiRequest(req, async () => {
    const decoded = await isAuthenticated(req);
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
      user: decoded._id,
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
      user: decoded._id,
      'orderItems.product': id,
      isPaid: true,
    });
    
    // Create new review
    const review = new Review({
      user: decoded._id,
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