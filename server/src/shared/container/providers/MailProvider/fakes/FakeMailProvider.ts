import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';

class FakeMailProvider implements IMailProvider {
  private mails: ISendMailDTO[] = [];

  public async send(mail: ISendMailDTO): Promise<void> {
    this.mails.push(mail);
  }
}

export default FakeMailProvider;
