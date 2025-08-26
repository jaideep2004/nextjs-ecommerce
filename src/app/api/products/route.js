import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
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
    
    // Pagination (with sane caps)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const skip = (page - 1) * limit;
    
    // Sorting
    let sortParam = searchParams.get('sort') || 'createdAt';
    let order = searchParams.get('order') || 'desc';
    let sortField = 'createdAt';
    let sortDir = order === 'asc' ? 1 : -1;

    // Support formats: "field:asc", "-field", or legacy field+order
    if (sortParam.includes(':')) {
      const [field, dir] = sortParam.split(':');
      sortField = field;
      sortDir = dir?.toLowerCase() === 'asc' ? 1 : -1;
    } else if (sortParam.startsWith('-')) {
      sortField = sortParam.slice(1);
      sortDir = -1;
    } else if (sortParam.startsWith('+')) {
      sortField = sortParam.slice(1);
      sortDir = 1;
    } else {
      sortField = sortParam;
      sortDir = order === 'asc' ? 1 : -1;
    }
    
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
      // Use text index if available, fallback to regex
      filter.$or = [
        { $text: { $search: search } },
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Operator filters like discount[gt]=0 or price[lt]=1000
    for (const [key, value] of searchParams.entries()) {
      const match = key.match(/^(price|discount)\[(gt|gte|lt|lte|eq)\]$/);
      if (match) {
        const [, field, op] = match;
        const mongoOp = `$${op}`;
        filter[field] = { ...(filter[field] || {}), [mongoOp]: parseFloat(value) };
      }
    }
    
    // Execute query with pagination and sorting
    const projection = 'name slug image price rating numReviews discount isFeatured category brand countInStock createdAt';
    const products = await Product.find(filter)
      .select(projection)
      .populate('category', 'name slug')
      .sort({ [sortField]: sortDir })
      .skip(skip)
      .limit(limit)
      .lean();
    
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