import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { stripeConnectService } from '../services/stripeConnect';
import { splitPaymentService, TransactionType, SPLIT_CONFIGS } from '../services/splitPayments';
import { WebhookHandlers } from '../services/webhookHandlers';
import { prisma } from '@socio-do-tabuleiro/database';

function getBaseUrl(): string {
  if (process.env.REPLIT_DOMAINS) {
    return `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`;
  }
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }
  return process.env.BASE_URL || 'http://localhost:5000';
}

interface CreateAccountBody {
  businessType: 'individual' | 'company';
  firstName?: string;
  lastName?: string;
  companyName?: string;
  cpf?: string;
  cnpj?: string;
}

interface CreatePaymentBody {
  amount: number;
  transactionType: 'TABLE_RESERVATION' | 'RPG_SESSION' | 'FOOD_ORDER';
  destinationUserId: string;
  productName: string;
  productDescription?: string;
  bookingId?: string;
  foodOrderId?: string;
}

export async function stripeConnectRoutes(server: FastifyInstance) {
  server.post('/stripe/connect/create-account', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest<{ Body: CreateAccountBody }>, reply: FastifyReply) => {
    try {
      const user = request.user;
      const body = request.body;

      const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (existingUser?.stripeConnectAccountId) {
        const link = await stripeConnectService.createAccountLink(existingUser.stripeConnectAccountId);
        return reply.send({
          success: true,
          accountId: existingUser.stripeConnectAccountId,
          onboardingUrl: link.url,
          message: 'Conta existente - redirecionando para completar onboarding',
        });
      }

      const result = await stripeConnectService.createConnectedAccount({
        email: user.email,
        businessType: body.businessType,
        country: 'BR',
        firstName: body.firstName,
        lastName: body.lastName,
        companyName: body.companyName,
        cpf: body.cpf,
        cnpj: body.cnpj,
      });

      await prisma.user.update({
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
    } catch (error: any) {
      server.log.error(error, 'Failed to create Stripe Connect account');
      return reply.status(500).send({
        success: false,
        error: error.message || 'Erro ao criar conta Stripe Connect',
      });
    }
  });

  server.get('/stripe/connect/status', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: request.user.id },
      });

      if (!user?.stripeConnectAccountId) {
        return reply.send({
          success: true,
          hasAccount: false,
          status: null,
        });
      }

      const status = await stripeConnectService.getAccountStatus(user.stripeConnectAccountId);

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
    } catch (error: any) {
      server.log.error(error, 'Failed to get Stripe Connect status');
      return reply.status(500).send({
        success: false,
        error: error.message || 'Erro ao obter status da conta',
      });
    }
  });

  server.get('/stripe/connect/refresh', async (request: FastifyRequest<{ Querystring: { account_id: string } }>, reply: FastifyReply) => {
    try {
      const accountId = request.query.account_id;
      const link = await stripeConnectService.createAccountLink(accountId);
      return reply.redirect(link.url);
    } catch (error: any) {
      server.log.error(error, 'Failed to refresh onboarding link');
      return reply.status(500).send({ error: 'Erro ao renovar link de onboarding' });
    }
  });

  server.get('/stripe/connect/refresh-link', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: request.user.id },
      });

      if (!user?.stripeConnectAccountId) {
        return reply.status(400).send({
          success: false,
          error: 'Conta Stripe Connect não encontrada',
        });
      }

      const link = await stripeConnectService.createAccountLink(user.stripeConnectAccountId);
      return reply.send({ success: true, url: link.url });
    } catch (error: any) {
      server.log.error(error, 'Failed to get refresh link');
      return reply.status(500).send({
        success: false,
        error: error.message || 'Erro ao obter link de onboarding',
      });
    }
  });

  server.get('/stripe/connect/return', async (request: FastifyRequest<{ Querystring: { account_id: string } }>, reply: FastifyReply) => {
    try {
      const accountId = request.query.account_id;
      const status = await stripeConnectService.getAccountStatus(accountId);

      const user = await prisma.user.findFirst({
        where: { stripeConnectAccountId: accountId },
      });

      if (user) {
        let verificationStatus: any = 'PENDING';
        if (status.verified) verificationStatus = 'VERIFIED';
        else if (status.status === 'processing') verificationStatus = 'PROCESSING';
        else if (status.status === 'requires_action') verificationStatus = 'REQUIRES_ACTION';
        else if (status.status === 'failed') verificationStatus = 'FAILED';

        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripeVerificationStatus: verificationStatus,
            stripeVerifiedAt: status.verified ? new Date() : null,
          },
        });
      }

      const baseUrl = getBaseUrl();
      return reply.redirect(`${baseUrl}/profile?stripe_connected=true&verified=${status.verified}`);
    } catch (error: any) {
      server.log.error(error, 'Failed to process return from Stripe');
      const baseUrl = getBaseUrl();
      return reply.redirect(`${baseUrl}/profile?stripe_error=true`);
    }
  });

  server.get('/stripe/connect/dashboard', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: request.user.id },
      });

      if (!user?.stripeConnectAccountId) {
        return reply.status(400).send({
          success: false,
          error: 'Conta Stripe Connect não encontrada',
        });
      }

      const url = await stripeConnectService.createLoginLink(user.stripeConnectAccountId);
      return reply.send({ success: true, url });
    } catch (error: any) {
      server.log.error(error, 'Failed to create dashboard link');
      return reply.status(500).send({
        success: false,
        error: error.message || 'Erro ao acessar dashboard',
      });
    }
  });

  server.get('/stripe/split-configs', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      success: true,
      configs: SPLIT_CONFIGS,
    });
  });

  server.post('/stripe/create-payment', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest<{ Body: CreatePaymentBody }>, reply: FastifyReply) => {
    try {
      const { amount, transactionType, destinationUserId, productName, productDescription, bookingId, foodOrderId } = request.body;

      const destinationUser = await prisma.user.findUnique({
        where: { id: destinationUserId },
      });

      if (!destinationUser?.stripeConnectAccountId) {
        return reply.status(400).send({
          success: false,
          error: 'Destinatário não possui conta Stripe Connect',
        });
      }

      const status = await stripeConnectService.getAccountStatus(destinationUser.stripeConnectAccountId);
      if (!status.chargesEnabled) {
        return reply.status(400).send({
          success: false,
          error: 'Conta do destinatário não está habilitada para receber pagamentos',
        });
      }

      const payer = await prisma.user.findUnique({
        where: { id: request.user.id },
      });

      const baseUrl = getBaseUrl();

      const result = await splitPaymentService.createCheckoutSession({
        amount: amount * 100,
        transactionType: TransactionType[transactionType as keyof typeof TransactionType],
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
        split: splitPaymentService.calculateSplit(amount * 100, TransactionType[transactionType as keyof typeof TransactionType]),
      });
    } catch (error: any) {
      server.log.error(error, 'Failed to create payment');
      return reply.status(500).send({
        success: false,
        error: error.message || 'Erro ao criar pagamento',
      });
    }
  });

  server.post('/stripe/webhook', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const signature = request.headers['stripe-signature'];
      if (!signature) {
        return reply.status(400).send({ error: 'Missing stripe-signature' });
      }

      const rawBody = request.body as Buffer;
      if (!Buffer.isBuffer(rawBody)) {
        server.log.error('Webhook body is not a Buffer');
        return reply.status(400).send({ error: 'Invalid body format' });
      }

      const sig = Array.isArray(signature) ? signature[0] : signature;
      await WebhookHandlers.processWebhook(rawBody, sig);

      return reply.status(200).send({ received: true });
    } catch (error: any) {
      server.log.error(error, 'Webhook error');
      return reply.status(400).send({ error: 'Webhook processing error' });
    }
  });

  server.get('/stripe/balance', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: request.user.id },
      });

      if (!user?.stripeConnectAccountId) {
        return reply.status(400).send({
          success: false,
          error: 'Conta Stripe Connect não encontrada',
        });
      }

      const balance = await splitPaymentService.getBalance(user.stripeConnectAccountId);
      const transfers = await splitPaymentService.listTransfers(user.stripeConnectAccountId, 5);

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
    } catch (error: any) {
      server.log.error(error, 'Failed to get balance');
      return reply.status(500).send({
        success: false,
        error: error.message || 'Erro ao obter saldo',
      });
    }
  });
}
