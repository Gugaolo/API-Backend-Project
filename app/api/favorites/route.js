import { requireAuth } from '../../../lib/auth';
import { createFavorite, getFavoritesForUser } from '../../../lib/store';
import { readJsonBody } from '../../../lib/request';
import { errorResponse, successResponse } from '../../../lib/response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function validateFavoritePayload(data) {
  const city = typeof data.city === 'string' ? data.city.trim() : '';
  const country = typeof data.country === 'string' ? data.country.trim() : '';
  const latitude = typeof data.latitude === 'number' ? data.latitude : Number(data.latitude);
  const longitude = typeof data.longitude === 'number' ? data.longitude : Number(data.longitude);

  if (!city || !country || Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }

  return { city, country, latitude, longitude };
}

export async function GET(request) {
  const auth = requireAuth(request);

  if (auth.error) {
    return auth.error;
  }

  const favorites = getFavoritesForUser(auth.payload.username);
  return successResponse({ favorites }, 'Favorites fetched successfully.');
}

export async function POST(request) {
  const auth = requireAuth(request);

  if (auth.error) {
    return auth.error;
  }

  const { data, error } = await readJsonBody(request);

  if (error) {
    return error;
  }

  const favoriteInput = validateFavoritePayload(data);

  if (!favoriteInput) {
    return errorResponse('City, country, latitude, and longitude are required.', 400);
  }

  const favorite = createFavorite({
    ...favoriteInput,
    createdBy: auth.payload.username,
  });

  return successResponse({ favorite }, 'Favorite created successfully.', 201);
}
