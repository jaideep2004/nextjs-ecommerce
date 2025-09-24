import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

// Get a single product by slug
export async function GET(req, { params }) {
  return handleApiRequest(req, async () => {
    await connectToDatabase();
    
    const { slug } = params;
    
    // Only select essential fields to reduce payload size
    const product = await Product.findOne({ slug })
      .select('name slug category subcategory image images price brand rating numReviews countInStock description isFeatured discount colors sizes fabric occasion style createdAt')
      .populate('category', 'name slug');
    
    if (!product) {
      return Response.json(
        apiError(404, 'Product not found'),
        { status: 404 }
      );
    }
    
    return Response.json(
      apiResponse(200, product),
      { status: 200 }
    );
  });
}