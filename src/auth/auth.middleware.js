import { AuthException } from '../errors/http.exceptions.js';

export const authMiddleware = (tokenService) => {
  return (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new AuthException('Unauthorized');
    }

    const token = header.split(' ')[1];
    const payload = tokenService.verify(token);

    req.user = {
      userId: payload.sub,
      roles: payload.roles,
    };

    next();
  };
};
