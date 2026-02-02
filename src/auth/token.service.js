import jwt from 'jsonwebtoken';

export class TokenService {
  constructor(secret, expiresIn = '15m') {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  generate(payload) {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  verify(token) {
    return jwt.verify(token, this.secret);
  }
}
