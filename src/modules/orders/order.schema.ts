import { z, ZodTypeAny } from 'zod';
import { Order, OrderStatus } from '@prisma/client';

export const UpdateOrder = z.object<Partial<Record<keyof Order, ZodTypeAny>>>({
  orderStatus: z.nativeEnum(OrderStatus).optional()
});
