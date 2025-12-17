
import { Session, Booking, User, Asset, BookingStatus, SessionStatus } from '../types';
import { COLLECTIONS } from '../firebase/schema';

/**
 * Data Access Layer Stub
 * This isolates Firestore logic from UI logic.
 */

class Repository {
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // --- Sessions ---
  
  async createSession(session: Omit<Session, 'id'>): Promise<string> {
    await this.delay(500);
    console.log(`[Repo] Creating session in ${COLLECTIONS.SESSIONS}`, session);
    return `sess_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getSessions(filter?: any): Promise<Session[]> {
    await this.delay(300);
    // Mock return
    return [];
  }

  // --- Bookings ---

  async createBooking(booking: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<string> {
    await this.delay(500);
    console.log(`[Repo] Creating booking in ${COLLECTIONS.BOOKINGS}`, booking);
    return `book_${Math.random().toString(36).substr(2, 9)}`;
  }

  async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<void> {
    await this.delay(300);
    console.log(`[Repo] Updating booking ${bookingId} to ${status}`);
  }

  // --- Marketplace ---

  async purchaseAsset(userId: string, assetId: string): Promise<boolean> {
    await this.delay(1000);
    console.log(`[Repo] Recording purchase in ${COLLECTIONS.PURCHASES}: User ${userId} -> Asset ${assetId}`);
    return true;
  }
}

export const repo = new Repository();
