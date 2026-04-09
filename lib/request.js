import { errorResponse } from './response';

export async function readJsonBody(request) {
  try {
    const data = await request.json();

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return {
        error: errorResponse('Request body must be a valid JSON object.', 400),
      };
    }

    return { data };
  } catch {
    return {
      error: errorResponse('Request body must be valid JSON.', 400),
    };
  }
}
