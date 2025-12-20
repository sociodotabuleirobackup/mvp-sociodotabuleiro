"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRepository = void 0;
const database_1 = require("@socio-do-tabuleiro/database");
class BookingRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByUserId(userId) {
        return this.prisma.booking.findMany({
            where: { userId },
            include: {
                session: {
                    include: {
                        master: {
                            include: {
                                user: {
                                    select: { id: true, name: true, avatar: true },
                                },
                            },
                        },
                        venue: true,
                        store: {
                            include: {
                                user: {
                                    select: { name: true },
                                },
                            },
                        },
                    },
                },
                payments: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findBySessionId(sessionId) {
        return this.prisma.booking.findMany({
            where: { sessionId },
            include: {
                user: {
                    select: { id: true, name: true, avatar: true },
                },
            },
        });
    }
    async findByUserAndSession(userId, sessionId) {
        return this.prisma.booking.findUnique({
            where: {
                userId_sessionId: { userId, sessionId },
            },
            include: {
                session: true,
                payments: true,
            },
        });
    }
    async create(data) {
        return this.prisma.booking.create({
            data: {
                userId: data.userId,
                sessionId: data.sessionId,
                amount: data.amount,
                status: database_1.BookingStatus.PENDING,
            },
            include: {
                session: {
                    include: {
                        master: {
                            include: {
                                user: {
                                    select: { id: true, name: true, avatar: true },
                                },
                            },
                        },
                    },
                },
                user: {
                    select: { id: true, name: true, avatar: true },
                },
            },
        });
    }
    async updateStatus(id, status) {
        return this.prisma.booking.update({
            where: { id },
            data: { status },
            include: {
                session: true,
                user: {
                    select: { id: true, name: true, avatar: true },
                },
            },
        });
    }
    async countBySession(sessionId, status) {
        const where = { sessionId };
        if (status)
            where.status = status;
        return this.prisma.booking.count({ where });
    }
    async findUserById(userId) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            include: { masterProfile: true },
        });
    }
    async findBookingById(id) {
        return this.prisma.booking.findUnique({
            where: { id },
            include: { session: true },
        });
    }
}
exports.BookingRepository = BookingRepository;
