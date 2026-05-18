import 'dotenv/config';

function getEnvVar(key: keyof NodeJS.ProcessEnv, required = true): string {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`❌ Missing required env variable: ${key}`);
  }
  return value!;
}

function getBool(key: keyof NodeJS.ProcessEnv, defaultValue = false): boolean {
  const v = process.env[key];
  if (v === undefined) return defaultValue;
  return v === 'true';
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: getEnvVar('MONGO_URI'),
  dbName: getEnvVar('DB_NAME'),
  nodeEnv: process.env.NODE_ENV || 'development',
  multerDestination: getEnvVar('MULTER_DESTINATION'),
  logLevel: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'development' ? 'debug' : 'info'),
  enablePretty: getBool('ENABLE_PRETTY', process.env.NODE_ENV === 'development'),
  redactedKeys: (process.env.REDACED_KEYS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  corsAllowedOrigins: (process.env.CORS_ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  corsLegacySupport: getBool('CORS_LEGACY_SUPPORT', false),
};
