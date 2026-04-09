import bcrypt from 'bcryptjs';

import { createUser, findUserByUsername, sanitizeUser } from '../../../../lib/store';
import { readJsonBody } from '../../../../lib/request';
import { errorResponse, successResponse } from '../../../../lib/response';

export const runtime = 'nodejs';

export async function POST(request) {
  const { data, error } = await readJsonBody(request);

  if (error) {
    return error;
  }

  const username = typeof data.username === 'string' ? data.username.trim() : '';
  const password = typeof data.password === 'string' ? data.password : '';

  if (!username || !password) {
    return errorResponse('Username and password are required.', 400);
  }

  if (findUserByUsername(username)) {
    return errorResponse('Username already exists.', 409);
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = createUser({ username, passwordHash });

    return successResponse(
      {
        user: sanitizeUser(user),
      },
      'User registered successfully.',
      201
    );
  } catch {
    return errorResponse('Failed to register user.', 500);
  }
}
