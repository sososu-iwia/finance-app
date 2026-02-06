import nodemailer from 'nodemailer';
import { logger } from '../logging/logger.js';

export class MailService {
  constructor(env) {
    this.env = env;
    this.enabled = Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && env.SMTP_FROM);

    this.transport = this.enabled
      ? nodemailer.createTransport({
          host: env.SMTP_HOST,
          port: env.SMTP_PORT,
          secure: env.SMTP_SECURE,
          auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
          },
        })
      : null;
  }

  async sendWelcomeEmail(to) {
    if (!this.enabled) return;

    try {
      await this.transport.sendMail({
        from: this.env.SMTP_FROM,
        to,
        subject: 'Welcome to Finance App',
        text: 'Your account has been created successfully.',
      });
    } catch (err) {
      logger.warn({ event: 'EMAIL_SEND_FAILED', to, err: err.message });
    }
  }
}

