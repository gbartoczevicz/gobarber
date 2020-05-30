import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';

export default interface IMailProvider {
  send(mail: ISendMailDTO): Promise<void>;
}
