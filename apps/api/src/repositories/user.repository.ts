import { PrismaClient, User, UserRole } from '@socio-do-tabuleiro/database';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        masterProfile: true,
        storeProfile: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        masterProfile: true,
        storeProfile: true,
      },
    });
  }

  async create(data: {
    id: string;
    email: string;
    name?: string;
    role?: UserRole;
  }) {
    return this.prisma.user.create({
      data,
      include: {
        masterProfile: true,
        storeProfile: true,
      },
    });
  }

  async update(
    id: string,
    data: Partial<Pick<User, 'name' | 'avatar' | 'phone'>>
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
      include: {
        masterProfile: true,
        storeProfile: true,
      },
    });
  }

  async createMasterProfile(userId: string, data: { bio?: string }) {
    return this.prisma.$transaction(async (tx: any) => {
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
        data: { role: UserRole.MASTER },
      });

      return masterProfile;
    });
  }
}
