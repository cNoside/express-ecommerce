import { Request, Response, NextFunction } from 'express';

import { Role } from '@prisma/client';

export const isRole = (req: Request, res: Response, next: NextFunction) => {
  req.isRole = (roles: Role[]) => {
    if (req.user_ && roles.includes(req.user_.role)) {
      return true;
    }
    return false;
  };
  next();
};
