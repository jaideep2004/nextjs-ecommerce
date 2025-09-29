import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import { isAdmin } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

// Get a single product by ID
export async function GET(req, { params }) {
  return handleApiRequest(req, async () => {
    await connectToDatabase();
    
    const { id } = await params;
    
    // Optimize field selection for single product with proper projection
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

// Update a product (admin only)
export async function PUT(req, { params }) {
  return handleApiRequest(req, async () => {
    // This would normally check if user is admin
    // const decoded = await isAdmin(req);
    
    await connectToDatabase();
    
    const { id } = await params;
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
    
    // Return updated product with optimized field selection
    const updatedProduct = await Product.findById(id)
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
      apiResponse(200, updatedProduct, 'Product updated successfully'),
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
    
    const { id } = await params;
    
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