import { AuthException } from '../errors/http.exceptions.js';
import { logger } from '../logging/logger.js';

export const requireRole = (...roles) => {
  return (req, res, next) => {
    const userRoles = req.user?.roles || [];
    const allowed = roles.some(r => userRoles.includes(r));

    if (!allowed) {
      logger.warn({
        event: 'ACCESS_DENIED',
        userId: req.user?.userId,
        requiredRoles: roles,
      });
      throw new AuthException('Forbidden');
    }

    next();
  };
};
