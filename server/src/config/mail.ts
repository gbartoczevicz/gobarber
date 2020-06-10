interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

const mailConfig: IMailConfig = {
  driver: 'ethereal',
  defaults: {
    from: {
      email: process.env.MAIL_FROM_DEFAULTS || 'team@gobarber.com',
      name: process.env.NAME_FROM_DEFAULTS || 'GoBarber Team',
    },
  },
};

export default mailConfig;
