import axios, { AxiosInstance } from 'axios';
import { EmailMessageData, EmailRepository } from '../../domain/repositories/email.repository';
import { envs } from '../../../../apps/api/shared/config/envs';

export class EmailRepositoryImpl implements EmailRepository {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: envs.BREVO_SMTP_URL,
      headers: {
        accept: 'application/json',
        'api-key': envs.BREVO_API_KEY,
        'content-type': 'application/json',
      },
    });
  }

  async sendEmail(data: EmailMessageData): Promise<boolean> {
    try {
      const response = await this.api.post('', data);
      if (response.status === 200 || response.status === 201) {
        console.log('Correo enviado exitosamente.');

        return true;
      } else {
        console.log(`Error al enviar el correo: ${response}`);

        return false;
      }
    } catch (error) {
      console.error(`Error al enviar el correo: ${error}`);

      return false;
    }
  }
}
