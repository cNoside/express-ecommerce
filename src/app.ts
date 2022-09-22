import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { Server } from 'http';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

import { routes } from 'routes';
import { env } from 'common/config/env';
import { isRole } from 'middlewares/is-role';
import { prisma } from 'common/config/prisma';
import { errorHandler } from 'middlewares/error-handler';
import { morganWinstonStream } from 'common/config/logger';
import { getPassport } from 'common/config/passport';
import { jwtAuth } from 'middlewares/jwt-auth';
import { notFoundHandler } from 'middlewares/not-found-handler';

const MORGAN_FORMAT =
  ':remote-addr - [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]';

const SWAGGER_OPTIONS = {
  explorer: true
};

dotenv.config();
const app = express();
const passport = getPassport();

export async function main(): Promise<Server> {
  await prisma.$connect();

  app.use(morgan(MORGAN_FORMAT, { stream: morganWinstonStream }));
  app.use(express.json());
  app.use(passport.initialize());
  app.use(jwtAuth);
  app.use(isRole);
  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

  app.use(routes);
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, SWAGGER_OPTIONS)
  );
  app.use('*', notFoundHandler);

  app.use(errorHandler);

  return app.listen(env.server.port, () => {
    console.clear();
    console.log(`Server is running on port ${env.server.port}`);
  });
}
