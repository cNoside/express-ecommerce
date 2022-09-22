import { z, ZodTypeAny } from 'zod';
import { CartItem } from '@prisma/client';

export const UpdateCartSchema = z.object<
  Partial<Record<keyof CartItem, ZodTypeAny>>
>({
  quantity: z.number().min(1).max(100).default(1)
});
