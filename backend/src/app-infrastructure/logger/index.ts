import { config } from '@env/index';
import pino from 'pino';

// General options for all environments
const baseOptions: pino.LoggerOptions = {
  level: config.logLevel,
  base: undefined, // without pid/hostname, cleaner for local logs and correlation in k8s
  timestamp: pino.stdTimeFunctions.isoTime, // ISO format: convenient for Kibana/ELK
  redact: config.redactedKeys.length
    ? {
        paths: config.redactedKeys,
        remove: true, // We completely remove fields from logs
      }
    : undefined,
  serializers: {
    req(req) {
      // Minimum secure information from HTTP-request
      return {
        method: req.method,
        url: req.url,
        id: req?.id,
        ip: req?.ip,
        // We don't log the entire headers, but we can add the necessary ones using whitelisting
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
    err(err) {
      // Useful representation of errors
      return {
        type: err.name,
        message: err.message,
        stack: err.stack,
      };
    },
  },
};

// Transport for dev (pretty)
const transport =
  config.enablePretty && config.nodeEnv === 'development'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard', // locally human-readable, but the timestamp remains isoTime above
          ignore: 'pid,hostname',
          singleLine: true,
        },
      }
    : undefined;

export const logger = pino({
  ...baseOptions,
  transport,
});

// A convenient factory method for context loggers
export const createLogger = (context: Record<string, unknown>) => {
  return logger.child(context);
};
