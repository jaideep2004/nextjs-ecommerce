import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import mongoose from 'mongoose';
import { apiResponse, handleApiRequest, validateMethod } from '@/utils/api';

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function brandPatternExactInsensitive(val) {
  // Match value with optional leading/trailing whitespace in stored data
  return new RegExp(`^\\s*${escapeRegExp(val)}\\s*$`, 'i');
}

// Get all products with filtering, sorting, and pagination
export async function GET(req) {
  return handleApiRequest(req, async () => {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    
    // Filtering
    const categoryParam = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const featured = searchParams.get('featured');
    const onSale = searchParams.get('onSale');
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
    
    // Category filter: accept ObjectId, slug, or name (and match both ObjectId and legacy string values)
    if (categoryParam) {
      let categoryId = null;
      if (mongoose.Types.ObjectId.isValid(categoryParam)) {
        categoryId = new mongoose.Types.ObjectId(categoryParam);
      } else {
        // Try find by slug or name (case-insensitive)
        const catDoc = await Category.findOne({
          $or: [
            { slug: categoryParam },
            { name: { $regex: `^${categoryParam}$`, $options: 'i' } },
          ],
        }).select('_id');
        if (catDoc) categoryId = catDoc._id;
      }
      if (categoryId) {
        // Match documents where category is stored as ObjectId or as legacy string
        const idStr = categoryId.toString();
        filter.$expr = { $in: ['$category', [categoryId, idStr]] };
      } else if (mongoose.Types.ObjectId.isValid(categoryParam)) {
        // No category doc found but param looks like an ObjectId; still match both types
        const oid = new mongoose.Types.ObjectId(categoryParam);
        filter.$expr = { $in: ['$category', [oid, categoryParam]] };
      } else {
        // If no match, set to impossible id to return empty result instead of throwing cast error
        filter.category = new mongoose.Types.ObjectId();
      }
    }
    if (subcategory) filter.subcategory = subcategory;
    // Robust brand filtering: supports repeated brand params and comma-separated lists
    const brandParams = [
      ...searchParams.getAll('brand'),
      ...(brand ? [brand] : []),
    ];
    if (brandParams.length > 0) {
      const brandValues = brandParams
        .flatMap((b) => String(b).split(','))
        .map((b) => b.trim())
        .filter(Boolean);
      if (brandValues.length === 1) {
        filter.brand = brandPatternExactInsensitive(brandValues[0]);
      } else if (brandValues.length > 1) {
        const patterns = brandValues.map((b) => brandPatternExactInsensitive(b));
        filter.brand = { $in: patterns };
      }
    }
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
    // Optimized field projection to reduce payload size
    const projection = {
      name: 1,
      slug: 1,
      image: 1,
      price: 1,
      rating: 1,
      numReviews: 1,
      discount: 1,
      isFeatured: 1,
      category: 1,
      brand: 1,
      countInStock: 1,
      createdAt: 1
    };
    
    // Add hint for index usage
    const options = {
      lean: true,
      populate: { path: 'category', select: 'name slug' }
    };
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('[GET /api/products] filter:', JSON.stringify(filter));
    }

    // Use lean() for better performance and populate category with only necessary fields
    const products = await Product.find(filter, projection, options)
      .sort({ [sortField]: sortDir })
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