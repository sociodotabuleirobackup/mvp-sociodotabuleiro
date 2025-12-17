
import { ContractStatus } from '../types';

/**
 * Service Stub for ZapSign (Digital Contracts)
 * Documentation: https://docs.zapsign.com.br/
 */

export interface Signer {
  name: string;
  email: string;
}

export interface ContractResponse {
  docId: string;
  signUrl: string;
  status: ContractStatus;
}

class ZapSignService {
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Gera o Pacto de Fundador ou Termo de Uso da Loja
  async createFounderPact(signer: Signer): Promise<ContractResponse> {
    await this.delay(1000);
    console.log(`[ZapSign] Founder Pact generated for ${signer.email}`);
    
    return {
      docId: `doc_${Math.random().toString(36).substr(2, 9)}`,
      signUrl: 'https://app.zapsign.com.br/verificar/mock-doc',
      status: ContractStatus.PENDING_SIGNATURE
    };
  }

  // Verificar status
  async checkStatus(docId: string): Promise<ContractStatus> {
    await this.delay(400);
    // Randomly return SIGNED for testing purposes
    const isSigned = Math.random() > 0.7;
    return isSigned ? ContractStatus.SIGNED : ContractStatus.PENDING_SIGNATURE;
  }

  // Reenviar link por email
  async resendLink(docId: string): Promise<boolean> {
    await this.delay(500);
    console.log(`[ZapSign] Link resent for document ${docId}`);
    return true;
  }
}

export const zapsign = new ZapSignService();
