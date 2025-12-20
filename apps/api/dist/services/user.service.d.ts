import { UserRepository } from '../repositories/user.repository';
export declare class UserService {
    private userRepository;
    constructor(userRepository: UserRepository);
    getOrCreateUser(authUser: {
        id: string;
        email: string;
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
    updateProfile(userId: string, data: {
        name?: string;
        avatar?: string;
        phone?: string;
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
    becomeMaster(userId: string, data: {
        bio?: string;
    }): Promise<any>;
    canCreateSession(userId: string): Promise<boolean>;
    canManageVenue(userId: string): Promise<boolean>;
}
