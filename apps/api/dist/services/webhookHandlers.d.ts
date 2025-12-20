import type Stripe from 'stripe';
export declare class WebhookHandlers {
    static processWebhook(payload: Buffer, signature: string): Promise<void>;
    static handleAccountUpdated(event: Stripe.Event): Promise<void>;
    static handlePaymentIntentSucceeded(event: Stripe.Event): Promise<void>;
    static handlePaymentIntentFailed(event: Stripe.Event): Promise<void>;
    static handleRefundCreated(event: Stripe.Event): Promise<void>;
}
