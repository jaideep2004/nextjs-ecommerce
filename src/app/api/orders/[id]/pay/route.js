import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { isAuthenticated } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

// Process payment for an order
export async function POST(req, { params }) {
  return handleApiRequest(req, async () => {
    const decoded = await isAuthenticated(req);
    await connectToDatabase();
    
    const { id } = params;
    const { paymentResult } = await req.json();
    
    const order = await Order.findById(id);
    
    if (!order) {
      return Response.json(
        apiError(404, 'Order not found'),
        { status: 404 }
      );
    }
    
    // Check if the user is authorized to pay for this order
    if (order.user.toString() !== decoded._id && !decoded.isAdmin) {
      return Response.json(
        apiError(403, 'Not authorized to pay for this order'),
        { status: 403 }
      );
    }
    
    // Update order with payment information
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: paymentResult.id,
      status: paymentResult.status,
      email_address: paymentResult.email_address,
    };
    
    // Update order status to Processing after payment
    order.orderStatus = 'Processing';
    
    const updatedOrder = await order.save();
    
    return Response.json(
      apiResponse(200, updatedOrder, 'Payment processed successfully'),
      { status: 200 }
    );
  });
}