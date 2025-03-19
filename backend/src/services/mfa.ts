import { authenticator } from 'otplib';
import QRCode from 'qrcode';

export class MFAService {
  static async generateSecret(userId: string): Promise<string> {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(userId, 'FraudGuard', secret);
    const qrCode = await QRCode.toDataURL(otpauth);
    
    return qrCode;
  }

  static verifyToken(token: string, secret: string): boolean {
    return authenticator.verify({ token, secret });
  }
} 