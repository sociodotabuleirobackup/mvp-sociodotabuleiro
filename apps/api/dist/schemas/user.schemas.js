"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.becomeMasterSchema = exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100).optional(),
    avatar: zod_1.z.string().url().optional(),
    phone: zod_1.z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/)
        .optional(), // E.164 format
});
exports.becomeMasterSchema = zod_1.z.object({
    bio: zod_1.z.string().max(1000).optional(),
});
