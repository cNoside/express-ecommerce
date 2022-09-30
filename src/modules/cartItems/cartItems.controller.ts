import { Router } from 'express';
import { prisma } from '@prisma';
import createError from 'http-errors';
import asyncHandler from 'express-async-handler';

import { UpdateCartSchema } from './cartItem.schema';
import { validateParamInt, validateSchema } from 'common/middlewares';
import { Product } from '@prisma/client';

export const cartItemsController = Router();

cartItemsController.get(
  '/user/:userId',
  validateParamInt('userId'),
  asyncHandler(async (req, res) => {
    const userId = Number(req.params.userId);
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId
      },
      select: {
        quantity: true,
        product: true
      }
    });
    res.send({ cart: cartItems });
  })
);

cartItemsController.put(
  '/users/:userId',
  validateParamInt('userId'),
  validateSchema(UpdateCartSchema),
  asyncHandler(async (req, res) => {
    const userId = Number(req.params.userId);
    const products = req.body;
    console.log(req.body);

    for (const product of products) {
      const { quantity: availableStock } = (await prisma.product.findUnique({
        where: { id: product.productId }
      })) as Product;

      if (availableStock - product.quantity < 0) {
        throw createError(400, 'Insufficient stock');
      }

      const existingCartItem = await prisma.cartItem.findFirst({
        where: {
          userId,
          productId: product.productId
        }
      });
      if (existingCartItem) {
        await prisma.cartItem.update({
          where: {
            id: existingCartItem.id
          },
          data: {
            quantity: product.quantity
          }
        });
      } else {
        await prisma.cartItem.create({
          data: {
            userId,
            productId: product.productId,
            quantity: product.quantity
          }
        });
      }
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId
      },
      select: {
        productId: true,
        quantity: true
      },
      orderBy: {
        productId: 'asc'
      }
    });
    res.send({ cart: cartItems });
  })
);

cartItemsController.delete(
  '/user/:userId',
  validateParamInt('userId'),
  asyncHandler(async (req, res) => {
    const userId = Number(req.params.userId);
    await prisma.cartItem.deleteMany({
      where: {
        userId
      }
    });
    res.send({ message: 'Cart cleared' });
  })
);

cartItemsController.delete(
  '/user/:userId/product/:productId',
  validateParamInt('userId', 'productId'),
  asyncHandler(async (req, res) => {
    const userId = Number(req.params.userId);
    const productId = Number(req.params.productId);
    const { count } = await prisma.cartItem.deleteMany({
      where: {
        userId,
        productId
      }
    });
    res.send({
      message: count > 0 ? 'Item removed from cart' : 'Item not found'
    });
  })
);
