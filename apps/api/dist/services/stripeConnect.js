"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeConnectService = exports.StripeConnectService = void 0;
const stripeClient_1 = require("./stripeClient");
function getBaseUrl() {
    if (process.env.REPLIT_DOMAINS) {
        return `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`;
    }
    if (process.env.REPLIT_DEV_DOMAIN) {
        return `https://${process.env.REPLIT_DEV_DOMAIN}`;
    }
    return process.env.BASE_URL || 'http://localhost:5000';
}
class StripeConnectService {
    async createConnectedAccount(data) {
        const stripe = await (0, stripeClient_1.getStripeClient)();
        const accountParams = {
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
        }
        else if (data.businessType === 'company' && data.companyName) {
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
    async createAccountLink(accountId) {
        const stripe = await (0, stripeClient_1.getStripeClient)();
        const baseUrl = getBaseUrl();
        return stripe.accountLinks.create({
            account: accountId,
            refresh_url: `${baseUrl}/api/stripe/connect/refresh?account_id=${accountId}`,
            return_url: `${baseUrl}/api/stripe/connect/return?account_id=${accountId}`,
            type: 'account_onboarding',
        });
    }
    async getAccountStatus(accountId) {
        const stripe = await (0, stripeClient_1.getStripeClient)();
        const account = await stripe.accounts.retrieve(accountId);
        let status = 'pending';
        if (account.charges_enabled && account.payouts_enabled) {
            status = 'verified';
        }
        else if (account.requirements?.currently_due?.length) {
            status = 'requires_action';
        }
        else if (account.requirements?.pending_verification?.length) {
            status = 'processing';
        }
        else if (account.requirements?.disabled_reason) {
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
    async createLoginLink(accountId) {
        const stripe = await (0, stripeClient_1.getStripeClient)();
        const loginLink = await stripe.accounts.createLoginLink(accountId);
        return loginLink.url;
    }
    async deleteAccount(accountId) {
        const stripe = await (0, stripeClient_1.getStripeClient)();
        await stripe.accounts.del(accountId);
    }
}
exports.StripeConnectService = StripeConnectService;
exports.stripeConnectService = new StripeConnectService();
