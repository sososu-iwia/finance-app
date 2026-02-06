import { ForbiddenOperationError } from '../errors/domain.errors.js';
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
      throw new ForbiddenOperationError('Forbidden');
    }

    next();
  };
};
