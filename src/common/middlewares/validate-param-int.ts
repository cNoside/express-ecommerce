import createError from 'http-errors';
import { NextFunction, Request, Response } from 'express';

export const validateParamInt =
  (...paramKey: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (typeof paramKey === 'string') {
      const { [paramKey]: param } = req.params;
      if (isNaN(Number(param))) {
        return next(createError(400, `${paramKey} must be a number`));
      }
    } else if (paramKey instanceof Array) {
      for (const key of paramKey) {
        const { [key]: param } = req.params;
        if (isNaN(Number(param))) {
          return next(createError(400, `${key} must be a number`));
        }
      }
    }
    next();
  };
