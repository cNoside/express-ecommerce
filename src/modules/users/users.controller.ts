import { Router } from 'express';
import createError from 'http-errors';

import { CreateUserSchema, UpdateUserSchema } from './user.schema';
import { CreateProfileSchema } from './profile.schema';
import { prisma } from '@prisma';
import { validate } from 'middlewares/validate';
import { parseQueries } from 'common/utils';
import argon2 from 'argon2';
import asyncHandler from 'express-async-handler';
import { validateParamInt } from 'common/middlewares';
import { roleGuard, validateSchema } from 'common/middlewares';
import { UpdateCartSchema } from './cart.schema';

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
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) }
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
  validate(CreateUserSchema),
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

usersController.put(
  '/:id',
  validateParamInt('id'),
  validate(CreateUserSchema),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const { password, ...rest } = req.body;
    const user = await prisma.user.upsert({
      where: { id },
      update: {
        updatedBy: {
          connect: {
            id: req.user_.id
          }
        },
        ...rest,
        password: await argon2.hash(password)
      },
      create: {
        ...rest,
        id,
        password: await argon2.hash(password)

        // createdBy: {
        //   connect: {
        //     id: 5
        //   }
        // }
      }
    });
    Object.assign(user, { password: undefined });
    res.send({ message: 'Upserted user', user });
  })
);

usersController.patch(
  '/:id',
  validateParamInt('id'),
  validate(UpdateUserSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { password, ...rest } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) }
    });
    if (!existingUser) {
      throw createError(404, 'User not found');
    }
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        ...rest,
        password: password ? await argon2.hash(password) : undefined,
        updatedBy: {
          connect: {
            id: req.user_.id
          }
        }
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

//
//

usersController.get(
  '/relations',
  asyncHandler(async (req, res) => {
    const { skip, take } = parseQueries(req);

    const users = await prisma.user.findMany({
      include: {
        profile: true
      },
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
  '/:id/relations',
  validateParamInt('id'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        profile: true
      }
    });
    if (!user) {
      throw createError(404, 'User not found');
    }
    Object.assign(user, { password: undefined });
    res.send({ user });
  })
);

usersController.get(
  '/:id/cart',
  validateParamInt('id'),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        cart: {
          include: {
            cartItems: true
          }
        }
      }
    });
    if (!user) {
      throw createError(404, 'User not found');
    }
    Object.assign(user, { password: undefined });
    res.send({ user });
  })
);

// usersController.put(
//   '/:id/profile',
//   validateParamInt('id'),
//   validateSchema(CreateProfileSchema),
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const existingUser = await prisma.user.findUnique({
//       where: { id: Number(id) }
//     });
//     if (!existingUser) {
//       throw createError(404, 'User not found');
//     }
//     const user = await prisma.user.update({
//       where: { id: Number(id) },
//       data: {
//         profile: {
//           upsert: {
//             create: req.body,
//             update: req.body
//           }
//         }
//       },
//       include: {
//         profile: true
//       }
//     });
//     Object.assign(user, { password: undefined });
//     res.send({ message: 'Upserted profile', user });
//   })
// );

// usersController.patch(
//   '/:id/profile',
//   validateParamInt('id'),
//   validateSchema(CreateProfileSchema),
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const existingUser = await prisma.user.findUnique({
//       where: { id: Number(id) }
//     });
//     if (!existingUser) {
//       throw createError(404, 'User not found');
//     }
//     const existingProfile = await prisma.profile.findUnique({
//       where: { userId: Number(id) }
//     });
//     if (!existingProfile) {
//       throw createError(404, 'Profile has not been created');
//     }
//     const user = await prisma.user.update({
//       where: { id: Number(id) },
//       data: {
//         profile: {
//           update: req.body
//         }
//       },
//       include: {
//         profile: true
//       }
//     });
//     Object.assign(user, { password: undefined });
//     res.send({ message: 'Updated profile', user });
//   })
// );

// usersController.delete(
//   '/:id/profile',
//   asyncHandler(async (req, res, next) => {
//     const id = Number(req.params.id);
//     if (isNaN(id)) {
//       return next(createError(400, 'Invalid id'));
//     }
//     const existingUser = await prisma.user.findUnique({
//       where: { id }
//     });
//     if (!existingUser) {
//       return next(createError(404, 'User not found'));
//     }
//     const existingProfile = await prisma.profile.findUnique({
//       where: { userId: Number(id) }
//     });
//     if (!existingProfile) {
//       throw createError(404, 'Profile does not exist');
//     }
//     const profile = await prisma.profile.delete({
//       where: { userId: existingProfile.userId }
//     });
//     const user = await prisma.user.findUnique({
//       where: { id: profile.userId },
//       include: {
//         profile: true
//       }
//     });
//     Object.assign(user || {}, { password: undefined });
//     res.send({ message: 'Deleted profile', user });
//   })
// );

// usersController.put(
//   '/:id/cart/:productId',
//   validateParamInt(['id', 'productId']),
//   validate(UpdateCartSchema),
//   asyncHandler(async (req, res) => {
//     const userId = Number(req.params.id);
//     const productId = Number(req.params.productId);
//     const quantity = req.body.quantity;
//     const existingUser = await prisma.user.findUnique({
//       where: { id: userId }
//     });
//     if (!existingUser) {
//       throw createError(404, 'User not found');
//     }
//     const existingProduct = await prisma.product.findUnique({
//       where: { id: productId }
//     });
//     if (!existingProduct) {
//       throw createError(404, 'Product not found');
//     }
//     await prisma.cartItem.upsert({
//       where: {
//         userId
//       },
//       create: {
//         userId,
//         productId,
//         quantity
//       },
//       update: {
//         quantity
//       }
//     });
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       include: {
//         cart: true
//       }
//     });

//     res.send({ message: 'Added to cart', user });
//   })
// );

// usersController.delete(
//   '/:id/cart',
//   validateParamInt('id'),
//   asyncHandler(async (req, res) => {
//     const id = Number(req.params.id);
//     const existingUser = await prisma.user.findUnique({
//       where: { id: Number(id) }
//     });
//     if (!existingUser) {
//       throw createError(404, 'User not found');
//     }
//     await prisma.cartItem.deleteMany({
//       where: { user: { id: id } }
//     });
//     const user = await prisma.user.findUnique({
//       where: { id: id },
//       include: { cart: true }
//     });
//     Object.assign(user || {}, { password: undefined });
//     res.send({ message: 'Cleared cart', user });
//   })
// );
