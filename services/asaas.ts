
import { PaymentStatus } from '../types';

/**
 * Service Stub for Asaas (Payments & Wallet)
 * Documentation: https://docs.asaas.com/
 */

export interface SplitConfig {
  walletId: string;
  fixedValue?: number;
  percentualValue?: number;
}

export interface ChargeRequest {
  customer: string; // Customer ID
  billingType: 'PIX' | 'CREDIT_CARD';
  value: number;
  dueDate: string;
  splits?: SplitConfig[];
}

export interface ChargeResponse {
  id: string;
  invoiceUrl: string;
  status: PaymentStatus;
}

class AsaasService {
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Criar cliente no Asaas vinculado ao usuário do app
  async createCustomer(name: string, email: string, cpfCnpj: string): Promise<string> {
    await this.delay(500);
    console.log(`[Asaas] Customer created for ${email}`);
    return `cus_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Cobrança Única (Sessão)
  async createCharge(data: ChargeRequest): Promise<ChargeResponse> {
    await this.delay(800);
    console.log(`[Asaas] Charge created: R$ ${data.value} via ${data.billingType}`, data.splits ? `(With Split)` : '');
    
    return {
      id: `pay_${Math.random().toString(36).substr(2, 9)}`,
      invoiceUrl: 'https://sandbox.asaas.com/i/mock-invoice',
      status: PaymentStatus.PENDING
    };
  }

  // Assinatura (Premium)
  async createSubscription(customerId: string, planId: 'PREMIUM_MASTER' | 'PREMIUM_VENUE'): Promise<string> {
    await this.delay(600);
    console.log(`[Asaas] Subscription ${planId} created for ${customerId}`);
    return `sub_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Saldo da Carteira Digital (Mock do Ledger)
  async getWalletBalance(userId: string): Promise<number> {
    await this.delay(300);
    // In a real scenario, this would query the internal Ledger collection, 
    // but Asaas also has endpoint /finance/balance
    return Math.floor(Math.random() * 500); 
  }
}

export const asaas = new AsaasService();
