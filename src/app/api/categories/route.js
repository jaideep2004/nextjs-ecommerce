import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

// GET /api/categories - Get all categories
export async function GET(request) {
  return handleApiRequest(request, async () => {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const totalCount = await Category.countDocuments();
    
    // Fetch categories with pagination
    const categories = await Category.find({})
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({ category: category._id });
        return {
          ...category,
          productCount,
        };
      })
    );
    
    return Response.json(
      apiResponse(200, {
        categories: categoriesWithCounts,
        totalCount,
        page,
        pages: Math.ceil(totalCount / limit),
      }),
      { status: 200 }
    );
  });
}