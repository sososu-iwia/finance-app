import { AppError } from './base.error.js';

export class BusinessError extends AppError {
  constructor(message) {
    super(message);
    this.name = 'BusinessError';
  }

  get statusCode() {
    return 400;
  }

  get isOperational() {
    return true;
  }
}

export class ForbiddenOperationError extends AppError {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenOperationError';
  }

  get statusCode() {
    return 403;
  }

  get isOperational() {
    return true;
  }
}

export class InsufficientFundsError extends AppError {
  constructor(message) {
    super(message);
    this.name = 'InsufficientFundsError';
  }

  get statusCode() {
    return 409;
  }

  get isOperational() {
    return true;
  }
}

export class InvalidStateError extends AppError {
  constructor(message) {
    super(message);
    this.name = 'InvalidStateError';
  }

  get statusCode() {
    return 422;
  }

  get isOperational() {
    return true;
  }
}
