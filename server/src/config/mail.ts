interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

const mailConfig = {
  driver: process.env.MAIL_DRIVER,
  defaults: {
    from: {
      email: process.env.MAIL_FROM,
      name: process.env.NAME_FROM,
    },
  },
} as IMailConfig;

export default mailConfig;
