"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authPlugin = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const jose_1 = require("jose");
exports.authPlugin = (0, fastify_plugin_1.default)(async (server) => {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    let JWKS = null;
    if (supabaseUrl) {
        JWKS = (0, jose_1.createRemoteJWKSet)(new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`));
    }
    else {
        server.log.warn('SUPABASE_URL not configured - authentication will be disabled');
    }
    const authenticate = async (request, reply) => {
        if (!JWKS || !supabaseUrl) {
            return reply.status(503).send({
                success: false,
                error: 'Authentication not configured',
            });
        }
        const authHeader = request.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return reply.status(401).send({
                success: false,
                error: 'Missing or invalid authorization header',
            });
        }
        const token = authHeader.split(' ')[1];
        try {
            const { payload } = await (0, jose_1.jwtVerify)(token, JWKS, {
                issuer: `${supabaseUrl}/auth/v1`,
                audience: 'authenticated',
            });
            if (!payload.sub || !payload.email) {
                throw new Error('Invalid token payload');
            }
            request.user = {
                id: payload.sub,
                email: payload.email,
            };
        }
        catch (error) {
            server.log.warn({ error }, 'Authentication failed');
            return reply.status(401).send({
                success: false,
                error: 'Invalid token',
            });
        }
    };
    server.decorate('authenticate', authenticate);
});
