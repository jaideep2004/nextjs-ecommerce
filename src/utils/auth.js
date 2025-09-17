import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Import authOptions dynamically to avoid circular imports
let authOptions;
try {
  authOptions = require('@/app/api/auth/[...nextauth]/route').authOptions;
} catch (error) {
  console.log('AuthOptions not available in auth utils');
}

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password with hashed password
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Parse JWT token from cookies or authorization header
export const parseToken = (req) => {
  // Check for token in cookies
  let token = null;
  
  // Handle NextRequest object (App Router)
  if (req.cookies && typeof req.cookies.get === 'function') {
    const tokenCookie = req.cookies.get('token');
    token = tokenCookie?.value;
  } 
  // Handle traditional req.cookies object (Pages Router or manually set)
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }
  
  if (token) {
    return token;
  }
  
  // Check for token in authorization header
  const authHeader = req.headers.get ? req.headers.get('authorization') : req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  return null;
};

// Enhanced authentication middleware that supports both NextAuth and JWT
export const isAuthenticated = async (req) => {
  console.log('=== isAuthenticated called ===');
  
  // First try NextAuth session if authOptions is available
  if (authOptions) {
    try {
      console.log('Checking NextAuth session...');
      const session = await getServerSession(authOptions);
      console.log('NextAuth session result:', session ? 'Found session for ' + session.user?.email : 'No session');
      
      if (session?.user?.email) {
        await connectToDatabase();
        const user = await User.findOne({ email: session.user.email }).select('-password');
        if (user) {
          console.log('Found user via NextAuth:', user.email);
          return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin || false
          };
        }
      }
    } catch (nextAuthError) {
      console.log('NextAuth session check failed:', nextAuthError.message);
    }
  }
  
  // Fallback to custom JWT authentication
  try {
    console.log('Trying custom JWT authentication...');
    const token = parseToken(req);
    
    if (!token) {
      throw new Error('Not authenticated, no token');
    }
    
    const decoded = verifyToken(token);
    console.log('JWT decoded successfully for user:', decoded._id);
    return decoded;
  } catch (jwtError) {
    console.log('JWT authentication failed:', jwtError.message);
    throw new Error('Authentication failed - no valid session or token');
  }
};

// Enhanced admin middleware that supports both NextAuth and JWT
export const isAdmin = async (req) => {
  try {
    console.log('=== isAdmin called ===');
    
    // If req is a user object (from isAuthenticated result)
    if (req && typeof req === 'object' && req.isAdmin !== undefined) {
      if (!req.isAdmin) {
        throw new Error('Not authorized as admin');
      }
      return req;
    }
    
    // If req is a request object
    const decoded = await isAuthenticated(req);
    
    if (!decoded.isAdmin) {
      throw new Error('Not authorized as admin');
    }
    
    return decoded;
  } catch (error) {
    throw new Error(error.message || 'Authorization failed');
  }
};