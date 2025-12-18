import { UserRepository } from '../repositories/user.repository'
import { UserRole } from '@socio-do-tabuleiro/database'

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getOrCreateUser(authUser: { id: string; email: string }) {
    let user = await this.userRepository.findById(authUser.id)
    
    if (!user) {
      // Create user if doesn't exist (first login)
      user = await this.userRepository.create({
        id: authUser.id,
        email: authUser.email,
        role: UserRole.PLAYER // Default role
      })
    }

    return user
  }

  async updateProfile(userId: string, data: {
    name?: string
    avatar?: string
    phone?: string
  }) {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    return this.userRepository.update(userId, data)
  }

  async becomeMaster(userId: string, data: { bio?: string }) {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    if (user.masterProfile) {
      throw new Error('User is already a master')
    }

    return this.userRepository.createMasterProfile(userId, data)
  }

  async canCreateSession(userId: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId)
    return user?.role === UserRole.MASTER && !!user.masterProfile
  }

  async canManageVenue(userId: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId)
    return user?.role === UserRole.STORE && !!user.storeProfile
  }
}