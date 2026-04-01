import type { TAppMiddleware } from '@app-types/middleware';
import { config } from '@env/index';
import { v4 as uuid } from 'uuid';

export const COOKIE_NAME = 'guest_id';

export const ensureGuestId: TAppMiddleware = (req, res, next) => {
  const isExistingCookieName = req.cookies?.[COOKIE_NAME];
  if (!isExistingCookieName) {
    const id = uuid();
    res.cookie(COOKIE_NAME, id, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
  }
  next();
};
