import { Middleware } from 'common/types/middleware';
import passport from 'passport';

export const jwtAuth: Middleware = (req, res, next) => {
  passport.authenticate('jwt', (err, user) => {
    if (err) {
      return next(err);
    }
    req.user_ = user;
    next();
  })(req, res, next);
};
