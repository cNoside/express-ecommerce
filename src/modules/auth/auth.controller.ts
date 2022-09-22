import asyncHandler from 'express-async-handler';
import { Router } from 'express';
import createError from 'http-errors';
import argon2 from 'argon2';

import { prisma } from 'common/config/prisma';
import { validate } from 'middlewares/validate';
import { AuthSchema, LoginSchema } from './auth.schema';
import { jwtService } from 'common/services/jwt.service';
import { env } from 'common/config/env';
import passport from 'passport';
import { roleGuard } from 'common/middlewares';
import { protectedRoute } from 'common/middlewares/protected-route';

export const authController = Router();

authController.post('/signup', validate(AuthSchema), async (req, res) => {
  const { password, ...rest } = req.body;
  const user = await prisma.user.create({
    data: {
      ...rest,
      password: await argon2.hash(password)
    }
  });

  res.send({ user });
});

authController.post('/login', validate(LoginSchema), async (req, res, next) => {
  passport.authenticate('local', (err, user, foo, bar) => {
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
});

authController.get('/whoami', protectedRoute, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user_.id }
  });
  Object.assign(user || {}, { password: undefined });
  res.send({ user });
});

authController.delete(
  '/account',
  protectedRoute,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.delete({
      where: { id: req.user_.id }
    });
    res.send({ user });
  })
);
