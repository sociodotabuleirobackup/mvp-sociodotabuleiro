import fp from 'fastify-plugin';
import { createRemoteJWKSet, jwtVerify } from 'jose';
export const authPlugin = fp(async (server) => {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
        throw new Error('SUPABASE_URL is required');
    }
    const JWKS = createRemoteJWKSet(new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`));
    const authenticate = async (request, reply) => {
        const authHeader = request.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return reply.status(401).send({
                success: false,
                error: 'Missing or invalid authorization header'
            });
        }
        const token = authHeader.split(' ')[1];
        try {
            const { payload } = await jwtVerify(token, JWKS, {
                issuer: `${supabaseUrl}/auth/v1`,
                audience: 'authenticated',
            });
            if (!payload.sub || !payload.email) {
                throw new Error('Invalid token payload');
            }
            request.user = {
                id: payload.sub,
                email: payload.email
            };
        }
        catch (error) {
            server.log.warn({ error }, 'Authentication failed');
            return reply.status(401).send({
                success: false,
                error: 'Invalid token'
            });
        }
    };
    server.decorate('authenticate', authenticate);
});
