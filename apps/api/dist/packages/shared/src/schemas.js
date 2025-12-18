import { z } from 'zod';
export const createSessionSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().optional(),
    gameSystem: z.string().min(1),
    maxPlayers: z.number().int().min(1).max(20),
    price: z.number().min(0),
    duration: z.number().int().min(1).max(24),
    scheduledAt: z.string().datetime()
});
export const createBookingSchema = z.object({
    sessionId: z.string().cuid()
});
export const createReviewSchema = z.object({
    sessionId: z.string().cuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional()
});
export const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    avatar: z.string().url().optional()
});
export const createMasterProfileSchema = z.object({
    bio: z.string().optional(),
    experience: z.number().int().min(0).optional()
});
export const createStoreProfileSchema = z.object({
    storeName: z.string().min(1),
    cnpj: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional()
});
