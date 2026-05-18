declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    MONGO_URI: string;
    DB_NAME: string;
    NODE_ENV?: 'development' | 'production' | 'test';
    MULTER_DESTINATION: string;
    LOG_LEVEL?: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent';
    REDACED_KEYS?: string; // comma-separated
    CORS_ALLOWED_ORIGINS?: string;
    CORS_LEGACY_SUPPORT?: 'true' | 'false';
  }
}
