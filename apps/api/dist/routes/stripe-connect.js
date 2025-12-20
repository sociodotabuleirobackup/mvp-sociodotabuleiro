"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeConnectRoutes = stripeConnectRoutes;
const stripeConnect_1 = require("../services/stripeConnect");
const splitPayments_1 = require("../services/splitPayments");
const webhookHandlers_1 = require("../services/webhookHandlers");
const database_1 = require("@socio-do-tabuleiro/database");
function getBaseUrl() {
    if (process.env.REPLIT_DOMAINS) {
        return `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`;
    }
    if (process.env.REPLIT_DEV_DOMAIN) {
        return `https://${process.env.REPLIT_DEV_DOMAIN}`;
    }
    return process.env.BASE_URL || 'http://localhost:5000';
}
async function stripeConnectRoutes(server) {
    server.post('/stripe/connect/create-account', {
        preHandler: [server.authenticate],
    }, async (request, reply) => {
        try {
            const user = request.user;
            const body = request.body;
            const existingUser = await database_1.prisma.user.findUnique({
                where: { id: user.id },
            });
            if (existingUser?.stripeConnectAccountId) {
                const link = await stripeConnect_1.stripeConnectService.createAccountLink(existingUser.stripeConnectAccountId);
                return reply.send({
                    success: true,
                    accountId: existingUser.stripeConnectAccountId,
                    onboardingUrl: link.url,
                    message: 'Conta existente - redirecionando para completar onboarding',
                });
            }
            const result = await stripeConnect_1.stripeConnectService.createConnectedAccount({
                email: user.email,
                businessType: body.businessType,
                country: 'BR',
                firstName: body.firstName,
                lastName: body.lastName,
                companyName: body.companyName,
                cpf: body.cpf,
                cnpj: body.cnpj,
            });
            await database_1.prisma.user.update({
                where: { id: user.id },
                data: {
                    stripeConnectAccountId: result.accountId,
                    stripeVerificationStatus: 'PENDING',
                },
            });
            return reply.send({
                success: true,
                accountId: result.accountId,
                onboardingUrl: result.onboardingUrl,
            });
        }
        catch (error) {
            server.log.error(error, 'Failed to create Stripe Connect account');
            return reply.status(500).send({
                success: false,
                error: error.message || 'Erro ao criar conta Stripe Connect',
            });
        }
    });
    server.get('/stripe/connect/status', {
        preHandler: [server.authenticate],
    }, async (request, reply) => {
        try {
            const user = await database_1.prisma.user.findUnique({
                where: { id: request.user.id },
            });
            if (!user?.stripeConnectAccountId) {
                return reply.send({
                    success: true,
                    hasAccount: false,
                    status: null,
                });
            }
            const status = await stripeConnect_1.stripeConnectService.getAccountStatus(user.stripeConnectAccountId);
            return reply.send({
                success: true,
                hasAccount: true,
                accountId: user.stripeConnectAccountId,
                verified: status.verified,
                status: status.status,
                requirements: status.requirements,
                chargesEnabled: status.chargesEnabled,
                payoutsEnabled: status.payoutsEnabled,
            });
        }
        catch (error) {
            server.log.error(error, 'Failed to get Stripe Connect status');
            return reply.status(500).send({
                success: false,
                error: error.message || 'Erro ao obter status da conta',
            });
        }
    });
    server.get('/stripe/connect/refresh', async (request, reply) => {
        try {
            const accountId = request.query.account_id;
            const link = await stripeConnect_1.stripeConnectService.createAccountLink(accountId);
            return reply.redirect(link.url);
        }
        catch (error) {
            server.log.error(error, 'Failed to refresh onboarding link');
            return reply.status(500).send({ error: 'Erro ao renovar link de onboarding' });
        }
    });
    server.get('/stripe/connect/refresh-link', {
        preHandler: [server.authenticate],
    }, async (request, reply) => {
        try {
            const user = await database_1.prisma.user.findUnique({
                where: { id: request.user.id },
            });
            if (!user?.stripeConnectAccountId) {
                return reply.status(400).send({
                    success: false,
                    error: 'Conta Stripe Connect não encontrada',
                });
            }
            const link = await stripeConnect_1.stripeConnectService.createAccountLink(user.stripeConnectAccountId);
            return reply.send({ success: true, url: link.url });
        }
        catch (error) {
            server.log.error(error, 'Failed to get refresh link');
            return reply.status(500).send({
                success: false,
                error: error.message || 'Erro ao obter link de onboarding',
            });
        }
    });
    server.get('/stripe/connect/return', async (request, reply) => {
        try {
            const accountId = request.query.account_id;
            const status = await stripeConnect_1.stripeConnectService.getAccountStatus(accountId);
            const user = await database_1.prisma.user.findFirst({
                where: { stripeConnectAccountId: accountId },
            });
            if (user) {
                let verificationStatus = 'PENDING';
                if (status.verified)
                    verificationStatus = 'VERIFIED';
                else if (status.status === 'processing')
                    verificationStatus = 'PROCESSING';
                else if (status.status === 'requires_action')
                    verificationStatus = 'REQUIRES_ACTION';
                else if (status.status === 'failed')
                    verificationStatus = 'FAILED';
                await database_1.prisma.user.update({
                    where: { id: user.id },
                    data: {
                        stripeVerificationStatus: verificationStatus,
                        stripeVerifiedAt: status.verified ? new Date() : null,
                    },
                });
            }
            const baseUrl = getBaseUrl();
            return reply.redirect(`${baseUrl}/profile?stripe_connected=true&verified=${status.verified}`);
        }
        catch (error) {
            server.log.error(error, 'Failed to process return from Stripe');
            const baseUrl = getBaseUrl();
            return reply.redirect(`${baseUrl}/profile?stripe_error=true`);
        }
    });
    server.get('/stripe/connect/dashboard', {
        preHandler: [server.authenticate],
    }, async (request, reply) => {
        try {
            const user = await database_1.prisma.user.findUnique({
                where: { id: request.user.id },
            });
            if (!user?.stripeConnectAccountId) {
                return reply.status(400).send({
                    success: false,
                    error: 'Conta Stripe Connect não encontrada',
                });
            }
            const url = await stripeConnect_1.stripeConnectService.createLoginLink(user.stripeConnectAccountId);
            return reply.send({ success: true, url });
        }
        catch (error) {
            server.log.error(error, 'Failed to create dashboard link');
            return reply.status(500).send({
                success: false,
                error: error.message || 'Erro ao acessar dashboard',
            });
        }
    });
    server.get('/stripe/split-configs', async (request, reply) => {
        return reply.send({
            success: true,
            configs: splitPayments_1.SPLIT_CONFIGS,
        });
    });
    server.post('/stripe/create-payment', {
        preHandler: [server.authenticate],
    }, async (request, reply) => {
        try {
            const { amount, transactionType, destinationUserId, productName, productDescription, bookingId, foodOrderId } = request.body;
            const destinationUser = await database_1.prisma.user.findUnique({
                where: { id: destinationUserId },
            });
            if (!destinationUser?.stripeConnectAccountId) {
                return reply.status(400).send({
                    success: false,
                    error: 'Destinatário não possui conta Stripe Connect',
                });
            }
            const status = await stripeConnect_1.stripeConnectService.getAccountStatus(destinationUser.stripeConnectAccountId);
            if (!status.chargesEnabled) {
                return reply.status(400).send({
                    success: false,
                    error: 'Conta do destinatário não está habilitada para receber pagamentos',
                });
            }
            const payer = await database_1.prisma.user.findUnique({
                where: { id: request.user.id },
            });
            const baseUrl = getBaseUrl();
            const result = await splitPayments_1.splitPaymentService.createCheckoutSession({
                amount: amount * 100,
                transactionType: splitPayments_1.TransactionType[transactionType],
                destinationAccountId: destinationUser.stripeConnectAccountId,
                successUrl: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
                cancelUrl: `${baseUrl}/payment/cancel`,
                customerEmail: payer?.email,
                productName,
                productDescription,
                metadata: {
                    payer_id: request.user.id,
                    destination_user_id: destinationUserId,
                    booking_id: bookingId || '',
                    food_order_id: foodOrderId || '',
                },
            });
            return reply.send({
                success: true,
                sessionId: result.sessionId,
                checkoutUrl: result.url,
                split: splitPayments_1.splitPaymentService.calculateSplit(amount * 100, splitPayments_1.TransactionType[transactionType]),
            });
        }
        catch (error) {
            server.log.error(error, 'Failed to create payment');
            return reply.status(500).send({
                success: false,
                error: error.message || 'Erro ao criar pagamento',
            });
        }
    });
    server.post('/stripe/webhook', async (request, reply) => {
        try {
            const signature = request.headers['stripe-signature'];
            if (!signature) {
                return reply.status(400).send({ error: 'Missing stripe-signature' });
            }
            const rawBody = request.body;
            if (!Buffer.isBuffer(rawBody)) {
                server.log.error('Webhook body is not a Buffer');
                return reply.status(400).send({ error: 'Invalid body format' });
            }
            const sig = Array.isArray(signature) ? signature[0] : signature;
            await webhookHandlers_1.WebhookHandlers.processWebhook(rawBody, sig);
            return reply.status(200).send({ received: true });
        }
        catch (error) {
            server.log.error(error, 'Webhook error');
            return reply.status(400).send({ error: 'Webhook processing error' });
        }
    });
    server.get('/stripe/balance', {
        preHandler: [server.authenticate],
    }, async (request, reply) => {
        try {
            const user = await database_1.prisma.user.findUnique({
                where: { id: request.user.id },
            });
            if (!user?.stripeConnectAccountId) {
                return reply.status(400).send({
                    success: false,
                    error: 'Conta Stripe Connect não encontrada',
                });
            }
            const balance = await splitPayments_1.splitPaymentService.getBalance(user.stripeConnectAccountId);
            const transfers = await splitPayments_1.splitPaymentService.listTransfers(user.stripeConnectAccountId, 5);
            return reply.send({
                success: true,
                balance: {
                    available: balance.available,
                    pending: balance.pending,
                },
                recentTransfers: transfers.map(t => ({
                    id: t.id,
                    amount: t.amount,
                    currency: t.currency,
                    created: new Date(t.created * 1000),
                })),
            });
        }
        catch (error) {
            server.log.error(error, 'Failed to get balance');
            return reply.status(500).send({
                success: false,
                error: error.message || 'Erro ao obter saldo',
            });
        }
    });
}
