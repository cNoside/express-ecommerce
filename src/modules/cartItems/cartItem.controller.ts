import { Router } from 'express';
import { prisma } from '@prisma';
import createError from 'http-errors';
import asyncHandler from 'express-async-handler';

import { parseQueries } from 'common/utils';
import { validateParamInt, validateSchema } from 'common/middlewares';
import { CreateCartItemSchema } from './cartItem.schema';

export const cartItemsController = Router();

cartItemsController.get(
  '/',
  asyncHandler(async (req, res) => {
    const { skip, take } = parseQueries(req);
    const cartItems = await prisma.cartItem.findMany({
      skip,
      take
    });
    res.send({ cartItems });
  })
);

cartItemsController.post(
  '/user/:userId',
  validateParamInt('userId'),
  validateSchema(CreateCartItemSchema),
  asyncHandler(async (req, res) => {
    const userId = Number(req.params.userId);
    const productId = Number(req.body.productId);
    const quantity = Number(req.body.quantity);
    const cart = await prisma.cart.findUnique({
      where: { userId }
    });
    if (!cart) {
      throw createError(404, 'Cart not found');
    }
    const existingCartProductItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        AND: {
          productId
        }
      }
    });

    let cartItem;
    if (existingCartProductItem) {
      cartItem = await prisma.cartItem.update({
        where: {
          id: existingCartProductItem.id
        },
        data: {
          quantity
        }
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cart: {
            connect: {
              id: cart.id
            }
          },
          product: {
            connect: {
              id: req.body.productId
            }
          },
          quantity: req.body.quantity
        }
      });
    }
    res.send({ cartItem });
  })
);
