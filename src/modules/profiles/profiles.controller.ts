import { Router } from 'express';
import createError from 'http-errors';
import asyncHandler from 'express-async-handler';

import { prisma } from '@prisma';
import { parseQueries } from 'common/utils';
import {
  roleGuard,
  validateParamInt,
  validateSchema
} from 'common/middlewares';
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
  '/count',
  asyncHandler(async (req, res) => {
    const count = await prisma.profile.count();
    res.send({ count });
  })
);

profilesController.get(
  '/:id',
  validateParamInt('id'),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const profile = await prisma.profile.findUnique({
      where: { id }
    });
    if (!profile) {
      throw createError(404, 'Profile not found');
    }
    res.send({ profile });
  })
);

profilesController.put(
  '/:id',
  validateParamInt('id'),
  validateSchema(CreateProfileSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) }
    });
    if (!existingUser) {
      throw createError(404, 'User not found');
    }
    const user = await prisma.user.update({
      where: { id: Number(id) },
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
