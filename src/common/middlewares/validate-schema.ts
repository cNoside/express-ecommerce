import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodObject, ZodTypeAny } from 'zod';

export const validateSchema =
  (schema: ZodObject<Record<string, ZodTypeAny>>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).send({
          statusCode: 400,
          message: 'Request body is not valid',
          errors: err.issues
        });
      } else {
        return next(err);
      }
    }
  };
