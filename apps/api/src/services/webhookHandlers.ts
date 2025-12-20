import { getStripeSync, getStripeClient } from './stripeClient';
import { prisma } from '@socio-do-tabuleiro/database';
import type Stripe from 'stripe';

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'This usually means the body was parsed before reaching this handler.'
      );
    }

    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature);
  }

  static async handleAccountUpdated(event: Stripe.Event): Promise<void> {
    const account = event.data.object as Stripe.Account;
    const accountId = account.id;

    let verificationStatus: 'PENDING' | 'PROCESSING' | 'VERIFIED' | 'FAILED' | 'REQUIRES_ACTION' = 'PENDING';
    
    if (account.charges_enabled && account.payouts_enabled) {
      verificationStatus = 'VERIFIED';
    } else if (account.requirements?.currently_due?.length) {
      verificationStatus = 'REQUIRES_ACTION';
    } else if (account.requirements?.pending_verification?.length) {
      verificationStatus = 'PROCESSING';
    } else if (account.requirements?.disabled_reason) {
      verificationStatus = 'FAILED';
    }

    const user = await prisma.user.findFirst({
      where: { stripeConnectAccountId: accountId },
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripeVerificationStatus: verificationStatus,
          stripeVerifiedAt: verificationStatus === 'VERIFIED' ? new Date() : null,
        },
      });

      if (verificationStatus === 'VERIFIED') {
        await prisma.notification.create({
          data: {
            userId: user.id,
            title: 'Conta Verificada!',
            message: 'Sua conta foi verificada com sucesso. Você já pode receber pagamentos.',
            type: 'SYSTEM',
          },
        });
      } else if (verificationStatus === 'REQUIRES_ACTION') {
        await prisma.notification.create({
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

  static async handlePaymentIntentSucceeded(event: Stripe.Event): Promise<void> {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const metadata = paymentIntent.metadata;

    if (metadata.booking_id) {
      await prisma.booking.update({
        where: { id: metadata.booking_id },
        data: {
          status: 'CONFIRMED',
          paymentId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
        },
      });

      await prisma.payment.create({
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
      await prisma.foodOrder.update({
        where: { id: metadata.food_order_id },
        data: { status: 'PENDING' },
      });
    }
  }

  static async handlePaymentIntentFailed(event: Stripe.Event): Promise<void> {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const metadata = paymentIntent.metadata;

    if (metadata.booking_id) {
      await prisma.payment.create({
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

  static async handleRefundCreated(event: Stripe.Event): Promise<void> {
    const refund = event.data.object as Stripe.Refund;
    
    if (refund.payment_intent && typeof refund.payment_intent === 'string') {
      const payment = await prisma.payment.findFirst({
        where: { externalId: refund.payment_intent },
        include: { booking: true },
      });

      if (payment?.booking) {
        await prisma.booking.update({
          where: { id: payment.booking.id },
          data: { status: 'REFUNDED' },
        });

        await prisma.payment.create({
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
