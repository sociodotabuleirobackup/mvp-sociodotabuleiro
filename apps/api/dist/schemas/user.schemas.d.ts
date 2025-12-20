import { z } from 'zod';
export declare const updateProfileSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    avatar?: string | undefined;
    phone?: string | undefined;
}, {
    name?: string | undefined;
    avatar?: string | undefined;
    phone?: string | undefined;
}>;
export declare const becomeMasterSchema: z.ZodObject<{
    bio: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    bio?: string | undefined;
}, {
    bio?: string | undefined;
}>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type BecomeMasterInput = z.infer<typeof becomeMasterSchema>;
