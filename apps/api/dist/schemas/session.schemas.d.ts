import { z } from 'zod';
export declare const createSessionSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    gameSystem: z.ZodString;
    maxPlayers: z.ZodNumber;
    price: z.ZodNumber;
    duration: z.ZodNumber;
    scheduledAt: z.ZodEffects<z.ZodString, Date, string>;
    locationType: z.ZodNativeEnum<{
        ONLINE: "ONLINE";
        VENUE: "VENUE";
    }>;
    storeId: z.ZodOptional<z.ZodString>;
    venueId: z.ZodOptional<z.ZodString>;
    tableId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    gameSystem: string;
    maxPlayers: number;
    price: number;
    duration: number;
    locationType: "ONLINE" | "VENUE";
    scheduledAt: Date;
    description?: string | undefined;
    storeId?: string | undefined;
    venueId?: string | undefined;
    tableId?: string | undefined;
}, {
    title: string;
    gameSystem: string;
    maxPlayers: number;
    price: number;
    duration: number;
    locationType: "ONLINE" | "VENUE";
    scheduledAt: string;
    description?: string | undefined;
    storeId?: string | undefined;
    venueId?: string | undefined;
    tableId?: string | undefined;
}>;
export declare const updateSessionSchema: z.ZodObject<Omit<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    gameSystem: z.ZodOptional<z.ZodString>;
    maxPlayers: z.ZodOptional<z.ZodNumber>;
    price: z.ZodOptional<z.ZodNumber>;
    duration: z.ZodOptional<z.ZodNumber>;
    scheduledAt: z.ZodOptional<z.ZodEffects<z.ZodString, Date, string>>;
    locationType: z.ZodOptional<z.ZodNativeEnum<{
        ONLINE: "ONLINE";
        VENUE: "VENUE";
    }>>;
    storeId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    venueId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    tableId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "locationType" | "storeId" | "venueId" | "tableId">, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    description?: string | undefined;
    gameSystem?: string | undefined;
    maxPlayers?: number | undefined;
    price?: number | undefined;
    duration?: number | undefined;
    scheduledAt?: Date | undefined;
}, {
    title?: string | undefined;
    description?: string | undefined;
    gameSystem?: string | undefined;
    maxPlayers?: number | undefined;
    price?: number | undefined;
    duration?: number | undefined;
    scheduledAt?: string | undefined;
}>;
export declare const sessionFiltersSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodNativeEnum<{
        OPEN: "OPEN";
        FULL: "FULL";
        CANCELLED: "CANCELLED";
        COMPLETED: "COMPLETED";
    }>>;
    locationType: z.ZodOptional<z.ZodNativeEnum<{
        ONLINE: "ONLINE";
        VENUE: "VENUE";
    }>>;
    gameSystem: z.ZodOptional<z.ZodString>;
    masterId: z.ZodOptional<z.ZodString>;
    storeId: z.ZodOptional<z.ZodString>;
    minPrice: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    scheduledAfter: z.ZodOptional<z.ZodEffects<z.ZodString, Date, string>>;
    scheduledBefore: z.ZodOptional<z.ZodEffects<z.ZodString, Date, string>>;
}, "strip", z.ZodTypeAny, {
    status?: "OPEN" | "FULL" | "CANCELLED" | "COMPLETED" | undefined;
    gameSystem?: string | undefined;
    locationType?: "ONLINE" | "VENUE" | undefined;
    masterId?: string | undefined;
    storeId?: string | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    scheduledAfter?: Date | undefined;
    scheduledBefore?: Date | undefined;
}, {
    status?: "OPEN" | "FULL" | "CANCELLED" | "COMPLETED" | undefined;
    gameSystem?: string | undefined;
    locationType?: "ONLINE" | "VENUE" | undefined;
    masterId?: string | undefined;
    storeId?: string | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    scheduledAfter?: string | undefined;
    scheduledBefore?: string | undefined;
}>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type SessionFiltersInput = z.infer<typeof sessionFiltersSchema>;
