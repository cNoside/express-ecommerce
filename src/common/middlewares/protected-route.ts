import createError from 'http-errors';

import { Middleware } from 'common/types/middleware';

export const protectedRoute: Middleware = (req, res, next) => {
  if (req.user_) {
    next();
  } else {
    next(createError(401));
  }
};
