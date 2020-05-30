import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

export default interface ISendMailDTO {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  template: IParseMailTemplateDTO;
}

interface IMailContact {
  name: string;
  email: string;
}
