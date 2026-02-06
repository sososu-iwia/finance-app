import bcrypt from 'bcryptjs';
import { ValidationException, AuthException } from '../errors/http.exceptions.js';
import { logger } from '../logging/logger.js';

export class AuthService {
  constructor(userRepo, tokenService, mailService) {
    this.userRepo = userRepo;
    this.tokenService = tokenService;
    this.mailService = mailService;
  }

  async register(email, password) {
    const normalizedEmail = String(email).trim().toLowerCase();
    const exists = await this.userRepo.findByEmail(normalizedEmail);
    if (exists) {
      throw new ValidationException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await this.userRepo.create({
      email: normalizedEmail,
      passwordHash,
      roles: ['USER'],
    });

    await this.mailService?.sendWelcomeEmail?.(user.email);

    return {
      id: user.id,
      email: user.email,
    };
  }

  async login(email, password) {
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await this.userRepo.findByEmail(normalizedEmail);

    if (!user) {
      logger.warn({ event: 'AUTH_FAIL', email: normalizedEmail });
      throw new AuthException('Invalid credentials');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      logger.warn({ event: 'AUTH_FAIL', userId: (user._id || user.id)?.toString?.() });
      throw new AuthException('Invalid credentials');
    }

    const userId = (user._id || user.id).toString();
    logger.info({ event: 'AUTH_SUCCESS', userId });

    return {
      accessToken: this.tokenService.generate({
        sub: userId,
        roles: user.roles,
      }),
    };
  }
}
