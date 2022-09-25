import { Router } from 'express';
import { prisma } from '@prisma';
import asyncHandler from 'express-async-handler';

import { CreateCartItemSchema } from './cartItem.schema';
import { validateParamInt, validateSchema } from 'common/middlewares';

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
  '/user/:userId',
  validateParamInt('userId'),
  validateSchema(CreateCartItemSchema),
  asyncHandler(async (req, res) => {
    const userId = Number(req.params.userId);
    const { productId, quantity } = req.body;

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId
      }
    });
    if (existingCartItem) {
      await prisma.cartItem.update({
        where: {
          id: existingCartItem.id
        },
        data: {
          quantity
        }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId,
          ...req.body
        }
      });
    }
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId
      },
      select: {
        quantity: true,
        productId: true
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
  validateParamInt(['userId', 'productId']),
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
