import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { isAuthenticated, isAdmin } from '@/utils/auth';

export async function GET(request) {
  try {
    // Check if user is authenticated and is an admin
    await isAdmin(request);
    
    // If we get here, the user is authenticated and is an admin
    
    await connectToDatabase();
    
    // Get dashboard data
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    
    // Calculate total sales from paid orders
    const paidOrders = await Order.find({ 
      isPaid: true
    });
    
    const totalSales = paidOrders.reduce((sum, order) => {
      return sum + (order.totalPrice || 0);
    }, 0);
    
    // Get recent orders
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .lean();
    
    // Get low stock products
    const lowStockProducts = await Product.find({ countInStock: { $lte: 5 } })
      .sort({ countInStock: 1 })
      .limit(5)
      .lean();
    
    return NextResponse.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalSales,
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}