import Stripe from 'stripe';
export declare function getStripeClient(): Promise<Stripe>;
export declare function getStripePublishableKey(): Promise<string>;
export declare function getStripeSecretKey(): Promise<string>;
export declare function getStripeSync(): Promise<any>;
