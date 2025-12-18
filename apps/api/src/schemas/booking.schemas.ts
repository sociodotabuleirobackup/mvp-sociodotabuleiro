import { z } from 'zod'

export const createBookingSchema = z.object({
  sessionId: z.string().min(1),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>