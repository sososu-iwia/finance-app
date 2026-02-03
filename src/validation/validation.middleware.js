import { ValidationException } from '../errors/http.exceptions.js';

export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new ValidationException(result.error.message);
    }

    req.body = result.data;
    next();
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      throw new ValidationException(result.error.message);
    }

    req.query = result.data;
    next();
  };
};
