import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';
import { isAuthenticated, isAdmin } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

// GET /api/admin/categories - Get all categories (admin only)
export async function GET(request) {
  return handleApiRequest(request, async () => {
    // Check if user is authenticated and is an admin
    const decoded = await isAuthenticated(request);
    await isAdmin(decoded);
    
    await connectToDatabase();
    
    // Get all categories with product counts
    const categories = await Category.find({})
      .sort({ name: 1 })
      .lean();
      
    // Return proper response format with simplified structure
    return Response.json(
      apiResponse(200, { categories }, 'Categories retrieved successfully'),
      { status: 200 }
    );
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
    
    return Response.json(
      apiResponse(201, category, 'Category created successfully'),
      { status: 201 }
    );
  });
}