import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  avatar: z.string().url().optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/)
    .optional(), // E.164 format
});

export const becomeMasterSchema = z.object({
  bio: z.string().max(1000).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type BecomeMasterInput = z.infer<typeof becomeMasterSchema>;
