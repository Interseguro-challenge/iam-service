export interface MailerService {
  sendEmail(email: string, name: string, subject: string, htmlContent: string): Promise<void>;
}
