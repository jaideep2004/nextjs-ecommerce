import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { isAuthenticated, isAdmin } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';
import cache from '@/utils/cache';

// GET /api/admin/categories - Get all categories (admin only)
export async function GET(request) {
  return handleApiRequest(request, async () => {
    try {
      // Check if user is authenticated and is an admin
      const decoded = await isAuthenticated(request);
      await isAdmin(decoded);
      
      await connectToDatabase();
      
      // Try to get from cache first
      const cacheKey = 'admin_categories_all';
      const cachedResult = cache.get(cacheKey);
      if (cachedResult) {
        console.log('Returning cached admin categories data');
        return Response.json(
          apiResponse(200, { categories: cachedResult }, 'Categories retrieved successfully'),
          { status: 200 }
        );
      }
      
      // Use aggregation pipeline with optimizations for better performance
      const categoriesWithCounts = await Category.aggregate([
        { $sort: { name: 1 } },
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
        
      // Cache the result for 3 minutes (shorter cache for admin as data changes more frequently)
      cache.set(cacheKey, categoriesWithCounts, 180000);
        
      // Return proper response format with simplified structure
      return Response.json(
        apiResponse(200, { categories: categoriesWithCounts }, 'Categories retrieved successfully'),
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

// POST /api/admin/categories - Create a new category (admin only)
export async function POST(request) {
  return handleApiRequest(request, async () => {
    // Check if user is authenticated and is an admin
    const decoded = await isAuthenticated(request);
    await isAdmin(decoded);
    
    await connectToDatabase();
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.slug) {
      return Response.json(
        apiError(400, 'Name and slug are required'),
        { status: 400 }
      );
    }
    
    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug: data.slug });
    if (existingCategory) {
      return Response.json(
        apiError(400, 'A category with this slug already exists'),
        { status: 400 }
      );
    }
    
    // Create new category
    const category = await Category.create({
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      image: data.image || '',
      featured: data.featured || false,
      parent: data.parent || null,
    });
    
    // Clear cache when a new category is created
    cache.clear();
    
    return Response.json(
      apiResponse(201, category, 'Category created successfully'),
      { status: 201 }
    );
  });
}

// PUT /api/admin/categories/:id - Update a category (admin only)
export async function PUT(request, { params }) {
  return handleApiRequest(request, async () => {
    // Check if user is authenticated and is an admin
    const decoded = await isAuthenticated(request);
    await isAdmin(decoded);
    
    await connectToDatabase();
    
    const categoryId = params.id;
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.slug) {
      return Response.json(
        apiError(400, 'Name and slug are required'),
        { status: 400 }
      );
    }
    
    try {
      // Update category
      const category = await Category.findByIdAndUpdate(
        categoryId,
        {
          name: data.name,
          slug: data.slug,
          description: data.description || '',
          image: data.image || '',
          featured: data.featured || false,
          parent: data.parent || null,
        },
        { new: true, runValidators: true }
      );
      
      if (!category) {
        return Response.json(
          apiError(404, 'Category not found'),
          { status: 404 }
        );
      }
      
      // Clear cache when a category is updated
      cache.clear();
      
      return Response.json(
        apiResponse(200, category, 'Category updated successfully'),
        { status: 200 }
      );
    } catch (error) {
      console.error('Error updating category:', error);
      return Response.json(
        apiError(500, 'Failed to update category'),
        { status: 500 }
      );
    }
  });
}

// DELETE /api/admin/categories/:id - Delete a category (admin only)
export async function DELETE(request, { params }) {
  return handleApiRequest(request, async () => {
    // Check if user is authenticated and is an admin
    const decoded = await isAuthenticated(request);
    await isAdmin(decoded);
    
    await connectToDatabase();
    
    const categoryId = params.id;
    
    try {
      // Delete category
      const category = await Category.findByIdAndDelete(categoryId);
      
      if (!category) {
        return Response.json(
          apiError(404, 'Category not found'),
          { status: 404 }
        );
      }
      
      // Clear cache when a category is deleted
      cache.clear();
      
      return Response.json(
        apiResponse(200, null, 'Category deleted successfully'),
        { status: 200 }
      );
    } catch (error) {
      console.error('Error deleting category:', error);
      return Response.json(
        apiError(500, 'Failed to delete category'),
        { status: 500 }
      );
    }
  });
}