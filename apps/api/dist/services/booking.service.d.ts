import { BookingRepository } from '../repositories/booking.repository';
import { SessionService } from './session.service';
export declare class BookingService {
    private bookingRepository;
    private sessionService;
    constructor(bookingRepository: BookingRepository, sessionService: SessionService);
    getUserBookings(userId: string): Promise<({
        session: {
            venue: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                storeId: string;
                name: string;
                address: string;
                latitude: number | null;
                longitude: number | null;
                capacity: number;
                amenities: string[];
            } | null;
            store: ({
                user: {
                    name: string | null;
                };
            } & {
                id: string;
                phone: string | null;
                userId: string;
                storeName: string;
                cnpj: string | null;
                address: string | null;
                latitude: number | null;
                longitude: number | null;
            }) | null;
            master: ({
                user: {
                    id: string;
                    name: string | null;
                    avatar: string | null;
                };
            } & {
                id: string;
                userId: string;
                bio: string | null;
                experience: number;
                rating: number;
                totalGames: number;
                specialties: string[];
            }) | null;
        } & {
            status: import("@socio-do-tabuleiro/database").$Enums.SessionStatus;
            id: string;
            title: string;
            description: string | null;
            gameSystem: string;
            maxPlayers: number;
            price: number;
            duration: number;
            locationType: import("@socio-do-tabuleiro/database").$Enums.LocationType;
            scheduledAt: Date;
            createdAt: Date;
            updatedAt: Date;
            masterId: string | null;
            storeId: string | null;
            venueId: string | null;
            tableId: string | null;
        };
        payments: {
            method: import("@socio-do-tabuleiro/database").$Enums.PaymentMethod;
            status: import("@socio-do-tabuleiro/database").$Enums.PaymentStatus;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            bookingId: string | null;
            currency: string;
            externalId: string | null;
            subscriptionId: string | null;
        }[];
    } & {
        status: import("@socio-do-tabuleiro/database").$Enums.BookingStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        sessionId: string;
        paymentId: string | null;
        amount: number | null;
    })[]>;
    createBooking(userId: string, sessionId: string): Promise<{
        user: {
            id: string;
            name: string | null;
            avatar: string | null;
        };
        session: {
            master: ({
                user: {
                    id: string;
                    name: string | null;
                    avatar: string | null;
                };
            } & {
                id: string;
                userId: string;
                bio: string | null;
                experience: number;
                rating: number;
                totalGames: number;
                specialties: string[];
            }) | null;
        } & {
            status: import("@socio-do-tabuleiro/database").$Enums.SessionStatus;
            id: string;
            title: string;
            description: string | null;
            gameSystem: string;
            maxPlayers: number;
            price: number;
            duration: number;
            locationType: import("@socio-do-tabuleiro/database").$Enums.LocationType;
            scheduledAt: Date;
            createdAt: Date;
            updatedAt: Date;
            masterId: string | null;
            storeId: string | null;
            venueId: string | null;
            tableId: string | null;
        };
    } & {
        status: import("@socio-do-tabuleiro/database").$Enums.BookingStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        sessionId: string;
        paymentId: string | null;
        amount: number | null;
    }>;
    confirmBooking(bookingId: string, userId: string): Promise<{
        user: {
            id: string;
            name: string | null;
            avatar: string | null;
        };
        session: {
            status: import("@socio-do-tabuleiro/database").$Enums.SessionStatus;
            id: string;
            title: string;
            description: string | null;
            gameSystem: string;
            maxPlayers: number;
            price: number;
            duration: number;
            locationType: import("@socio-do-tabuleiro/database").$Enums.LocationType;
            scheduledAt: Date;
            createdAt: Date;
            updatedAt: Date;
            masterId: string | null;
            storeId: string | null;
            venueId: string | null;
            tableId: string | null;
        };
    } & {
        status: import("@socio-do-tabuleiro/database").$Enums.BookingStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        sessionId: string;
        paymentId: string | null;
        amount: number | null;
    }>;
    cancelBooking(bookingId: string, userId: string): Promise<{
        user: {
            id: string;
            name: string | null;
            avatar: string | null;
        };
        session: {
            status: import("@socio-do-tabuleiro/database").$Enums.SessionStatus;
            id: string;
            title: string;
            description: string | null;
            gameSystem: string;
            maxPlayers: number;
            price: number;
            duration: number;
            locationType: import("@socio-do-tabuleiro/database").$Enums.LocationType;
            scheduledAt: Date;
            createdAt: Date;
            updatedAt: Date;
            masterId: string | null;
            storeId: string | null;
            venueId: string | null;
            tableId: string | null;
        };
    } & {
        status: import("@socio-do-tabuleiro/database").$Enums.BookingStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        sessionId: string;
        paymentId: string | null;
        amount: number | null;
    }>;
}
