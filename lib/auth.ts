import crypto from 'crypto';
import { cookies } from 'next/headers';

export function getAuthorizedEmail(): string {
  return (process.env.AUTHORIZED_EMAIL || '').toLowerCase().trim();
}
export const AUTH_COOKIE_NAME = 'autoresume_auth_session';

const SECRET_KEY = process.env.AUTH_SECRET || 'autoresume_ats_coderia_secret_key_2026';

/**
 * Criptografa uma senha usando PBKDF2 com Salt aleatório
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Compara uma senha em texto plano com a hash armazenada no banco
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, originalHash] = storedHash.split(':');
    if (!salt || !originalHash) return false;
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
  } catch {
    return false;
  }
}

/**
 * Gera um token de sessão assinado com HMAC-SHA256
 */
export function generateSessionToken(email: string): string {
  const timestamp = Date.now();
  const payload = `${email.toLowerCase().trim()}:${timestamp}`;
  const hmac = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
  return `${Buffer.from(payload).toString('base64')}.${hmac}`;
}

/**
 * Valida a assinatura de um token de sessão
 */
export function verifySessionToken(token: string | undefined | null): { email: string; valid: boolean } | null {
  if (!token) return null;
  try {
    const [base64Payload, hmac] = token.split('.');
    if (!base64Payload || !hmac) return null;

    const payload = Buffer.from(base64Payload, 'base64').toString('utf-8');
    const [email] = payload.split(':');
    
    const cleanEmail = email.toLowerCase().trim();
    const authorized = getAuthorizedEmail();
    if (authorized && cleanEmail !== authorized) return null;

    const expectedHmac = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
    
    const hmacBuffer = Buffer.from(hmac, 'hex');
    const expectedBuffer = Buffer.from(expectedHmac, 'hex');
    
    if (hmacBuffer.length !== expectedBuffer.length) return null;
    if (!crypto.timingSafeEqual(hmacBuffer, expectedBuffer)) return null;

    return { email: cleanEmail, valid: true };
  } catch {
    return null;
  }
}
