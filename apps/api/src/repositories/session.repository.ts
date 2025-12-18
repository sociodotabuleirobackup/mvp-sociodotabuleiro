import {
  PrismaClient,
  SessionStatus,
  LocationType,
} from '@socio-do-tabuleiro/database';

export interface SessionFilters {
  status?: SessionStatus;
  locationType?: LocationType;
  gameSystem?: string;
  masterId?: string;
  storeId?: string;
  minPrice?: number;
  maxPrice?: number;
  scheduledAfter?: Date;
  scheduledBefore?: Date;
}

export class SessionRepository {
  constructor(private prisma: PrismaClient) {}

  async findMany(filters: SessionFilters = {}) {
    const where: any = {};

    if (filters.status) where.status = filters.status;
    if (filters.locationType) where.locationType = filters.locationType;
    if (filters.gameSystem)
      where.gameSystem = { contains: filters.gameSystem, mode: 'insensitive' };
    if (filters.masterId) where.masterId = filters.masterId;
    if (filters.storeId) where.storeId = filters.storeId;

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    if (filters.scheduledAfter || filters.scheduledBefore) {
      where.scheduledAt = {};
      if (filters.scheduledAfter)
        where.scheduledAt.gte = filters.scheduledAfter;
      if (filters.scheduledBefore)
        where.scheduledAt.lte = filters.scheduledBefore;
    }

    return this.prisma.session.findMany({
      where,
      include: {
        master: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        store: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        venue: true,
        table: true,
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.session.findUnique({
      where: { id },
      include: {
        master: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        store: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        venue: true,
        table: true,
        bookings: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        _count: {
          select: { bookings: true },
        },
      },
    });
  }

  async create(data: {
    title: string;
    description?: string;
    gameSystem: string;
    maxPlayers: number;
    price: number;
    duration: number;
    scheduledAt: Date;
    masterId: string;
    locationType: LocationType;
    storeId?: string;
    venueId?: string;
    tableId?: string;
  }) {
    return this.prisma.session.create({
      data,
      include: {
        master: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        store: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        venue: true,
        table: true,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      gameSystem: string;
      maxPlayers: number;
      price: number;
      duration: number;
      scheduledAt: Date;
      status: SessionStatus;
    }>
  ) {
    return this.prisma.session.update({
      where: { id },
      data,
      include: {
        master: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.session.update({
      where: { id },
      data: { status: SessionStatus.CANCELLED },
    });
  }
}
