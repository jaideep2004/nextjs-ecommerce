import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, generateToken } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';

export async function POST(req) {
  return handleApiRequest(req, async () => {
    await connectToDatabase();
    
    const { email, password } = await req.json();
    
    // Validate input
    if (!email || !password) {
      return Response.json(
        apiError(400, 'Please provide email and password'),
        { status: 400 }
      );
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return Response.json(
        apiError(401, 'Invalid email or password'),
        { status: 401 }
      );
    }
    
    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      return Response.json(
        apiError(401, 'Invalid email or password'),
        { status: 401 }
      );
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    
    // Remove password from response
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      phone: user.phone,
      address: user.address,
    };
    
    return Response.json(
      apiResponse(200, { user: userWithoutPassword, token }, 'Login successful'),
      { status: 200 }
    );
  });
}