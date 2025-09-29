import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';
import cache from '@/utils/cache';

// GET /api/categories - Get all categories
export async function GET(request) {
  return handleApiRequest(request, async () => {
    try {
      await connectToDatabase();
    } catch (error) {
      console.error('Error connecting to database:', error);
      return Response.json(
        apiError(500, 'Failed to connect to database'),
        { status: 500 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const skip = (page - 1) * limit;
    
    // Create cache key based on parameters
    const cacheKey = `categories_page_${page}_limit_${limit}`;
    
    // Try to get from cache first
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached categories data');
      return Response.json(
        apiResponse(200, cachedResult),
        { status: 200 }
      );
    }
    
    try {
      // Use aggregation pipeline with optimizations for better performance
      const categoriesWithCounts = await Category.aggregate([
        { $sort: { name: 1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'category',
            as: 'products'
          }
        },
        {
          $addFields: {
            productCount: { $size: '$products' }
          }
        },
        {
          $project: {
            products: 0 // Remove products array from result
          }
        }
      ]).allowDiskUse(true); // Allow disk usage for large datasets
      
      // Get total count for pagination (with caching)
      let totalCount;
      const countCacheKey = 'categories_total_count';
      const cachedCount = cache.get(countCacheKey);
      
      if (cachedCount) {
        totalCount = cachedCount;
      } else {
        totalCount = await Category.countDocuments();
        // Cache total count for 10 minutes as it changes less frequently
        cache.set(countCacheKey, totalCount, 600000);
      }
      
      // Ensure we always return an array, even if empty
      const categories = Array.isArray(categoriesWithCounts) ? categoriesWithCounts : [];
      
      // Prepare response data
      const responseData = {
        categories: categories,
        totalCount,
        page,
        pages: Math.ceil(totalCount / limit),
      };
      
      // Cache the result for 5 minutes
      cache.set(cacheKey, responseData, 300000);
      
      return Response.json(
        apiResponse(200, responseData),
        { status: 200 }
      );
    } catch (error) {
      console.error('Error fetching categories:', error);
      return Response.json(
        apiError(500, 'Failed to fetch categories'),
        { status: 500 }
      );
    }
  });
}