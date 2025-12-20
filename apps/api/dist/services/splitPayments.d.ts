import type Stripe from 'stripe';
export declare enum TransactionType {
    TABLE_RESERVATION = "TABLE_RESERVATION",
    RPG_SESSION = "RPG_SESSION",
    FOOD_ORDER = "FOOD_ORDER"
}
export interface SplitConfig {
    platformPercentage: number;
    destinationPercentage: number;
    description: string;
}
export declare const SPLIT_CONFIGS: Record<TransactionType, SplitConfig>;
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
export declare class SplitPaymentService {
    calculateSplit(amount: number, transactionType: TransactionType): {
        platformFee: number;
        destinationAmount: number;
    };
    createPaymentIntent(params: CreatePaymentParams): Promise<PaymentResult>;
    createCheckoutSession(params: {
        amount: number;
        transactionType: TransactionType;
        destinationAccountId: string;
        successUrl: string;
        cancelUrl: string;
        customerEmail?: string;
        productName: string;
        productDescription?: string;
        metadata?: Record<string, string>;
    }): Promise<{
        sessionId: string;
        url: string;
    }>;
    refundPayment(paymentIntentId: string, amount?: number, reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'): Promise<Stripe.Refund>;
    getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent>;
    listTransfers(accountId: string, limit?: number): Promise<Stripe.Transfer[]>;
    getBalance(accountId: string): Promise<Stripe.Balance>;
}
export declare const splitPaymentService: SplitPaymentService;
