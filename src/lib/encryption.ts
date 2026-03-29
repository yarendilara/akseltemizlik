import crypto from 'crypto';

/**
 * Aksel Temizlik - Application-Layer Encryption (AES-256-GCM)
 * TCKN ve hassas verilerin veritabanına girmeden önce şifrelenmesi için.
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

// PRD: MASTER_KEY must be a 32-byte (256-bit) hex string from env.
const MASTER_KEY = process.env.ENCRYPTION_KEY || '64_char_hex_key_must_be_provided_in_env_variable_for_production';

/**
 * Veriyi şifreler. 
 * Format: iv:ciphertext:tag:salt
 */
export function encryptSensitiveData(text: string): string {
  if (!text) return "";
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  
  // Create key from master key using PBKDF2 for extra hardening
  const key = crypto.pbkdf2Sync(MASTER_KEY, salt, 100000, 32, 'sha512');
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${encrypted.toString('hex')}:${tag.toString('hex')}:${salt.toString('hex')}`;
}

/**
 * Şifreli veriyi çözer.
 */
export function decryptSensitiveData(encryptedData: string): string {
  if (!encryptedData) return "";
  
  const [ivHex, encryptedHex, tagHex, saltHex] = encryptedData.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const salt = Buffer.from(saltHex, 'hex');
  
  const key = crypto.pbkdf2Sync(MASTER_KEY, salt, 100000, 32, 'sha512');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  
  return decrypted.toString('utf8');
}
