import { z } from 'zod';
export declare const createBookingSchema: z.ZodObject<{
    sessionId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
}, {
    sessionId: string;
}>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
