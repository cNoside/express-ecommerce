import { z, ZodTypeAny } from 'zod';
import { User } from '@prisma/client';

import { prisma } from 'common/config/prisma';

export const LoginSchema = z.object({
  email: z.string(),
  password: z.string()
});

export const AuthSchema = z.object<Partial<Record<keyof User, ZodTypeAny>>>({
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
    .trim()
});
