import { ValidationException, NotFoundException } from '../errors/http.exceptions.js';

export class UserService {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  async getProfile(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return {
      id: user._id?.toString?.() ?? user.id,
      email: user.email,
      username: user.username || '',
      roles: user.roles || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateProfile(userId, patch) {
    if (patch.email) {
      const normalizedEmail = String(patch.email).trim().toLowerCase();
      const exists = await this.userRepo.findByEmail(normalizedEmail);
      if (exists && String(exists._id || exists.id) !== String(userId)) {
        throw new ValidationException('Email already registered');
      }
      patch.email = normalizedEmail;
    }

    const updated = await this.userRepo.updateById(userId, patch);
    if (!updated) throw new NotFoundException('User not found');

    return {
      id: updated._id.toString(),
      email: updated.email,
      username: updated.username || '',
      roles: updated.roles || [],
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}

