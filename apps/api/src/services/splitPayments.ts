import { getStripeClient } from './stripeClient';
import type Stripe from 'stripe';

export enum TransactionType {
  TABLE_RESERVATION = 'TABLE_RESERVATION',
  RPG_SESSION = 'RPG_SESSION',
  FOOD_ORDER = 'FOOD_ORDER',
}

export interface SplitConfig {
  platformPercentage: number;
  destinationPercentage: number;
  description: string;
}

export const SPLIT_CONFIGS: Record<TransactionType, SplitConfig> = {
  [TransactionType.TABLE_RESERVATION]: {
    platformPercentage: 10,
    destinationPercentage: 90,
    description: 'Reserva de mesa física - 90% Loja, 10% Sócio do Tabuleiro',
  },
  [TransactionType.RPG_SESSION]: {
    platformPercentage: 15,
    destinationPercentage: 85,
    description: 'Sessão de RPG - 85% Mestre, 15% Sócio do Tabuleiro',
  },
  [TransactionType.FOOD_ORDER]: {
    platformPercentage: 5,
    destinationPercentage: 95,
    description: 'Venda de comida - 95% Loja, 5% Sócio do Tabuleiro',
  },
};

export interface CreatePaymentParams {
  amount: number;
  currency?: string;
  destinationAccountId: string;
  transactionType: TransactionType;
  customerId?: string;
  paymentMethodId?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  paymentIntentId: string;
  clientSecret: string | null;
  status: string;
  platformFee: number;
  destinationAmount: number;
}

export class SplitPaymentService {
  calculateSplit(amount: number, transactionType: TransactionType): {
    platformFee: number;
    destinationAmount: number;
  } {
    const config = SPLIT_CONFIGS[transactionType];
    const platformFee = Math.round((amount * config.platformPercentage) / 100);
    const destinationAmount = amount - platformFee;

    return {
      platformFee,
      destinationAmount,
    };
  }

  async createPaymentIntent(params: CreatePaymentParams): Promise<PaymentResult> {
    const stripe = await getStripeClient();
    const config = SPLIT_CONFIGS[params.transactionType];
    const { platformFee, destinationAmount } = this.calculateSplit(
      params.amount,
      params.transactionType
    );

    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: params.amount,
      currency: params.currency || 'brl',
      application_fee_amount: platformFee,
      transfer_data: {
        destination: params.destinationAccountId,
      },
      metadata: {
        transaction_type: params.transactionType,
        platform_fee: platformFee.toString(),
        destination_amount: destinationAmount.toString(),
        split_config: config.description,
        ...params.metadata,
      },
      description: params.description || config.description,
    };

    if (params.customerId) {
      paymentIntentParams.customer = params.customerId;
    }

    if (params.paymentMethodId) {
      paymentIntentParams.payment_method = params.paymentMethodId;
      paymentIntentParams.confirm = true;
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    return {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status,
      platformFee,
      destinationAmount,
    };
  }

  async createCheckoutSession(params: {
    amount: number;
    transactionType: TransactionType;
    destinationAccountId: string;
    successUrl: string;
    cancelUrl: string;
    customerEmail?: string;
    productName: string;
    productDescription?: string;
    metadata?: Record<string, string>;
  }): Promise<{ sessionId: string; url: string }> {
    const stripe = await getStripeClient();
    const config = SPLIT_CONFIGS[params.transactionType];
    const { platformFee } = this.calculateSplit(params.amount, params.transactionType);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto', 'pix'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: params.productName,
              description: params.productDescription,
            },
            unit_amount: params.amount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: platformFee,
        transfer_data: {
          destination: params.destinationAccountId,
        },
        metadata: {
          transaction_type: params.transactionType,
          platform_fee: platformFee.toString(),
          split_config: config.description,
          ...params.metadata,
        },
      },
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer_email: params.customerEmail,
      metadata: {
        transaction_type: params.transactionType,
        ...params.metadata,
      },
    });

    return {
      sessionId: session.id,
      url: session.url!,
    };
  }

  async refundPayment(
    paymentIntentId: string,
    amount?: number,
    reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
  ): Promise<Stripe.Refund> {
    const stripe = await getStripeClient();
    
    const refundParams: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
      reason,
      refund_application_fee: true,
      reverse_transfer: true,
    };

    if (amount) {
      refundParams.amount = amount;
    }

    return stripe.refunds.create(refundParams);
  }

  async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    const stripe = await getStripeClient();
    return stripe.paymentIntents.retrieve(paymentIntentId);
  }

  async listTransfers(accountId: string, limit = 10): Promise<Stripe.Transfer[]> {
    const stripe = await getStripeClient();
    const transfers = await stripe.transfers.list({
      destination: accountId,
      limit,
    });
    return transfers.data;
  }

  async getBalance(accountId: string): Promise<Stripe.Balance> {
    const stripe = await getStripeClient();
    return stripe.balance.retrieve({
      stripeAccount: accountId,
    });
  }
}

export const splitPaymentService = new SplitPaymentService();
