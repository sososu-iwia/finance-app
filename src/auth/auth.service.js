import bcrypt from 'bcrypt';
import { ValidationException, AuthException } from '../errors/http.exceptions.js';
import { logger } from '../logging/logger.js';

export class AuthService {
  constructor(userRepo, tokenService) {
    this.userRepo = userRepo;
    this.tokenService = tokenService;
  }

  async register(email, password) {
    const exists = await this.userRepo.findByEmail(email);
    if (exists) {
      throw new ValidationException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await this.userRepo.create({
      email,
      passwordHash,
      roles: ['USER'],
    });

    return {
      id: user.id,
      email: user.email,
    };
  }

  async login(email, password) {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      logger.warn({ event: 'AUTH_FAIL', email });
      throw new AuthException('Invalid credentials');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      logger.warn({ event: 'AUTH_FAIL', userId: user.id });
      throw new AuthException('Invalid credentials');
    }

    logger.info({ event: 'AUTH_SUCCESS', userId: user.id });

    return {
      accessToken: this.tokenService.generate({
        sub: user.id,
        roles: user.roles,
      }),
    };
  }
}
