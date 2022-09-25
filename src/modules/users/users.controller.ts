import argon2 from 'argon2';
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
import { CreateUserSchema, UpdateUserSchema } from './user.schema';

export const usersController = Router();

usersController.use(roleGuard(['admin']));

usersController.get(
  '/',
  asyncHandler(async (req, res) => {
    const { skip, take } = parseQueries(req);
    const users = await prisma.user.findMany({
      skip,
      take
    });
    users.forEach((user) => {
      Object.assign(user, { password: undefined });
    });
    res.send({ users });
  })
);

usersController.get(
  '/:id',
  validateParamInt('id'),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id }
    });
    if (!user) {
      throw createError(404, 'User not found');
    }
    Object.assign(user, { password: undefined });
    res.send({ user });
  })
);

usersController.post(
  '/',
  validateSchema(CreateUserSchema),
  asyncHandler(async (req, res) => {
    const { password, ...rest } = req.body;
    const user = await prisma.user.create({
      data: {
        ...rest,
        password: await argon2.hash(password)
      }
    });
    Object.assign(user, { password: undefined });
    res.send({ message: 'Created user', user });
  })
);

usersController.patch(
  '/:id',
  validateParamInt('id'),
  validateSchema(UpdateUserSchema),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const { password, ...rest } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });
    if (!existingUser) {
      throw createError(404, 'User not found');
    }
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...rest,
        password: password ? await argon2.hash(password) : undefined
      }
    });
    Object.assign(user, { password: undefined });
    res.send({ message: 'Updated user', user });
  })
);

usersController.delete('/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return next(createError(400, 'Invalid id'));
  }

  const existingUser = await prisma.user.findUnique({
    where: { id }
  });

  if (!existingUser) {
    return next(createError(404, 'User not found'));
  }

  const user = await prisma.user.delete({
    where: { id: existingUser.id }
  });
  Object.assign(user || {}, { password: undefined });
  res.send({ message: 'Deleted user', user });
});
