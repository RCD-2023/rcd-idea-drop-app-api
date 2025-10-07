import { SignJWT } from 'jose';
import dotenv from 'dotenv';
import { JWT_SECRET } from './getJwtSecret.js';

dotenv.config();

/**
 * Generate a JWT (modern way)
 * @param {Object} payload - data too include in the token
 * @param {string} expiresIn - Expiration time
 */

export const generateToken = async (payload, expiresIn = '15m') => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
};
