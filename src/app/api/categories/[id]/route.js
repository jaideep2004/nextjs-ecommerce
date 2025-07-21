import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';

// GET /api/categories/[id] - Get a single category by ID
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    
    // Try to find by ID first
    let category = await Category.findById(id).lean();
    
    // If not found by ID, try to find by slug
    if (!category) {
      category = await Category.findOne({ slug: id }).lean();
    }
    
    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Get product count for this category
    const productCount = await Product.countDocuments({ category: category._id });
    category.productCount = productCount;
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { message: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}