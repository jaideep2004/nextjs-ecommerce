import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

export async function POST(req) {
  return handleApiRequest(req, async () => {
    await connectToDatabase();
    
    const { name, email, password, phone } = await req.json();
    
    // Validate input
    if (!name || !email || !password) {
      return Response.json(
        apiError(400, 'Please provide name, email, and password'),
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return Response.json(
        apiError(400, 'User with this email already exists'),
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      isAdmin: false,
    });
    
    await user.save();
    
    // Remove password from response
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      phone: user.phone,
      createdAt: user.createdAt,
    };
    
    return Response.json(
      apiResponse(201, { user: userWithoutPassword }, 'User registered successfully'),
      { status: 201 }
    );
  });
}