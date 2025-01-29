export interface EmailMessageData {
  sender: {
    name: string;
    email: string;
  };
  to: {
    email: string;
    name: string;
  }[];
  subject: string;
  htmlContent: string;
}

export interface EmailRepository {
  sendEmail(data: EmailMessageData): Promise<boolean>;
}
