
import fp from 'fastify-plugin';
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { createRemoteJWKSet, jwtVerify } from 'jose';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    user: {
      id: string;
    };
  }
}

const authPlugin: FastifyPluginAsync = fp(async (server) => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;

  if (!supabaseUrl) {
    server.log.error('SUPABASE_URL is missing in environment variables');
    throw new Error('Missing SUPABASE_URL');
  }

  // Configura o JWKS (JSON Web Key Set) do Supabase
  const JWKS = createRemoteJWKSet(
    new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`)
  );

  const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const { payload } = await jwtVerify(token, JWKS, {
        issuer: `${supabaseUrl}/auth/v1`,
        audience: 'authenticated',
      });

      // O 'sub' no JWT do Supabase é o ID do usuário (UID)
      if (!payload.sub) {
        throw new Error('Token payload missing sub claim');
      }

      request.user = { id: payload.sub };
    } catch (error) {
      server.log.warn({ msg: 'Authentication failed', error: (error as Error).message });
      return reply.status(401).send({ error: 'Unauthorized: Invalid token' });
    }
  };

  server.decorate('authenticate', authenticate);
});

export default authPlugin;
