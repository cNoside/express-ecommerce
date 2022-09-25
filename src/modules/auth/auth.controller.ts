import argon2 from 'argon2';
import passport from 'passport';
import { Router } from 'express';
import createError from 'http-errors';
import asyncHandler from 'express-async-handler';

import { prisma } from '@prisma';
import { env } from 'common/config/env';
import { AuthSchema, LoginSchema } from './auth.schema';
import { jwtService } from 'common/services/jwt.service';
import { validateSchema, protectedRoute } from 'common/middlewares';

export const authController = Router();

authController.post('/signup', validateSchema(AuthSchema), async (req, res) => {
  const { password, ...rest } = req.body;
  const user = await prisma.user.create({
    data: {
      ...rest,
      password: await argon2.hash(password)
    }
  });

  res.send({ user });
});

authController.post(
  '/login',
  validateSchema(LoginSchema),
  async (req, res, next) => {
    passport.authenticate('local', (err, user) => {
      if (err) {
        return next(err);
      } else if (!user) {
        return next(createError(401, 'Invalid email or password'));
      } else {
        res.send({
          token: jwtService.sign(
            { sub: user.id },
            { expiresIn: env.jwt.expiresIn }
          ),
          expiresIn: env.jwt.expiresIn
        });
      }
    })(req, res, next);
  }
);

authController.get('/whoami', protectedRoute, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user_.id }
  });
  Object.assign(user || {}, { password: undefined });
  res.send({ user });
});
