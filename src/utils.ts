import * as crypto from 'crypto';

export const generateRandomCode = (): string => crypto.randomBytes(8).toString('hex');
