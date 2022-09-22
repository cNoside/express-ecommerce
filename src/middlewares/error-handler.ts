import { HttpError } from 'http-errors';
import type { Request, Response, NextFunction } from 'express';

import { logger } from 'common/config/logger';
import { HTTP_ERRORS } from 'constants/http-errors';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof HttpError && err.expose) {
    res.status(err.statusCode).send({
      statusCode: err.statusCode,
      message: err.message
    });
  } else if (err instanceof SyntaxError) {
    res.status(400).send({
      statusCode: 400,
      message: HTTP_ERRORS[400],
      error: 'There was a syntax error in the request.'
    });
  } else if (err instanceof Error) {
    logger.error(err.message, {
      request: {
        method: req.method,
        url: req.url,
        remoteAddress:
          req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        ...(req.body && { body: req.body })
      }
    });
    res.status(500).send({
      statusCode: 500,
      message: HTTP_ERRORS[500]
    });
  } else {
    // eslint-disable-next-line
    // @ts-ignore
    logger.error(err, {
      request: {
        method: req.method,
        url: req.url,
        remoteAddress:
          req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        ...(req.body && { body: req.body })
      }
    });
    res.status(500).send({
      statusCode: 500,
      message: HTTP_ERRORS[500]
    });
  }
};
