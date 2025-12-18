import { createSessionSchema } from 'shared';
export async function sessionRoutes(app) {
    // GET /api/sessions - Listar sessões públicas
    app.get('/sessions', async (request, reply) => {
        try {
            const sessions = await app.prisma.session.findMany({
                where: { status: 'OPEN' },
                include: {
                    master: {
                        include: { user: { select: { name: true, avatar: true } } }
                    },
                    store: {
                        include: { user: { select: { name: true } } }
                    },
                    _count: { select: { bookings: true } }
                },
                orderBy: { scheduledAt: 'asc' }
            });
            return { success: true, data: sessions };
        }
        catch (error) {
            app.log.error('Failed to fetch sessions:', error);
            return reply.status(500).send({
                success: false,
                error: 'Internal server error'
            });
        }
    });
    // POST /api/sessions - Criar sessão (autenticado)
    app.post('/sessions', {
        preHandler: [app.authenticate]
    }, async (request, reply) => {
        try {
            const data = createSessionSchema.parse(request.body);
            // Verificar se usuário é MASTER
            const user = await app.prisma.user.findUnique({
                where: { id: request.user.id },
                include: { masterProfile: true }
            });
            if (!user?.masterProfile) {
                return reply.status(403).send({
                    success: false,
                    error: 'Only masters can create sessions'
                });
            }
            const session = await app.prisma.session.create({
                data: {
                    ...data,
                    masterId: user.masterProfile.id
                },
                include: {
                    master: {
                        include: { user: { select: { name: true, avatar: true } } }
                    }
                }
            });
            return reply.status(201).send({ success: true, data: session });
        }
        catch (error) {
            if (error.name === 'ZodError') {
                return reply.status(400).send({
                    success: false,
                    error: 'Validation failed',
                    details: error.issues
                });
            }
            app.log.error('Failed to create session:', error);
            return reply.status(500).send({
                success: false,
                error: 'Internal server error'
            });
        }
    });
}
