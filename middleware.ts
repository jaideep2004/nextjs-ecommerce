import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

// JWT verification function (copied from utils/auth.js to avoid import issues in middleware)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Define a custom interface for our JWT payload
interface CustomJwtPayload extends JwtPayload {
  _id?: string;
  name?: string;
  email?: string;
  isAdmin?: boolean;
}

const verifyToken = (token: string): CustomJwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export function middleware(request: NextRequest) {
  // Get the token from the cookies
  const token = request.cookies.get('token')?.value;
  
  // Define protected routes
  const adminRoutes = ['/admin', '/admin/dashboard', '/admin/products', '/admin/orders', '/admin/users'];
  const customerRoutes = ['/customer', '/customer/dashboard', '/customer/orders', '/customer/profile'];
  
  // Check if the request is for an admin route
  const isAdminRoute = adminRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  
  // Check if the request is for a customer route
  const isCustomerRoute = customerRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  
  // If no token and trying to access protected route, redirect to login
  if (!token && (isAdminRoute || isCustomerRoute)) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  
  // If token exists, verify it and check user role for admin routes
  if (token && isAdminRoute) {
    try {
      const decoded = verifyToken(token);
      
      // If user is not an admin, redirect to customer dashboard
      if (!decoded.isAdmin) {
        return NextResponse.redirect(new URL('/customer/dashboard', request.url));
      }
    } catch (error) {
      // If token is invalid, redirect to login
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }
  
  // Continue with the request
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/admin/:path*',
    '/customer/:path*',
  ],
};