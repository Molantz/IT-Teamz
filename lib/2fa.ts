import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

export function generate2FASecret(email: string) {
  return speakeasy.generateSecret({ name: `IT-Teamz (${email})` });
}

export function verify2FAToken(secret: string, token: string) {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1,
  });
}

export async function get2FAQrCodeUrl(otpauthUrl: string) {
  return await qrcode.toDataURL(otpauthUrl);
} 