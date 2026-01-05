import { updateUserSchema, createMasterProfileSchema } from '@socio-do-tabuleiro/shared';
export async function userRoutes(app) {
    // GET /api/users/me - Perfil do usuário autenticado
    app.get('/users/me', {
        preHandler: [app.authenticate]
    }, async (request, reply) => {
        try {
            const profile = await app.prisma.profile.findUnique({
                where: { id: request.user.id }
            });
            if (!profile) {
                return reply.status(404).send({
                    success: false,
                    error: 'User not found'
                });
            }
            return { success: true, data: profile };
        }
        catch (error) {
            app.log.error({ error }, 'Failed to fetch user');
            return reply.status(500).send({
                success: false,
                error: 'Internal server error'
            });
        }
    });
    // PUT /api/users/me - Atualizar perfil
    app.put('/users/me', {
        preHandler: [app.authenticate]
    }, async (request, reply) => {
        try {
            const data = updateUserSchema.parse(request.body);
            const profile = await app.prisma.profile.update({
                where: { id: request.user.id },
                data
            });
            return { success: true, data: profile };
        }
        catch (error) {
            if (error instanceof Error && error.name === 'ZodError') {
                return reply.status(400).send({
                    success: false,
                    error: 'Validation failed',
                    details: error.issues
                });
            }
            app.log.error({ error }, 'Failed to update user');
            return reply.status(500).send({
                success: false,
                error: 'Internal server error'
            });
        }
    });
    // POST /api/users/master-profile - Criar perfil de mestre
    app.post('/users/master-profile', {
        preHandler: [app.authenticate]
    }, async (request, reply) => {
        try {
            const data = createMasterProfileSchema.parse(request.body);
            // Atualizar role do usuário para MASTER
            const profile = await app.prisma.profile.update({
                where: { id: request.user.id },
                data: { role: 'MASTER' }
            });
            return reply.status(201).send({ success: true, data: profile });
        }
        catch (error) {
            if (error instanceof Error && error.name === 'ZodError') {
                return reply.status(400).send({
                    success: false,
                    error: 'Validation failed',
                    details: error.issues
                });
            }
            app.log.error({ error }, 'Failed to create master profile');
            return reply.status(500).send({
                success: false,
                error: 'Internal server error'
            });
        }
    });
}
