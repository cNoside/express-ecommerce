import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';

import { Role } from '@prisma/client';

export const roleGuard =
  (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
    if (req.user_ && roles.includes(req.user_.role)) {
      next();
    } else {
      next(createError(401));
    }
  };
