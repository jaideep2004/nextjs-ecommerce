import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

// Authentication middleware
export const isAuthenticated = async (req) => {
  try {
    const token = parseToken(req);
    
    if (!token) {
      throw new Error('Not authenticated, no token');
    }
    
    const decoded = verifyToken(token);
    return decoded;
  } catch (error) {
    throw new Error(error.message || 'Authentication failed');
  }
};

// Admin middleware
export const isAdmin = async (req) => {
  try {
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