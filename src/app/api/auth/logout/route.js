import { cookies } from 'next/headers';
import { apiResponse, handleApiRequest } from '@/utils/api';

export async function POST(req) {
  return handleApiRequest(req, async () => { 
    // Clear the token cookie 
    const cookieStore = await cookies();
    cookieStore.delete('token');
    
    return Response.json(
      apiResponse(200, null, 'Logged out successfully'),
      { status: 200 }
    );
  });
}