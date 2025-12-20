"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = require("@socio-do-tabuleiro/database");
class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                masterProfile: true,
                storeProfile: true,
            },
        });
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                masterProfile: true,
                storeProfile: true,
            },
        });
    }
    async create(data) {
        return this.prisma.user.create({
            data,
            include: {
                masterProfile: true,
                storeProfile: true,
            },
        });
    }
    async update(id, data) {
        return this.prisma.user.update({
            where: { id },
            data,
            include: {
                masterProfile: true,
                storeProfile: true,
            },
        });
    }
    async createMasterProfile(userId, data) {
        return this.prisma.$transaction(async (tx) => {
            // Create master profile
            const masterProfile = await tx.masterProfile.create({
                data: {
                    userId,
                    bio: data.bio,
                },
            });
            // Update user role
            await tx.user.update({
                where: { id: userId },
                data: { role: database_1.UserRole.MASTER },
            });
            return masterProfile;
        });
    }
}
exports.UserRepository = UserRepository;
