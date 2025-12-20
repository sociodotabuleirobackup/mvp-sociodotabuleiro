import { PrismaClient, User, UserRole } from '@socio-do-tabuleiro/database';
export declare class UserRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    findById(id: string): Promise<({
        masterProfile: {
            id: string;
            userId: string;
            bio: string | null;
            experience: number;
            rating: number;
            totalGames: number;
            specialties: string[];
        } | null;
        storeProfile: {
            id: string;
            phone: string | null;
            userId: string;
            storeName: string;
            cnpj: string | null;
            address: string | null;
            latitude: number | null;
            longitude: number | null;
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
    findByEmail(email: string): Promise<({
        masterProfile: {
            id: string;
            userId: string;
            bio: string | null;
            experience: number;
            rating: number;
            totalGames: number;
            specialties: string[];
        } | null;
        storeProfile: {
            id: string;
            phone: string | null;
            userId: string;
            storeName: string;
            cnpj: string | null;
            address: string | null;
            latitude: number | null;
            longitude: number | null;
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
    create(data: {
        id: string;
        email: string;
        name?: string;
        role?: UserRole;
    }): Promise<{
        masterProfile: {
            id: string;
            userId: string;
            bio: string | null;
            experience: number;
            rating: number;
            totalGames: number;
            specialties: string[];
        } | null;
        storeProfile: {
            id: string;
            phone: string | null;
            userId: string;
            storeName: string;
            cnpj: string | null;
            address: string | null;
            latitude: number | null;
            longitude: number | null;
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
    }>;
    update(id: string, data: Partial<Pick<User, 'name' | 'avatar' | 'phone'>>): Promise<{
        masterProfile: {
            id: string;
            userId: string;
            bio: string | null;
            experience: number;
            rating: number;
            totalGames: number;
            specialties: string[];
        } | null;
        storeProfile: {
            id: string;
            phone: string | null;
            userId: string;
            storeName: string;
            cnpj: string | null;
            address: string | null;
            latitude: number | null;
            longitude: number | null;
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
    }>;
    createMasterProfile(userId: string, data: {
        bio?: string;
    }): Promise<any>;
}
