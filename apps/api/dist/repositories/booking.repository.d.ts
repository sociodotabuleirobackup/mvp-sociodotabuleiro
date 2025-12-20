import { PrismaClient, BookingStatus } from '@socio-do-tabuleiro/database';
export declare class BookingRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    findByUserId(userId: string): Promise<({
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
    findBySessionId(sessionId: string): Promise<({
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
    })[]>;
    findByUserAndSession(userId: string, sessionId: string): Promise<({
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
    }) | null>;
    create(data: {
        userId: string;
        sessionId: string;
        amount?: number;
    }): Promise<{
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
    updateStatus(id: string, status: BookingStatus): Promise<{
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
    countBySession(sessionId: string, status?: BookingStatus): Promise<number>;
    findUserById(userId: string): Promise<({
        masterProfile: {
            id: string;
            userId: string;
            bio: string | null;
            experience: number;
            rating: number;
            totalGames: number;
            specialties: string[];
        } | null;
    } & {
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        avatar: string | null;
        role: import("@socio-do-tabuleiro/database").$Enums.UserRole;
        phone: string | null;
        cpf: string | null;
        stripeCustomerId: string | null;
        stripeConnectAccountId: string | null;
        stripeVerificationStatus: import("@socio-do-tabuleiro/database").$Enums.StripeVerificationStatus;
        stripeVerifiedAt: Date | null;
    }) | null>;
    findBookingById(id: string): Promise<({
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
    }) | null>;
}
