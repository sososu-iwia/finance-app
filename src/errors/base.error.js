export class AppError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  get statusCode() {
    throw new Error('statusCode must be implemented');
  }

  get isOperational() {
    throw new Error('isOperational must be implemented');
  }
}
