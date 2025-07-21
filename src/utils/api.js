// Helper function to handle API responses
export const apiResponse = (status, data = null, message = '') => {
  const response = {
    status,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
  
  console.log('API Response generated:', response);
  return response;
};

// Helper function to handle API errors
export const apiError = (status, message) => {
  return {
    status,
    error: true,
    message,
    timestamp: new Date().toISOString(),
  };
};

// Helper function to handle API requests
export const handleApiRequest = async (req, handler) => {
  try {
    return await handler(req);
  } catch (error) {
    console.error('API Error:', error);
    
    // Handle different types of errors
    if (error.message === 'Not authenticated, no token') {
      return Response.json(
        apiError(401, 'Authentication required'),
        { status: 401 }
      );
    }
    
    if (error.message === 'Not authorized as admin') {
      return Response.json(
        apiError(403, 'Admin access required'),
        { status: 403 }
      );
    }
    
    if (error.message === 'Invalid token') {
      return Response.json(
        apiError(401, 'Invalid authentication token'),
        { status: 401 }
      );
    }
    
    // Default error response
    return Response.json(
      apiError(500, error.message || 'Internal server error'),
      { status: 500 }
    );
  }
};

// Helper function to validate request method
export const validateMethod = (req, allowedMethods) => {
  if (!allowedMethods.includes(req.method)) {
    return Response.json(
      apiError(405, `Method ${req.method} Not Allowed`),
      { status: 405 }
    );
  }
  return null;
};