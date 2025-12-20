"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const database_1 = require("@socio-do-tabuleiro/database");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getOrCreateUser(authUser) {
        let user = await this.userRepository.findById(authUser.id);
        if (!user) {
            // Create user if doesn't exist (first login)
            user = await this.userRepository.create({
                id: authUser.id,
                email: authUser.email,
                role: database_1.UserRole.PLAYER, // Default role
            });
        }
        return user;
    }
    async updateProfile(userId, data) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return this.userRepository.update(userId, data);
    }
    async becomeMaster(userId, data) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (user.masterProfile) {
            throw new Error('User is already a master');
        }
        return this.userRepository.createMasterProfile(userId, data);
    }
    async canCreateSession(userId) {
        const user = await this.userRepository.findById(userId);
        return user?.role === database_1.UserRole.MASTER && !!user.masterProfile;
    }
    async canManageVenue(userId) {
        const user = await this.userRepository.findById(userId);
        return user?.role === database_1.UserRole.STORE && !!user.storeProfile;
    }
}
exports.UserService = UserService;
