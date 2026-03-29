/**
 * Aksel Temizlik - Environment Variable Validation
 * Pre-production Candidate: "Fail Fast" if secrets are missing.
 */

const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "ENCRYPTION_KEY",
  "AUTH_SECRET",
  "PRIVATE_BUCKET_NAME",
  "AWS_REGION",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY"
];

export function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`CRITICAL: Missing environment variables: ${missing.join(', ')}`);
    } else {
      console.warn(`[WARNING] Missing non-critical environment variables for dev: ${missing.join(', ')}`);
    }
  }

  // ENCRYPTION_KEY must be exactly 64 hex characters (32 bytes)
  const key = process.env.ENCRYPTION_KEY;
  if (key && key.length !== 64) {
    throw new Error("CRITICAL: ENCRYPTION_KEY must be a 64-character hex string (32 bytes).");
  }

  return true;
}
