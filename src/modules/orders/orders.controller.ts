import { Router } from 'express';
import createError from 'http-errors';
import asyncHandler from 'express-async-handler';

import { prisma } from '@prisma';
import { validateParamInt } from 'common/middlewares';

export const ordersController = Router();

ordersController.get(
  '/',
  asyncHandler(async (req, res) => {
    const orders = await prisma.order.findMany();
    res.send({ orders });
  })
);

ordersController.get(
  '/:id',
  validateParamInt('id'),
  asyncHandler(async (req, res) => {
    const orderId = Number(req.params.id);
    const order = await prisma.order.findUnique({
      where: {
        id: orderId
      }
    });
    if (!order) {
      throw createError(404, 'Order not found');
    }
    res.send({ order });
  })
);

ordersController.get(
  '/:id/items',
  validateParamInt('id'),
  asyncHandler(async (req, res) => {
    const orderId = Number(req.params.id);
    const order = await prisma.order.findUnique({
      where: {
        id: orderId
      },
      include: {
        orderItems: true
      }
    });
    if (!order) {
      throw createError(404, 'Order not found');
    }
    res.send({ order });
  })
);

ordersController.get(
  '/users/:userId',
  validateParamInt('userId'),
  asyncHandler(async (req, res) => {
    const userId = Number(req.params.userId);
    const orders = await prisma.order.findMany({
      where: {
        userId
      }
    });
    res.send({ orders });
  })
);

ordersController.get(
  '/users/:userId/items',
  validateParamInt('userId'),
  asyncHandler(async (req, res) => {
    const userId = Number(req.params.userId);
    const orders = await prisma.order.findMany({
      where: {
        userId
      },
      include: {
        orderItems: true
      }
    });
    res.send({ orders });
  })
);

ordersController.post(
  '/users/:userId',
  validateParamInt('userId'),
  asyncHandler(async (req, res) => {
    const userId = Number(req.params.userId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        cart: true
      }
    });

    if (!user) {
      throw createError(404, 'User not found');
    } else if (user.cart.length === 0) {
      throw createError(400, 'Cart is empty');
    }

    for (const { productId, quantity } of user.cart) {
      const product = await prisma.product.findUnique({
        where: {
          id: productId
        }
      });
      if (Number(product?.quantity) - quantity < 0) {
        throw createError(400, 'Insufficient stock');
      }
      await prisma.product.update({
        where: { id: productId },
        data: {
          quantity: {
            decrement: quantity
          }
        }
      });
    }

    await prisma.cartItem.deleteMany({
      where: {
        userId: user.id
      }
    });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderStatus: 'processing', // TODO: Should be pending once payment is implemented
        orderItems: {
          createMany: {
            data: user.cart.map(({ productId, quantity }) => ({
              productId,
              quantity
            }))
          }
        }
      },
      select: {
        id: true,
        userId: true,
        orderItems: {
          select: {
            productId: true,
            quantity: true
          }
        },
        dateCreated: true
      }
    });

    // TODO
    // Send email/sms to user
    // ...

    res.send({ order });
  })
);
