import createError from 'http-errors';
import { NextFunction, Request, Response } from 'express';

export const validateParamInt =
  (paramKey: string | string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (typeof paramKey === 'string') {
      const { [paramKey]: param } = req.params;
      if (isNaN(Number(param))) {
        return next(createError(400, `${paramKey} must be a number`));
      }
    } else {
      Object.entries(req.params).forEach(([key, value]) => {
        if (key in paramKey && isNaN(Number(value))) {
          return next(createError(400, `${paramKey} must be a number`));
        }
      });
    }
    next();
  };
