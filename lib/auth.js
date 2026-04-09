import jwt from 'jsonwebtoken';

import { errorResponse } from './response';

const JWT_EXPIRES_IN = '1h';

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured.');
  }

  return secret;
}

export function signAuthToken(user) {
  return jwt.sign(
    {
      username: user.username,
    },
    getJwtSecret(),
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function getTokenExpiry() {
  return JWT_EXPIRES_IN;
}

export function extractBearerToken(request) {
  const authorization = request.headers.get('authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null;
  }

  const token = authorization.slice(7).trim();
  return token || null;
}

export function verifyAuthToken(token) {
  return jwt.verify(token, getJwtSecret());
}

export function requireAuth(request) {
  const token = extractBearerToken(request);

  if (!token) {
    return {
      error: errorResponse('Authorization header with Bearer token is required.', 401),
    };
  }

  try {
    const payload = verifyAuthToken(token);
    return { payload, token };
  } catch {
    return {
      error: errorResponse('Missing or invalid token.', 401),
    };
  }
}
