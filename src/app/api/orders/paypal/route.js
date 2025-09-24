import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { isAuthenticated } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

export async function POST(req) {
  return handleApiRequest(req, async () => {
    // Verify user is authenticated
    const user = await isAuthenticated(req);
    await connectToDatabase();

    const orderData = await req.json();

    // Create order with PayPal payment data
    const order = new Order({
      ...orderData,
      user: user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedOrder = await order.save();

    return Response.json(
      apiResponse(savedOrder, 'Order created successfully'),
      { status: 201 }
    );
  });
}