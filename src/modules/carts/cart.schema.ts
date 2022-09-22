import { z, ZodTypeAny } from 'zod';
import { Cart } from '@prisma/client';

import { prisma } from '@prisma';

export const CreateCartSchema = z.object<
  Partial<Record<keyof Cart, ZodTypeAny>>
>({
  userId: z
    .number()
    .positive()
    .multipleOf(1, 'No decimals')
    .refine(async (userId) => {
      const existingUser = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!existingUser) {
        return false;
      }
      return true;
    }, 'User does not exist')
    .refine(async (userId) => {
      const existingCart = await prisma.cart.findUnique({
        where: { id: userId }
      });
      if (!existingCart) {
        return true;
      }
      return false;
    }, 'Cart already exists'),
  totalPrice: z
    .number()
    .positive()
    .max(1_000_000_000)
    .transform((price) => Number(price.toFixed(2)))
    .optional(),
  totalQuantity: z
    .number()
    .min(0)
    .max(100_000_000)
    .multipleOf(1, 'No decimals')
    .optional()
});
