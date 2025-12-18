import { Session, Booking, BookingStatus } from '@socio-do-tabuleiro/shared';

/**
 * Data Access Layer Stub
 * Adaptado para interagir com Prisma/Supabase no futuro.
 */

class Repository {
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // --- Sessions ---

  async createSession(session: Omit<Session, 'id'>): Promise<string> {
    await this.delay(500);
    console.log(`[Repo] Criando sessão no banco de dados relacional`, session);
    return `sess_${Math.random().toString(36).substring(2, 11)}`;
  }

  async getSessions(_filter?: any): Promise<Session[]> {
    await this.delay(300);
    return [];
  }

  // --- Bookings ---

  async createBooking(
    booking: Omit<Booking, 'id' | 'status' | 'createdAt'>
  ): Promise<string> {
    await this.delay(500);
    console.log(`[Repo] Criando reserva (booking)`, booking);
    return `book_${Math.random().toString(36).substring(2, 11)}`;
  }

  async updateBookingStatus(
    bookingId: string,
    status: BookingStatus
  ): Promise<void> {
    await this.delay(300);
    console.log(`[Repo] Atualizando reserva ${bookingId} para ${status}`);
  }

  // --- Marketplace ---

  async purchaseAsset(userId: string, assetId: string): Promise<boolean> {
    await this.delay(1000);
    console.log(
      `[Repo] Registrando compra: Usuário ${userId} -> Ativo ${assetId}`
    );
    return true;
  }
}

export const repo = new Repository();
