import { Middleware } from 'common/types/middleware';

export const isPublic: Middleware = (req, res, next) => {
  req.isPublic = true;
  next();
};
