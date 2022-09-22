import { Cart } from '@prisma/client';

import { prisma } from '@prisma';

export const calculateCartQuantity = (cartId: number) => {
  return prisma.cartItem.aggregate({
    where: {
      cartId
    },
    _sum: {
      quantity: true
    }
  });
};
