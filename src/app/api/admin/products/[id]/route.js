import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import { isAuthenticated, isAdmin } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

// Get a single product by ID (admin version with additional data)
export async function GET(req, { params }) {
  return handleApiRequest(req, async () => {
    // Verify admin access
    const decoded = await isAdmin(req);
    await connectToDatabase();
    
    const { id } = params;
    
    // Optimize field selection for admin product view with proper projection
    const product = await Product.findById(id, {
      name: 1,
      slug: 1,
      category: 1,
      subcategory: 1,
      image: 1,
      images: 1,
      price: 1,
      brand: 1,
      rating: 1,
      numReviews: 1,
      countInStock: 1,
      description: 1,
      isFeatured: 1,
      discount: 1,
      colors: 1,
      sizes: 1,
      fabric: 1,
      occasion: 1,
      style: 1,
      createdAt: 1,
      updatedAt: 1
    })
      .populate('category', 'name slug')
      .lean();
    
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

// Update a product
export async function PUT(req, { params }) {
  return handleApiRequest(req, async () => {
    // Verify admin access
    const decoded = await isAdmin(req);
    
    await connectToDatabase();
    
    const { id } = params;
    const updateData = await req.json();
    
    // Find the product
    const product = await Product.findById(id);
    
    if (!product) {
      return Response.json(
        apiError(404, 'Product not found'),
        { status: 404 }
      );
    }
    
    // Check if slug is being changed and if it's unique
    if (updateData.slug && updateData.slug !== product.slug) {
      const existingProduct = await Product.findOne({ slug: updateData.slug });
      if (existingProduct && existingProduct._id.toString() !== id) {
        return Response.json(
          apiError(400, 'A product with this slug already exists'),
          { status: 400 }
        );
      }
    }
    
    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    // Return updated product with optimized field selection
    const populatedProduct = await Product.findById(id)
      .populate('category', 'name slug')
      .select({
        name: 1,
        slug: 1,
        category: 1,
        subcategory: 1,
        image: 1,
        images: 1,
        price: 1,
        brand: 1,
        rating: 1,
        numReviews: 1,
        countInStock: 1,
        description: 1,
        isFeatured: 1,
        discount: 1,
        colors: 1,
        sizes: 1,
        fabric: 1,
        occasion: 1,
        style: 1,
        createdAt: 1,
        updatedAt: 1
      })
      .lean();
    
    return Response.json(
      apiResponse(200, populatedProduct, 'Product updated successfully'),
      { status: 200 }
    );
  });
}

// Delete a product
export async function DELETE(req, { params }) {
  return handleApiRequest(req, async () => {
    // Verify admin access
    const decoded = await isAdmin(req);
    
    await connectToDatabase();
    
    const { id } = params;
    
    // Find the product
    const product = await Product.findById(id);
    
    if (!product) {
      return Response.json(
        apiError(404, 'Product not found'),
        { status: 404 }
      );
    }
    
    // Delete the product
    await Product.findByIdAndDelete(id);
    
    return Response.json(
      apiResponse(200, null, 'Product deleted successfully'),
      { status: 200 }
    );
  });
}