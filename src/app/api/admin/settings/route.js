import connectToDatabase from '@/lib/mongodb';
import { isAdmin } from '@/utils/auth';
import { apiResponse, apiError, handleApiRequest } from '@/utils/api';
import Settings from '@/models/Settings';

// Get all settings
export async function GET(req) {
  return handleApiRequest(req, async () => {
    // Verify admin access
    await isAdmin(req);
    await connectToDatabase();
    
    // Get settings using the model's helper method
    const settings = await Settings.getSettings();
    console.log('Fetched settings from DB in admin API:', settings);
    
    // Add cache control headers to prevent caching
    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
    
    return Response.json(
      apiResponse(settings),
      { 
        status: 200,
        headers
      }
    );
  });
}

// Update settings
export async function PUT(req) {
  return handleApiRequest(req, async () => {
    // Verify admin access
    await isAdmin(req);
    await connectToDatabase();
    
    const settingsData = await req.json();
    
    // Update settings using the model's helper method
    const settings = await Settings.updateSettings(settingsData);
    
    // Add cache control headers to prevent caching
    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
    
    return Response.json(
      apiResponse(settings),
      { 
        status: 200,
        headers
      }
    );
  });
}