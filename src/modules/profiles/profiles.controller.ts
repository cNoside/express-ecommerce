import { Router } from 'express';
import createError from 'http-errors';
import asyncHandler from 'express-async-handler';

import {
  roleGuard,
  validateParamInt,
  validateSchema
} from 'common/middlewares';
import { prisma } from '@prisma';
import { parseQueries } from 'common/utils';
import { CreateProfileSchema } from './profile.schema';

export const profilesController = Router();

profilesController.use(roleGuard(['admin']));

profilesController.get(
  '/',
  asyncHandler(async (req, res) => {
    const { skip, take } = parseQueries(req);
    const profiles = await prisma.profile.findMany({ skip, take });
    res.send({ profiles });
  })
);

profilesController.get(
  '/users/:userId',
  validateParamInt('userId'),
  asyncHandler(async (req, res) => {
    const userId = Number(req.params.userId);
    const profile = await prisma.profile.findFirst({
      where: {
        userId
      }
    });
    if (!profile) {
      throw createError(404, 'Profile not found');
    }
    res.send({ profile });
  })
);

profilesController.put(
  '/users/:userId',
  validateParamInt('userId'),
  validateSchema(CreateProfileSchema),
  asyncHandler(async (req, res) => {
    const userId = Number(req.params.userId);
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    if (!existingUser) {
      throw createError(404, 'User not found');
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          upsert: {
            create: req.body,
            update: req.body
          }
        }
      },
      include: {
        profile: true
      }
    });
    Object.assign(user, { password: undefined });
    res.send({ message: 'Upserted profile', user });
  })
);
