import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

interface IMail {
  to: string;
  body: string;
}

class FakeMailProvider implements IMailProvider {
  private mails: IMail[] = [];

  public async send(to: string, body: string): Promise<void> {
    this.mails.push({
      to,
      body,
    });
  }
}

export default FakeMailProvider;
