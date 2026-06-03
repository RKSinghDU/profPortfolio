import emailjs from '@emailjs/browser';

export interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export interface ContactMessage {
  from_name: string;
  from_email: string;
  message: string;
  [key: string]: unknown;
}

export class EmailService {
  constructor(private readonly config: EmailConfig) {}

  isConfigured(): boolean {
    return !!(this.config.serviceId && this.config.templateId && this.config.publicKey);
  }

  async send(message: ContactMessage): Promise<void> {
    await emailjs.send(
      this.config.serviceId,
      this.config.templateId,
      message,
      this.config.publicKey,
    );
  }
}
