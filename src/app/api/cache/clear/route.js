import { NextResponse } from 'next/server';
import { isAuthenticated, isAdmin } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';
import cache from '@/utils/cache';

// POST /api/cache/clear - Clear application cache (admin only)
export async function POST(request) {
  return handleApiRequest(request, async () => {
    try {
      // Check if user is authenticated and is an admin
      const decoded = await isAuthenticated(request);
      await isAdmin(decoded);
      
      // Clear all cache
      const cacheSize = cache.size();
      cache.clear();
      
      return Response.json(
        apiResponse(200, { clearedItems: cacheSize }, 'Cache cleared successfully'),
        { status: 200 }
      );
    } catch (error) {
      console.error('Error clearing cache:', error);
      return Response.json(
        apiError(500, 'Failed to clear cache'),
        { status: 500 }
      );
    }
  });
}