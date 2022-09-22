import { z, ZodTypeAny } from 'zod';
import { Product } from '@prisma/client';

export const CreateProductSchema = z.object<
  Partial<Record<keyof Product, ZodTypeAny>>
>({
  name: z.string().max(50).trim(),
  description: z.string().max(500).trim(),
  imageUrl: z.string().url().trim(),
  price: z
    .number()
    .positive()
    .max(1_000_000)
    .transform((price) => Number(price.toFixed(2))),
  quantity: z.number().min(0).max(100_000_000).multipleOf(1, 'No decimals')
});

export const UpdateProductSchema = z.object<
  Partial<Record<keyof Product, ZodTypeAny>>
>({
  name: z.string().max(50).trim().optional(),
  description: z.string().max(500).trim().optional(),
  imageUrl: z.string().url().trim().optional(),
  price: z
    .number()
    .positive()
    .max(1_000_000)
    .transform((price) => Number(price.toFixed(2)))
    .optional(),
  quantity: z.number().min(0).max(100_000_000).optional()
});
