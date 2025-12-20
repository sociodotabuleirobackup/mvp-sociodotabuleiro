import type Stripe from 'stripe';
export interface ConnectAccountData {
    email: string;
    businessType: 'individual' | 'company';
    country: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    cpf?: string;
    cnpj?: string;
}
export interface OnboardingResult {
    accountId: string;
    onboardingUrl: string;
}
export declare class StripeConnectService {
    createConnectedAccount(data: ConnectAccountData): Promise<OnboardingResult>;
    createAccountLink(accountId: string): Promise<Stripe.AccountLink>;
    getAccountStatus(accountId: string): Promise<{
        verified: boolean;
        status: 'pending' | 'processing' | 'verified' | 'failed' | 'requires_action';
        requirements: string[];
        chargesEnabled: boolean;
        payoutsEnabled: boolean;
    }>;
    createLoginLink(accountId: string): Promise<string>;
    deleteAccount(accountId: string): Promise<void>;
}
export declare const stripeConnectService: StripeConnectService;
