import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
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

export async function middleware(request: NextRequest) {
  console.log('Middleware called for:', request.nextUrl.pathname);
  
  // Get the token from cookies (for custom auth)
  const customToken = request.cookies.get('token')?.value;
  
  // Get NextAuth token
  const nextAuthToken = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  console.log('Tokens:', { customToken, nextAuthToken });
  
  // Define protected routes
  const adminRoutes = ['/admin', '/admin/dashboard', '/admin/products', '/admin/orders'];
  const customerRoutes = ['/customer', '/customer/dashboard', '/customer/orders', '/customer/profile'];
  
  // Check if the request is for an admin route
  const isAdminRoute = adminRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  
  // Check if the request is for a customer route
  const isCustomerRoute = customerRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  
  console.log('Route checks:', { isAdminRoute, isCustomerRoute });
  
  // Check authentication status
  const isAuthenticated = !!(customToken || nextAuthToken);
  let isAdmin = false;
  
  // Determine admin status
  if (customToken) {
    try {
      const decoded = verifyToken(customToken);
      isAdmin = decoded.isAdmin || false;
      console.log('Custom token isAdmin:', isAdmin);
    } catch (error) {
      // Custom token is invalid, continue checking NextAuth
      console.log('Custom token invalid:', error);
    }
  }
  
  if (nextAuthToken) {
    isAdmin = (nextAuthToken.isAdmin as boolean) || false;
    console.log('NextAuth token isAdmin:', isAdmin);
  }
  
  console.log('Final auth status:', { isAuthenticated, isAdmin });
  
  // If no authentication and trying to access protected route, redirect to login
  if (!isAuthenticated && (isAdminRoute || isCustomerRoute)) {
    console.log('Redirecting to login because not authenticated');
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  
  // If authenticated but trying to access admin route without admin privileges
  if (isAuthenticated && isAdminRoute && !isAdmin) {
    console.log('Redirecting to customer dashboard because not admin');
    return NextResponse.redirect(new URL('/customer/dashboard', request.url));
  }
  
  console.log('Continuing with request');
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