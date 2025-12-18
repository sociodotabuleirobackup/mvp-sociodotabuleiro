export async function healthRoutes(app) {
    app.get('/healthz', async () => {
        try {
            await app.prisma.$queryRaw `SELECT 1`;
            return {
                success: true,
                status: 'healthy',
                timestamp: new Date().toISOString(),
                database: 'connected'
            };
        }
        catch (error) {
            app.log.error('Health check failed:', error);
            return {
                success: false,
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                database: 'disconnected'
            };
        }
    });
}
