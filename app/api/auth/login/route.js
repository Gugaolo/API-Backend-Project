import bcrypt from 'bcryptjs';

import { getTokenExpiry, signAuthToken } from '../../../../lib/auth';
import { readJsonBody } from '../../../../lib/request';
import { errorResponse, successResponse } from '../../../../lib/response';
import { findUserByUsername, sanitizeUser } from '../../../../lib/store';

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

  const user = findUserByUsername(username);

  if (!user) {
    return errorResponse('Invalid username or password.', 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return errorResponse('Invalid username or password.', 401);
  }

  try {
    const token = signAuthToken(user);

    return successResponse(
      {
        token,
        expiresIn: getTokenExpiry(),
        user: sanitizeUser(user),
      },
      'Login successful.'
    );
  } catch (error) {
    if (error.message === 'JWT_SECRET is not configured.') {
      return errorResponse('Server JWT configuration is missing.', 500);
    }

    return errorResponse('Failed to log in user.', 500);
  }
}
