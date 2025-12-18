import { z } from 'zod';

// User schemas
export const updateUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  avatarUrl: z.string().url().optional(),
});

export const createMasterProfileSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  bio: z.string().max(500).optional(),
  experience: z.string().max(1000).optional(),
  specialties: z.array(z.string()).optional(),
});

// Session schemas
export const createSessionSchema = z.object({
  title: z.string().min(3).max(200),
  system: z.string().min(2).max(100),
  description: z.string().max(2000).optional(),
  date: z.string().datetime(),
  price: z.number().min(0),
  playersMax: z.number().min(1).max(10),
  locationType: z.enum(['ONLINE', 'VENUE']),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateSessionSchema = createSessionSchema.partial();

// Booking schemas
export const createBookingSchema = z.object({
  sessionId: z.string().uuid(),
  notes: z.string().max(500).optional(),
});

// Payment schemas
export const createPaymentSchema = z.object({
  bookingId: z.string().uuid(),
  amount: z.number().min(0),
  method: z.enum(['PIX', 'CREDIT_CARD', 'DEBIT_CARD']),
});

// Asset schemas
export const createAssetSchema = z.object({
  title: z.string().min(3).max(200),
  type: z.enum(['MAP', 'TOKEN', 'MODULE']),
  description: z.string().max(2000).optional(),
  price: z.number().min(0),
  tags: z.array(z.string()).optional(),
  fileUrl: z.string().url(),
  previewUrl: z.string().url().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateMasterProfileInput = z.infer<
  typeof createMasterProfileSchema
>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type CreateAssetInput = z.infer<typeof createAssetSchema>;
