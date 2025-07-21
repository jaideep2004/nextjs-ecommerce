import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import { isAdmin } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

// Get a single product by ID
export async function GET(req, { params }) {
  return handleApiRequest(req, async () => {
    await connectToDatabase();
    
    const { id } = params;
    
    const product = await Product.findById(id);
    
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

// Update a product (admin only)
export async function PUT(req, { params }) {
  return handleApiRequest(req, async () => {
    // This would normally check if user is admin
    // const decoded = await isAdmin(req);
    
    await connectToDatabase();
    
    const { id } = params;
    const updateData = await req.json();
    
    const product = await Product.findById(id);
    
    if (!product) {
      return Response.json(
        apiError(404, 'Product not found'),
        { status: 404 }
      );
    }
    
    // Update product
    Object.keys(updateData).forEach((key) => {
      product[key] = updateData[key];
    });
    
    await product.save();
    
    return Response.json(
      apiResponse(200, product, 'Product updated successfully'),
      { status: 200 }
    );
  });
}

// Delete a product (admin only)
export async function DELETE(req, { params }) {
  return handleApiRequest(req, async () => {
    // This would normally check if user is admin
    // const decoded = await isAdmin(req);
    
    await connectToDatabase();
    
    const { id } = params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return Response.json(
        apiError(404, 'Product not found'),
        { status: 404 }
      );
    }
    
    await Product.deleteOne({ _id: id });
    
    return Response.json(
      apiResponse(200, null, 'Product deleted successfully'),
      { status: 200 }
    );
  });
}