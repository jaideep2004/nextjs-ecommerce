import connectToDatabase from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
import { isAuthenticated } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

// Remove item from wishlist
export async function DELETE(req, { params }) {
  return handleApiRequest(req, async () => {
    const decoded = await isAuthenticated(req);
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
      user: decoded._id,
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