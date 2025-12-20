"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaPlugin = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const database_1 = require("@socio-do-tabuleiro/database");
exports.prismaPlugin = (0, fastify_plugin_1.default)(async (server) => {
    try {
        await database_1.prisma.$connect();
        server.log.info('✅ Prisma connected');
        server.decorate('prisma', database_1.prisma);
        server.addHook('onClose', async () => {
            await database_1.prisma.$disconnect();
            server.log.info('🔌 Prisma disconnected');
        });
    }
    catch (error) {
        server.log.error({ error }, '❌ Prisma connection failed');
        throw error;
    }
});
