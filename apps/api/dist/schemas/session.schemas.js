"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionFiltersSchema = exports.updateSessionSchema = exports.createSessionSchema = void 0;
const zod_1 = require("zod");
const database_1 = require("@socio-do-tabuleiro/database");
exports.createSessionSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(200),
    description: zod_1.z.string().max(2000).optional(),
    gameSystem: zod_1.z.string().min(2).max(100),
    maxPlayers: zod_1.z.number().int().min(1).max(20),
    price: zod_1.z.number().min(0),
    duration: zod_1.z.number().int().min(30).max(720), // 30 minutes to 12 hours
    scheduledAt: zod_1.z
        .string()
        .datetime()
        .transform(str => new Date(str)),
    locationType: zod_1.z.nativeEnum(database_1.LocationType),
    storeId: zod_1.z.string().optional(),
    venueId: zod_1.z.string().optional(),
    tableId: zod_1.z.string().optional(),
});
exports.updateSessionSchema = exports.createSessionSchema.partial().omit({
    locationType: true,
    storeId: true,
    venueId: true,
    tableId: true,
});
exports.sessionFiltersSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(database_1.SessionStatus).optional(),
    locationType: zod_1.z.nativeEnum(database_1.LocationType).optional(),
    gameSystem: zod_1.z.string().optional(),
    masterId: zod_1.z.string().optional(),
    storeId: zod_1.z.string().optional(),
    minPrice: zod_1.z.number().min(0).optional(),
    maxPrice: zod_1.z.number().min(0).optional(),
    scheduledAfter: zod_1.z
        .string()
        .datetime()
        .transform(str => new Date(str))
        .optional(),
    scheduledBefore: zod_1.z
        .string()
        .datetime()
        .transform(str => new Date(str))
        .optional(),
});
