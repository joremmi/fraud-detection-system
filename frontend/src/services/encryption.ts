import { AES, enc } from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-dev-key';

export const encryptionService = {
  encrypt(data: string): string {
    return AES.encrypt(data, ENCRYPTION_KEY).toString();
  },

  decrypt(encryptedData: string): string {
    const bytes = AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(enc.Utf8);
  },

  hashData(data: string): string {
    return AES.encrypt(data, ENCRYPTION_KEY).toString();
  }
}; 