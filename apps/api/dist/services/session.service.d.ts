import { SessionRepository, SessionFilters } from '../repositories/session.repository';
import { UserService } from './user.service';
import { LocationType } from '@socio-do-tabuleiro/database';
export declare class SessionService {
    private sessionRepository;
    private userService;
    constructor(sessionRepository: SessionRepository, userService: UserService);
    getSessions(filters?: SessionFilters): Promise<({
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
        table: {
            number: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            venueId: string;
            capacity: number;
            isActive: boolean;
        } | null;
        store: ({
            user: {
                id: string;
                name: string | null;
                avatar: string | null;
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
        _count: {
            bookings: number;
        };
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
    })[]>;
    getSessionById(id: string): Promise<{
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
        table: {
            number: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            venueId: string;
            capacity: number;
            isActive: boolean;
        } | null;
        store: ({
            user: {
                id: string;
                name: string | null;
                avatar: string | null;
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
        bookings: ({
            user: {
                id: string;
                name: string | null;
                avatar: string | null;
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
        })[];
        reviews: ({
            user: {
                id: string;
                name: string | null;
                avatar: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            rating: number;
            sessionId: string;
            comment: string | null;
        })[];
        _count: {
            bookings: number;
        };
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
    }>;
    createSession(masterId: string, data: {
        title: string;
        description?: string;
        gameSystem: string;
        maxPlayers: number;
        price: number;
        duration: number;
        scheduledAt: Date;
        locationType: LocationType;
        storeId?: string;
        venueId?: string;
        tableId?: string;
    }): Promise<{
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
        table: {
            number: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            venueId: string;
            capacity: number;
            isActive: boolean;
        } | null;
        store: ({
            user: {
                id: string;
                name: string | null;
                avatar: string | null;
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
    }>;
    updateSession(sessionId: string, masterId: string, data: Partial<{
        title: string;
        description: string;
        gameSystem: string;
        maxPlayers: number;
        price: number;
        duration: number;
        scheduledAt: Date;
    }>): Promise<{
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
    }>;
    cancelSession(sessionId: string, masterId: string): Promise<{
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
    }>;
}
