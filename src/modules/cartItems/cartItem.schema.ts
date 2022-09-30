import { z } from 'zod';

import { prisma } from '@prisma';

// array of objects
export const UpdateCartSchema = z.array(
  z.object({
    productId: z
      .number()
      .positive()
      .multipleOf(1, 'No decimals')
      .refine(async (productId) => {
        const existingProduct = await prisma.product.findUnique({
          where: { id: productId }
        });
        if (!existingProduct) {
          return false;
        }
        return true;
      }, 'Product does not exist'),
    quantity: z.number().min(1).max(100_000_000).multipleOf(1, 'No decimals')
  })
);
