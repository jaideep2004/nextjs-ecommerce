import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { isAuthenticated, isAdmin } from '@/utils/auth';

// GET /api/admin/categories/[id] - Get a single category by ID (admin only)
export async function GET(request, { params }) {
  try {
    // Check if user is authenticated and is an admin
    const decoded = await isAuthenticated(request);
    await isAdmin(decoded);
    
    await connectToDatabase();
    
    const { id } = params;
    
    const category = await Category.findById(id).lean();
    
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

// PUT /api/admin/categories/[id] - Update a category (admin only)
export async function PUT(request, { params }) {
  try {
    // Check if user is authenticated and is an admin
    const decoded = await isAuthenticated(request);
    await isAdmin(decoded);
    
    await connectToDatabase();
    
    const { id } = params;
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.slug) {
      return NextResponse.json(
        { message: 'Name and slug are required' },
        { status: 400 }
      );
    }
    
    // Check if slug already exists (excluding this category)
    const existingCategory = await Category.findOne({
      slug: data.slug,
      _id: { $ne: id },
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { message: 'A category with this slug already exists' },
        { status: 400 }
      );
    }
    
    // Find and update the category
    const category = await Category.findByIdAndUpdate(
      id,
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
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { message: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/categories/[id] - Delete a category (admin only)
export async function DELETE(request, { params }) {
  try {
    // Check if user is authenticated and is an admin
    const decoded = await isAuthenticated(request);
    await isAdmin(decoded);
    
    await connectToDatabase();
    
    const { id } = params;
    
    // Check if category has products
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return NextResponse.json(
        { 
          message: 'Cannot delete category with associated products. Please reassign or delete the products first.',
          productCount 
        },
        { status: 400 }
      );
    }
    
    // Delete the category
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { message: 'Failed to delete category' },
      { status: 500 }
    );
  }
}