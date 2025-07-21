import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { isAuthenticated, isAdmin } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

// Get all orders (admin) or user orders (customer)
export async function GET(req) {
  return handleApiRequest(req, async () => {
    const decoded = await isAuthenticated(req);
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Sorting
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    
    // Filter by status
    const status = searchParams.get('status');
    const filter = {};
    
    if (status) filter.orderStatus = status;
    
    // If not admin, only show user's orders
    if (!decoded.isAdmin) {
      filter.user = decoded._id;
    }
    
    // Execute query with pagination and sorting
    const orders = await Order.find(filter)
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email');
    
    // Get total count for pagination
    const total = await Order.countDocuments(filter);
    
    return Response.json(
      apiResponse(200, {
        orders,
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

// Create a new order
export async function POST(req) {
  return handleApiRequest(req, async () => {
    const decoded = await isAuthenticated(req);
    await connectToDatabase();
    
    const orderData = await req.json();
    
    // Validate required fields
    const requiredFields = [
      'orderItems', 'shippingAddress', 'paymentMethod',
      'itemsPrice', 'taxPrice', 'totalPrice'
    ];
    
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return Response.json(
          apiError(400, `Please provide ${field}`),
          { status: 400 }
        );
      }
    }
    
    // Ensure shippingPrice is a number (handle PayPal case)
    if (typeof orderData.shippingPrice !== 'number') {
      orderData.shippingPrice = parseFloat(orderData.shippingPrice) || 0;
    }
    
    // Make postalCode optional in shippingAddress
    if (orderData.shippingAddress && !orderData.shippingAddress.postalCode) {
      orderData.shippingAddress.postalCode = ''; // Set empty string as default
    }
    
    // Create new order
    const order = new Order({
      ...orderData,
      user: decoded._id,
    });
    
    await order.save();
    
    return Response.json(
      apiResponse(201, order, 'Order created successfully'),
      { status: 201 }
    );
  });
}