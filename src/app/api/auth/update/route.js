import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { isAuthenticated, hashPassword } from '@/utils/auth';
import { apiResponse, handleApiRequest } from '@/utils/api';

export async function PUT(req) {
  return handleApiRequest(req, async () => {
    // Verify authentication
    const decoded = await isAuthenticated(req);
    
    await connectToDatabase();
    
    const { name, email, password, phone, address } = await req.json();
    
    // Get user from database
    const user = await User.findById(decoded._id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await hashPassword(password);
    if (phone) user.phone = phone;
    if (address) user.address = address;
    
    await user.save();
    
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
      apiResponse(200, { user: userWithoutPassword }, 'Profile updated successfully'),
      { status: 200 }
    );
  });
}