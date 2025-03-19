import crypto from 'crypto';

export const encrypt = (data: string): string => {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY!);
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
};

export const decrypt = (encrypted: string): string => {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY!);
  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
}; 