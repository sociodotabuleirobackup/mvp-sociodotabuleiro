"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookHandlers = void 0;
const stripeClient_1 = require("./stripeClient");
const database_1 = require("@socio-do-tabuleiro/database");
class WebhookHandlers {
    static async processWebhook(payload, signature) {
        if (!Buffer.isBuffer(payload)) {
            throw new Error('STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
                'Received type: ' + typeof payload + '. ' +
                'This usually means the body was parsed before reaching this handler.');
        }
        try {
            const sync = await (0, stripeClient_1.getStripeSync)();
            await sync.processWebhook(payload, signature);
        }
        catch (syncError) {
            console.warn('StripeSync not available, processing webhook manually:', syncError.message);
            const stripe = await (0, stripeClient_1.getStripeClient)();
            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
            if (!webhookSecret) {
                throw new Error('STRIPE_WEBHOOK_SECRET not configured for manual webhook processing');
            }
            const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
            switch (event.type) {
                case 'account.updated':
                    await WebhookHandlers.handleAccountUpdated(event);
                    break;
                case 'payment_intent.succeeded':
                    await WebhookHandlers.handlePaymentIntentSucceeded(event);
                    break;
                case 'payment_intent.payment_failed':
                    await WebhookHandlers.handlePaymentIntentFailed(event);
                    break;
                case 'charge.refunded':
                    await WebhookHandlers.handleRefundCreated(event);
                    break;
                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }
        }
    }
    static async handleAccountUpdated(event) {
        const account = event.data.object;
        const accountId = account.id;
        let verificationStatus = 'PENDING';
        if (account.charges_enabled && account.payouts_enabled) {
            verificationStatus = 'VERIFIED';
        }
        else if (account.requirements?.currently_due?.length) {
            verificationStatus = 'REQUIRES_ACTION';
        }
        else if (account.requirements?.pending_verification?.length) {
            verificationStatus = 'PROCESSING';
        }
        else if (account.requirements?.disabled_reason) {
            verificationStatus = 'FAILED';
        }
        const user = await database_1.prisma.user.findFirst({
            where: { stripeConnectAccountId: accountId },
        });
        if (user) {
            await database_1.prisma.user.update({
                where: { id: user.id },
                data: {
                    stripeVerificationStatus: verificationStatus,
                    stripeVerifiedAt: verificationStatus === 'VERIFIED' ? new Date() : null,
                },
            });
            if (verificationStatus === 'VERIFIED') {
                await database_1.prisma.notification.create({
                    data: {
                        userId: user.id,
                        title: 'Conta Verificada!',
                        message: 'Sua conta foi verificada com sucesso. Você já pode receber pagamentos.',
                        type: 'SYSTEM',
                    },
                });
            }
            else if (verificationStatus === 'REQUIRES_ACTION') {
                await database_1.prisma.notification.create({
                    data: {
                        userId: user.id,
                        title: 'Ação Necessária',
                        message: 'Sua conta precisa de informações adicionais para ser verificada.',
                        type: 'SYSTEM',
                    },
                });
            }
        }
    }
    static async handlePaymentIntentSucceeded(event) {
        const paymentIntent = event.data.object;
        const metadata = paymentIntent.metadata;
        if (metadata.booking_id) {
            await database_1.prisma.booking.update({
                where: { id: metadata.booking_id },
                data: {
                    status: 'CONFIRMED',
                    paymentId: paymentIntent.id,
                    amount: paymentIntent.amount / 100,
                },
            });
            await database_1.prisma.payment.create({
                data: {
                    bookingId: metadata.booking_id,
                    amount: paymentIntent.amount / 100,
                    currency: paymentIntent.currency.toUpperCase(),
                    status: 'COMPLETED',
                    method: 'CREDIT_CARD',
                    externalId: paymentIntent.id,
                    description: metadata.split_config || 'Pagamento via Stripe',
                },
            });
        }
        if (metadata.food_order_id) {
            await database_1.prisma.foodOrder.update({
                where: { id: metadata.food_order_id },
                data: { status: 'PENDING' },
            });
        }
    }
    static async handlePaymentIntentFailed(event) {
        const paymentIntent = event.data.object;
        const metadata = paymentIntent.metadata;
        if (metadata.booking_id) {
            await database_1.prisma.payment.create({
                data: {
                    bookingId: metadata.booking_id,
                    amount: paymentIntent.amount / 100,
                    currency: paymentIntent.currency.toUpperCase(),
                    status: 'FAILED',
                    method: 'CREDIT_CARD',
                    externalId: paymentIntent.id,
                    description: `Falha: ${paymentIntent.last_payment_error?.message || 'Erro desconhecido'}`,
                },
            });
        }
    }
    static async handleRefundCreated(event) {
        const refund = event.data.object;
        if (refund.payment_intent && typeof refund.payment_intent === 'string') {
            const payment = await database_1.prisma.payment.findFirst({
                where: { externalId: refund.payment_intent },
                include: { booking: true },
            });
            if (payment?.booking) {
                await database_1.prisma.booking.update({
                    where: { id: payment.booking.id },
                    data: { status: 'REFUNDED' },
                });
                await database_1.prisma.payment.create({
                    data: {
                        bookingId: payment.booking.id,
                        amount: -(refund.amount / 100),
                        currency: refund.currency.toUpperCase(),
                        status: 'COMPLETED',
                        method: 'CREDIT_CARD',
                        externalId: refund.id,
                        description: 'Reembolso',
                    },
                });
            }
        }
    }
}
exports.WebhookHandlers = WebhookHandlers;
