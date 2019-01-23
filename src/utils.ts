import * as crypto from 'crypto';
import * as uuidv1 from 'uuid/v1';

export const generateCode = (): string => crypto.randomBytes(8).toString('hex');
export const generateUuid = (): string => uuidv1();
