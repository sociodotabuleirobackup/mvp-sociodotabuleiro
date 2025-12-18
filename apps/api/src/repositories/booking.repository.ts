import { PrismaClient, BookingStatus } from '@socio-do-tabuleiro/database'

export class BookingRepository {
  constructor(private prisma: PrismaClient) {}

  async findByUserId(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        session: {
          include: {
            master: {
              include: {
                user: {
                  select: { id: true, name: true, avatar: true }
                }
              }
            },
            venue: true,
            store: {
              include: {
                user: {
                  select: { name: true }
                }
              }
            }
          }
        },
        payments: true
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async findBySessionId(sessionId: string) {
    return this.prisma.booking.findMany({
      where: { sessionId },
      include: {
        user: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })
  }

  async findByUserAndSession(userId: string, sessionId: string) {
    return this.prisma.booking.findUnique({
      where: {
        userId_sessionId: { userId, sessionId }
      },
      include: {
        session: true,
        payments: true
      }
    })
  }

  async create(data: {
    userId: string
    sessionId: string
    amount?: number
  }) {
    return this.prisma.booking.create({
      data: {
        userId: data.userId,
        sessionId: data.sessionId,
        amount: data.amount,
        status: BookingStatus.PENDING
      },
      include: {
        session: {
          include: {
            master: {
              include: {
                user: {
                  select: { id: true, name: true, avatar: true }
                }
              }
            }
          }
        },
        user: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })
  }

  async updateStatus(id: string, status: BookingStatus) {
    return this.prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        session: true,
        user: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })
  }

  async countBySession(sessionId: string, status?: BookingStatus) {
    const where: any = { sessionId }
    if (status) where.status = status

    return this.prisma.booking.count({ where })
  }

  async findUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { masterProfile: true }
    })
  }

  async findBookingById(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: { session: true }
    })
  }
}