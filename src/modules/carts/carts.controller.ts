import createError from 'http-errors';
import { prisma } from '@prisma';
import { validateParamInt, validateSchema } from 'common/middlewares';
import { parseQueries } from 'common/utils';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { CreateCartSchema, UpsertCartSchema } from './cart.schema';
import { calculateCartQuantity } from './cart.util';

export const cartsController = Router();

cartsController.get(
  '/',
  asyncHandler(async (req, res) => {
    const { skip, take } = parseQueries(req);
    const carts = await prisma.cart.findMany({
      skip,
      take
    });
    res.send({ carts });
  })
);

cartsController.get(
  '/items',
  asyncHandler(async (req, res) => {
    const { skip, take } = parseQueries(req);
    const carts = await prisma.cart.findMany({
      skip,
      take,
      include: {
        cartItems: true
      }
    });
    res.send({ carts });
  })
);

cartsController.get(
  '/:id',
  validateParamInt('id'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const cart = await prisma.cart.findUnique({
      where: { id: Number(id) }
    });
    if (!cart) {
      throw createError(404, 'Cart not found');
    }
    res.send({ cart });
  })
);

cartsController.get(
  '/:id/items',
  validateParamInt('id'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const cart = await prisma.cart.findUnique({
      where: { id: Number(id) },
      include: {
        cartItems: true,
        user: true
      }
    });
    if (!cart) {
      throw createError(404, 'Cart not found');
    }
    res.send({ cart });
  })
);

cartsController.get(
  '/user/:userId/items',
  validateParamInt('userId'),
  asyncHandler(async (req, res) => {
    const userId = Number(req.params.userId);
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: true
      }
    });
    if (!cart) {
      throw createError(404, 'Cart not found');
    }
    const cartItemsQuantity = await calculateCartQuantity(cart.id);
    res.send({ cart, cartItemsQuantity });
  })
);

cartsController.post(
  '/',
  validateSchema(CreateCartSchema),
  asyncHandler(async (req, res) => {
    const { userId, ...rest } = req.body;
    const cart = await prisma.cart.create({
      data: {
        ...rest,
        user: {
          connect: {
            id: Number(userId)
          }
        }
      }
    });
    res.send({ message: 'Created cart', cart });
  })
);

cartsController.put(
  '/user/:userId',
  validateParamInt(['userId']),
  validateSchema(UpsertCartSchema),
  asyncHandler(async (req, res) => {
    const userId = Number(req.params.userId);
    const cart = await prisma.cart.upsert({
      where: {
        userId
      },
      update: {
        ...req.body
      },
      create: {
        ...req.body,
        user: {
          connect: {
            id: userId
          }
        }
      }
    });
    res.send({ message: `Upserted cart of userId ${userId}`, cart });
  })
);

cartsController.delete(
  '/:id',
  validateParamInt('id'),
  async (req, res, next) => {
    const id = Number(req.params.id);
    const existingCart = await prisma.cart.findUnique({
      where: { id }
    });

    if (!existingCart) {
      return next(createError(404, 'Cart not found'));
    }

    const product = await prisma.product.delete({
      where: { id: existingCart.id }
    });
    res.send({ message: 'Deleted cart', product });
  }
);
