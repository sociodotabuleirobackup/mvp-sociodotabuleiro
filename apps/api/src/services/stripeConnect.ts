import { getStripeClient } from './stripeClient';
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

export class StripeConnectService {
  async createConnectedAccount(data: ConnectAccountData): Promise<OnboardingResult> {
    const stripe = await getStripeClient();
    
    const accountParams: Stripe.AccountCreateParams = {
      type: 'express',
      country: data.country || 'BR',
      email: data.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: data.businessType,
      metadata: {
        platform: 'socio_do_tabuleiro',
      },
    };

    if (data.businessType === 'individual' && data.firstName && data.lastName) {
      accountParams.individual = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
      };
      if (data.cpf) {
        accountParams.individual.id_number = data.cpf.replace(/\D/g, '');
      }
    } else if (data.businessType === 'company' && data.companyName) {
      accountParams.company = {
        name: data.companyName,
      };
      if (data.cnpj) {
        accountParams.company.tax_id = data.cnpj.replace(/\D/g, '');
      }
    }

    const account = await stripe.accounts.create(accountParams);

    const accountLink = await this.createAccountLink(account.id);

    return {
      accountId: account.id,
      onboardingUrl: accountLink.url,
    };
  }

  async createAccountLink(accountId: string): Promise<Stripe.AccountLink> {
    const stripe = await getStripeClient();
    const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;

    return stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${baseUrl}/api/stripe/connect/refresh?account_id=${accountId}`,
      return_url: `${baseUrl}/api/stripe/connect/return?account_id=${accountId}`,
      type: 'account_onboarding',
    });
  }

  async getAccountStatus(accountId: string): Promise<{
    verified: boolean;
    status: 'pending' | 'processing' | 'verified' | 'failed' | 'requires_action';
    requirements: string[];
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
  }> {
    const stripe = await getStripeClient();
    const account = await stripe.accounts.retrieve(accountId);

    let status: 'pending' | 'processing' | 'verified' | 'failed' | 'requires_action' = 'pending';
    
    if (account.charges_enabled && account.payouts_enabled) {
      status = 'verified';
    } else if (account.requirements?.currently_due?.length) {
      status = 'requires_action';
    } else if (account.requirements?.pending_verification?.length) {
      status = 'processing';
    } else if (account.requirements?.disabled_reason) {
      status = 'failed';
    }

    return {
      verified: status === 'verified',
      status,
      requirements: account.requirements?.currently_due || [],
      chargesEnabled: account.charges_enabled || false,
      payoutsEnabled: account.payouts_enabled || false,
    };
  }

  async createLoginLink(accountId: string): Promise<string> {
    const stripe = await getStripeClient();
    const loginLink = await stripe.accounts.createLoginLink(accountId);
    return loginLink.url;
  }

  async deleteAccount(accountId: string): Promise<void> {
    const stripe = await getStripeClient();
    await stripe.accounts.del(accountId);
  }
}

export const stripeConnectService = new StripeConnectService();
