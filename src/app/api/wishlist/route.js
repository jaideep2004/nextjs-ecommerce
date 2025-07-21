import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import Wishlist from '@/models/Wishlist';
import { isAuthenticated } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

// Get user's wishlist
export async function GET(req) {
  return handleApiRequest(req, async () => {
    const decoded = await isAuthenticated(req);
    await connectToDatabase();
    
    // Find all wishlist items for this user and populate product details
    const wishlistItems = await Wishlist.find({ user: decoded._id })
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
    const decoded = await isAuthenticated(req);
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
      user: decoded._id,
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
      user: decoded._id,
      product: productId
    });
    
    await wishlistItem.save();
    
    return Response.json(
      apiResponse(201, { success: true }, 'Product added to wishlist'),
      { status: 201 }
    );
  });
}