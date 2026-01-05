import { z } from 'zod';
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    avatarUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    avatarUrl?: string | undefined;
}, {
    name: string;
    email: string;
    avatarUrl?: string | undefined;
}>;
export declare const createMasterProfileSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    bio: z.ZodOptional<z.ZodString>;
    experience: z.ZodOptional<z.ZodString>;
    specialties: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    bio?: string | undefined;
    experience?: string | undefined;
    specialties?: string[] | undefined;
}, {
    name: string;
    email: string;
    bio?: string | undefined;
    experience?: string | undefined;
    specialties?: string[] | undefined;
}>;
export declare const createSessionSchema: z.ZodObject<{
    title: z.ZodString;
    system: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    date: z.ZodString;
    price: z.ZodNumber;
    playersMax: z.ZodNumber;
    locationType: z.ZodEnum<["ONLINE", "VENUE"]>;
    venueName: z.ZodOptional<z.ZodString>;
    venueAddress: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title: string;
    system: string;
    date: string;
    price: number;
    playersMax: number;
    locationType: "VENUE" | "ONLINE";
    description?: string | undefined;
    venueName?: string | undefined;
    venueAddress?: string | undefined;
    tags?: string[] | undefined;
}, {
    title: string;
    system: string;
    date: string;
    price: number;
    playersMax: number;
    locationType: "VENUE" | "ONLINE";
    description?: string | undefined;
    venueName?: string | undefined;
    venueAddress?: string | undefined;
    tags?: string[] | undefined;
}>;
export declare const updateSessionSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    system: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    date: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    playersMax: z.ZodOptional<z.ZodNumber>;
    locationType: z.ZodOptional<z.ZodEnum<["ONLINE", "VENUE"]>>;
    venueName: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    venueAddress: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    tags: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    system?: string | undefined;
    description?: string | undefined;
    date?: string | undefined;
    price?: number | undefined;
    playersMax?: number | undefined;
    locationType?: "VENUE" | "ONLINE" | undefined;
    venueName?: string | undefined;
    venueAddress?: string | undefined;
    tags?: string[] | undefined;
}, {
    title?: string | undefined;
    system?: string | undefined;
    description?: string | undefined;
    date?: string | undefined;
    price?: number | undefined;
    playersMax?: number | undefined;
    locationType?: "VENUE" | "ONLINE" | undefined;
    venueName?: string | undefined;
    venueAddress?: string | undefined;
    tags?: string[] | undefined;
}>;
export declare const createBookingSchema: z.ZodObject<{
    sessionId: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    notes?: string | undefined;
}, {
    sessionId: string;
    notes?: string | undefined;
}>;
export declare const createPaymentSchema: z.ZodObject<{
    bookingId: z.ZodString;
    amount: z.ZodNumber;
    method: z.ZodEnum<["PIX", "CREDIT_CARD", "DEBIT_CARD"]>;
}, "strip", z.ZodTypeAny, {
    bookingId: string;
    amount: number;
    method: "PIX" | "CREDIT_CARD" | "DEBIT_CARD";
}, {
    bookingId: string;
    amount: number;
    method: "PIX" | "CREDIT_CARD" | "DEBIT_CARD";
}>;
export declare const createAssetSchema: z.ZodObject<{
    title: z.ZodString;
    type: z.ZodEnum<["MAP", "TOKEN", "MODULE"]>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodNumber;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    fileUrl: z.ZodString;
    previewUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "MAP" | "TOKEN" | "MODULE";
    title: string;
    price: number;
    fileUrl: string;
    description?: string | undefined;
    tags?: string[] | undefined;
    previewUrl?: string | undefined;
}, {
    type: "MAP" | "TOKEN" | "MODULE";
    title: string;
    price: number;
    fileUrl: string;
    description?: string | undefined;
    tags?: string[] | undefined;
    previewUrl?: string | undefined;
}>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateMasterProfileInput = z.infer<typeof createMasterProfileSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type CreateAssetInput = z.infer<typeof createAssetSchema>;
