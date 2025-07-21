import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import { apiResponse, handleApiRequest, validateMethod } from '@/utils/api';

// Get all products with filtering, sorting, and pagination
export async function GET(req) {
  return handleApiRequest(req, async () => {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    
    // Filtering
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Sorting
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    
    // Build filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (brand) filter.brand = brand;
    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
    if (featured === 'true') filter.isFeatured = true;
    
    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Execute query with pagination and sorting
    const products = await Product.find(filter)
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    
    return Response.json(
      apiResponse(200, {
        products,
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

// Create a new product (admin only)
export async function POST(req) {
  return handleApiRequest(req, async () => {
    // This would normally check if user is admin
    // const decoded = await isAdmin(req);
    
    await connectToDatabase();
    
    const productData = await req.json();
    
    // Validate required fields
    const requiredFields = ['name', 'slug', 'category', 'image', 'price', 'countInStock', 'description'];
    
    for (const field of requiredFields) {
      if (!productData[field]) {
        return Response.json(
          apiError(400, `Please provide ${field}`),
          { status: 400 }
        );
      }
    }
    
    // Create new product
    const product = new Product(productData);
    await product.save();
    
    return Response.json(
      apiResponse(201, product, 'Product created successfully'),
      { status: 201 }
    );
  });
}