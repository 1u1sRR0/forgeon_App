// API Error handling utilities

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
}

export function getUserFriendlyErrorMessage(error: unknown): string {
  const message = getErrorMessage(error);
  
  // Map technical errors to user-friendly messages
  const errorMap: Record<string, string> = {
    'Failed to fetch': 'Unable to connect to the server. Please check your internet connection.',
    'Network request failed': 'Network error. Please try again.',
    'Unauthorized': 'You need to be logged in to perform this action.',
    'Forbidden': 'You don\'t have permission to perform this action.',
    'Not Found': 'The requested resource was not found.',
    'Internal Server Error': 'Something went wrong on our end. Please try again later.',
  };
  
  // Check for exact matches
  if (errorMap[message]) {
    return errorMap[message];
  }
  
  // Check for partial matches
  for (const [key, value] of Object.entries(errorMap)) {
    if (message.includes(key)) {
      return value;
    }
  }
  
  return message;
}

export async function handleAPIResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || errorData.message || response.statusText;
    throw new APIError(response.status, message, errorData.code);
  }
  
  return response.json();
}

export function createErrorResponse(
  statusCode: number,
  message: string,
  code?: string
) {
  return Response.json(
    { error: message, code },
    { status: statusCode }
  );
}
