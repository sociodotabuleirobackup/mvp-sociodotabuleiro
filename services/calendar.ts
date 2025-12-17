
import { Session } from '../types';

/**
 * Service Stub for Google Calendar API
 */

export interface CalendarEventResponse {
  eventId: string;
  meetLink?: string;
  htmlLink: string;
}

class GoogleCalendarService {
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async createSessionEvent(session: Session, userEmail: string): Promise<CalendarEventResponse> {
    await this.delay(800);
    console.log(`[G-Calendar] Event created: "${session.title}" on ${session.date}`);

    return {
      eventId: `evt_${Math.random().toString(36).substr(2, 12)}`,
      meetLink: session.locationType === 'ONLINE' ? 'https://meet.google.com/abc-defg-hij' : undefined,
      htmlLink: 'https://calendar.google.com/event?id=mock'
    };
  }

  async updateEvent(eventId: string, session: Session): Promise<boolean> {
    await this.delay(500);
    console.log(`[G-Calendar] Event ${eventId} updated`);
    return true;
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    await this.delay(500);
    console.log(`[G-Calendar] Event ${eventId} canceled`);
    return true;
  }
}

export const calendar = new GoogleCalendarService();
