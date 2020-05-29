import nodemailer, { Transporter } from 'nodemailer';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

const { log } = console;

class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  public async send(to: string, body: string): Promise<void> {
    const message = await this.client.sendMail({
      from: 'GoBarber Team <team@gobarber.com>',
      to,
      subject: 'Recuperação de Senha ✔',
      text: body,
    });

    log(
      `Message sent: ${
        message.messageId
      }\nPreview URL: ${nodemailer.getTestMessageUrl(message)}`,
    );
  }
}

export default EtherealMailProvider;
