import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order'; // Add Order model
import { isAuthenticated, isAdmin } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

// Get customer by ID (admin only)
export async function GET(req, { params }) {
  return handleApiRequest(req, async () => {
    try {
      // Verify admin access
      const decoded = await isAdmin(req);
      
      // Connect to database
      await connectToDatabase();
      
      const customerId = params.id;
      
      // Get customer
      const customer = await User.findById(customerId).select('-password').lean();
      
      if (!customer) {
        return apiError(404, 'Customer not found');
      }
      
      // Calculate order count and total spent
      const orders = await Order.find({ user: customerId });
      const orderCount = orders.length;
      const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      
      // Add stats to customer object
      const customerWithStats = {
        ...customer,
        orderCount,
        totalSpent
      };
      
      return Response.json(
        apiResponse(200, customerWithStats, 'Customer retrieved successfully'),
        { status: 200 }
      );
    } catch (error) {
      console.error('Error in customer detail API:', error);
      throw error;
    }
  });
}

// Update customer (admin only)
export async function PUT(req, { params }) {
  return handleApiRequest(req, async () => {
    try {
      // Verify admin access
      const decoded = await isAdmin(req);
      
      // Connect to database
      await connectToDatabase();
      
      const customerId = params.id;
      const data = await req.json();
      
      // Validate data
      if (!data) {
        return apiError(400, 'No data provided');
      }
      
      // Don't allow updating password through this route
      if (data.password) {
        delete data.password;
      }
      
      // Update customer
      const updatedCustomer = await User.findByIdAndUpdate(
        customerId,
        { $set: data },
        { new: true }
      ).select('-password');
      
      if (!updatedCustomer) {
        return apiError(404, 'Customer not found');
      }
      
      return Response.json(
        apiResponse(200, updatedCustomer, 'Customer updated successfully'),
        { status: 200 }
      );
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  });
}

// Delete customer (admin only)
export async function DELETE(req, { params }) {
  return handleApiRequest(req, async () => {
    try {
      // Verify admin access
      const decoded = await isAdmin(req);
      
      // Connect to database
      await connectToDatabase();
      
      const customerId = params.id;
      
      // Delete customer
      const deletedCustomer = await User.findByIdAndDelete(customerId);
      
      if (!deletedCustomer) {
        return apiError(404, 'Customer not found');
      }
      
      return Response.json(
        apiResponse(200, null, 'Customer deleted successfully'),
        { status: 200 }
      );
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  });
}