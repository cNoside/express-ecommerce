import { z, ZodTypeAny } from 'zod';
import { User, Role } from '@prisma/client';

import { prisma } from '@prisma';

export const CreateUserSchema = z.object<
  Partial<Record<keyof User, ZodTypeAny>>
>({
  email: z
    .string()
    .email()
    .trim()
    .refine(async (email) => {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      if (existingUser) {
        return false;
      }
      return true;
    }, 'Already exists'),
  username: z.string().trim(),
  password: z
    .string()
    .regex(/(?=.*[a-z]).*/, '1 lowercase')
    .regex(/(?=.*[A-Z]).*/, '1 uppercase')
    .regex(/(?=.*[0-9]).*/, '1 number')
    .regex(/(?=.*[!@#$%^&*]).*/, '1 special character')
    .min(8)
    .trim(),
  role: z.nativeEnum(Role)
});

export const UpdateUserSchema = z.object<
  Partial<Record<keyof User, ZodTypeAny>>
>({
  email: z
    .string()
    .email()
    .trim()
    .refine(async (email) => {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      if (existingUser) {
        return false;
      }
      return true;
    }, 'Already exists')
    .optional(),
  username: z.string().trim().optional(),
  password: z
    .string()
    .regex(/(?=.*[a-z]).*/, '1 lowercase')
    .regex(/(?=.*[A-Z]).*/, '1 uppercase')
    .regex(/(?=.*[0-9]).*/, '1 number')
    .regex(/(?=.*[!@#$%^&*]).*/, '1 special character')
    .min(8)
    .trim()
    .optional(),
  role: z.nativeEnum(Role).optional()
});
