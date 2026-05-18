import '@app-types/express';
import { logger } from '@logger/index';
import { v4 as uuid } from 'uuid';
import { getLogLevel } from '@helpers/get-log-level';
import type { TAppMiddleware } from '@infra/app-type-helpers/middleware';
import { COOKIE_NAME } from '@middleware/ensure-guest-id';

export const requestLogger: TAppMiddleware = (req, res, next) => {
  const requestId = uuid();
  req.requestId = requestId;

  // Child-logger for the entire request lifecycle
  const reqLogger = logger.child({
    requestId,
    guestId: req.cookies?.[COOKIE_NAME] ?? 'anonymous yet',
    // basic request context
    method: req.method,
    url: req.originalUrl,
  });

  // Making it available downstream
  res.locals.logger = reqLogger;

  // (Optional) Pass the requestId to the client in the header
  res.setHeader('X-Request-Id', requestId);

  // We log the fact of an incoming request
  const start = Date.now();
  reqLogger.debug('Incoming request');
  // Finally, here's the summary log
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = getLogLevel(res.statusCode);
    reqLogger[level]({ status: res.statusCode, duration }, 'HTTP request completed');
  });

  next();
};
