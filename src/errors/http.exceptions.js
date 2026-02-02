import { AppError } from './base.error.js';

export class ValidationException extends AppError {
  constructor(message) {
    super(message);
    this.name = 'ValidationException';
  }

  get statusCode() {
    return 400;
  }

  get isOperational() {
    return true;
  }
}

export class AuthException extends AppError {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'AuthException';
  }

  get statusCode() {
    return 401;
  }

  get isOperational() {
    return true;
  }
}

export class NotFoundException extends AppError {
  constructor(message) {
    super(message);
    this.name = 'NotFoundException';
  }

  get statusCode() {
    return 404;
  }

  get isOperational() {
    return true;
  }
}
