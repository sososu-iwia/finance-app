import { AppError } from './base.error.js';

export class InternalServerError extends AppError {
  constructor(message = 'Unexpected error') {
    super(message);
    this.name = 'InternalServerError';
  }

  get statusCode() {
    return 500;
  }

  get isOperational() {
    return false;
  }
}
