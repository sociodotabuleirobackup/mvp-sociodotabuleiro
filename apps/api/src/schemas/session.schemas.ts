import { z } from 'zod';
import { LocationType, SessionStatus } from '@socio-do-tabuleiro/database';

export const createSessionSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  gameSystem: z.string().min(2).max(100),
  maxPlayers: z.number().int().min(1).max(20),
  price: z.number().min(0),
  duration: z.number().int().min(30).max(720), // 30 minutes to 12 hours
  scheduledAt: z
    .string()
    .datetime()
    .transform(str => new Date(str)),
  locationType: z.nativeEnum(LocationType),
  storeId: z.string().optional(),
  venueId: z.string().optional(),
  tableId: z.string().optional(),
});

export const updateSessionSchema = createSessionSchema.partial().omit({
  locationType: true,
  storeId: true,
  venueId: true,
  tableId: true,
});

export const sessionFiltersSchema = z.object({
  status: z.nativeEnum(SessionStatus).optional(),
  locationType: z.nativeEnum(LocationType).optional(),
  gameSystem: z.string().optional(),
  masterId: z.string().optional(),
  storeId: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  scheduledAfter: z
    .string()
    .datetime()
    .transform(str => new Date(str))
    .optional(),
  scheduledBefore: z
    .string()
    .datetime()
    .transform(str => new Date(str))
    .optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type SessionFiltersInput = z.infer<typeof sessionFiltersSchema>;
