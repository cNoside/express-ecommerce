import { ZodError } from 'zod';

import { HTTP_ERRORS } from 'constants/http-errors';

export const validate =
  (schema: any) => async (req: any, res: any, next: any) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).send({
          statusCode: 400,
          message: HTTP_ERRORS[400],
          errors: err.issues
        });
      } else {
        return next(err);
      }
    }
  };
