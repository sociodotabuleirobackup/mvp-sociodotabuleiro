import { FastifyInstance } from 'fastify';
import { z } from 'zod';

const createSessionSchema = z.object({
  title: z.string().min(3),
  system: z.string(),
  description: z.string().optional(),
  date: z.string().datetime(),
  price: z.number().min(0),
  playersMax: z.number().int().positive(),
  imageUrl: z.string().url().optional(),
  locationType: z.enum(['ONLINE', 'VENUE']),
  venueId: z.string().optional(),
});

export async function sessionRoutes(app: FastifyInstance) {
  // Listar sessões publicadas (Acesso Público)
  app.get('/api/sessions', async (request, reply) => {
    const sessions = await app.prisma.session.findMany({
      where: { status: 'published' },
      orderBy: { date: 'asc' },
    });
    return sessions;
  });

  // Criar nova sessão (Protegido por Auth)
  app.post(
    '/api/sessions',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const userId = request.user.id;

      try {
        // 1. Validar se o usuário é MASTER no banco de dados
        const profile = await app.prisma.user.findUnique({
          where: { uid: userId },
          select: { role: true }
        });

        if (!profile || profile.role !== 'MASTER') {
          return reply.status(403).send({ 
            error: 'Forbidden: Only users with MASTER role can create sessions' 
          });
        }

        // 2. Validar corpo da requisição
        const data = createSessionSchema.parse(request.body);
        
        // 3. Persistir no banco
        const session = await app.prisma.session.create({
          data: {
            ...data,
            masterId: userId,
            status: 'published',
            playersCurrent: 1,
          },
        });

        return reply.status(201).send(session);
      } catch (error) {
        // Fix: Use .issues instead of .errors to resolve property access error on ZodError
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ error: 'Validation failed', details: error.issues });
        }
        app.log.error(error);
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  );
}
