import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import { isAuthenticated, isAdmin } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

// Get all products with admin-specific data
export async function GET(req) {
  return handleApiRequest(req, async () => {
    // Verify admin access
    const decoded = await isAdmin(req);
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    
    // Filtering
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const stockFilter = searchParams.get('stock');
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Sorting
    const sortBy = searchParams.get('sortBy') || 'newest';
    
    // Build query
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (stockFilter === 'low') {
      query.countInStock = { $lte: 5 };
    } else if (stockFilter === 'out') {
      query.countInStock = 0;
    } else if (stockFilter === 'in') {
      query.countInStock = { $gt: 0 };
    }
    
    // Determine sort order
    let sortOptions = {};
    switch (sortBy) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'priceHigh':
        sortOptions = { price: -1 };
        break;
      case 'priceLow':
        sortOptions = { price: 1 };
        break;
      case 'nameAZ':
        sortOptions = { name: 1 };
        break;
      case 'nameZA':
        sortOptions = { name: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }
    
    // Optimized field projection for admin products list
    const projection = {
      name: 1,
      slug: 1,
      image: 1,
      price: 1,
      category: 1,
      brand: 1,
      countInStock: 1,
      isFeatured: 1,
      discount: 1,
      rating: 1,
      numReviews: 1,
      createdAt: 1
    };
    
    // Execute query with optimized projection and options
    const options = {
      lean: true,
      populate: { path: 'category', select: 'name slug' }
    };
    
    const products = await Product.find(query, projection, options)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    const totalCount = await Product.countDocuments(query);
    
    return Response.json(
      apiResponse(200, {
        products,
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      })
    );
  });
}

// Create a new product
export async function POST(req) {
  return handleApiRequest(req, async () => {
    // Verify admin access
    const decoded = await isAdmin(req);
    await connectToDatabase();
    
    const productData = await req.json();
    
    // Validate required fields    
    const requiredFields = ['name', 'slug', 'description', 'price', 'category', 'countInStock'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return Response.json(
          apiError(400, `Missing required field: ${field}`),
          { status: 400 }
        );
      }
    }
    
    // Check if slug is unique
    const existingProduct = await Product.findOne({ slug: productData.slug });
    if (existingProduct) {
      return Response.json(
        apiError(400, 'A product with this slug already exists'),
        { status: 400 }
      );
    }
    
    // Create the product
    const product = new Product(productData);
    await product.save();
    
    return Response.json(
      apiResponse(201, product, 'Product created successfully'),
      { status: 201 }
    );
  });
}