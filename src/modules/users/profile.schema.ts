import { z, ZodTypeAny } from 'zod';
import { Profile } from '@prisma/client';

export const CreateProfileSchema = z.object<
  Partial<Record<keyof Profile, ZodTypeAny>>
>({
  firstName: z.string().max(50).trim().optional(),
  lastName: z.string().trim().max(50).trim().optional(),
  imageUrl: z.string().url().trim().optional(),
  bio: z.string().max(500).trim().optional()
});
