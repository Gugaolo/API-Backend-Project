import { requireAuth } from '../../../../lib/auth';
import { deleteFavorite, findFavoriteByIdForUser, updateFavorite } from '../../../../lib/store';
import { readJsonBody } from '../../../../lib/request';
import { errorResponse, successResponse } from '../../../../lib/response';

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

function parseFavoriteId(rawId) {
  const id = Number(rawId);
  return Number.isInteger(id) ? id : null;
}

export async function PUT(request, { params }) {
  const auth = requireAuth(request);

  if (auth.error) {
    return auth.error;
  }

  const favoriteId = parseFavoriteId(params.id);

  if (favoriteId === null) {
    return errorResponse('Favorite id must be a valid number.', 400);
  }

  const favorite = findFavoriteByIdForUser(favoriteId, auth.payload.username);

  if (!favorite) {
    return errorResponse('Favorite not found.', 404);
  }

  const { data, error } = await readJsonBody(request);

  if (error) {
    return error;
  }

  const favoriteInput = validateFavoritePayload(data);

  if (!favoriteInput) {
    return errorResponse('City, country, latitude, and longitude are required.', 400);
  }

  const updatedFavorite = updateFavorite(favoriteId, auth.payload.username, favoriteInput);

  return successResponse({ favorite: updatedFavorite }, 'Favorite updated successfully.');
}

export async function DELETE(request, { params }) {
  const auth = requireAuth(request);

  if (auth.error) {
    return auth.error;
  }

  const favoriteId = parseFavoriteId(params.id);

  if (favoriteId === null) {
    return errorResponse('Favorite id must be a valid number.', 400);
  }

  const favorite = findFavoriteByIdForUser(favoriteId, auth.payload.username);

  if (!favorite) {
    return errorResponse('Favorite not found.', 404);
  }

  deleteFavorite(favoriteId, auth.payload.username);
  return successResponse({ id: favoriteId }, 'Favorite deleted successfully.');
}
