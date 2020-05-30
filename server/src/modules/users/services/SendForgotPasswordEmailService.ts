import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  private usersRepository: IUsersRepository;

  private userTokensRepository: IUserTokensRepository;

  private mailProvider: IMailProvider;

  constructor(
    @inject('UsersRepository') usersRepository: IUsersRepository,
    @inject('UserTokensRepository') userTokensRepository: IUserTokensRepository,
    @inject('MailProvider') mailProvider: IMailProvider,
  ) {
    this.usersRepository = usersRepository;
    this.userTokensRepository = userTokensRepository;
    this.mailProvider = mailProvider;
  }

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    await this.mailProvider.send({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: 'Equipe GoBarber ✂️ Recuperação de Senha',
      template: {
        template: 'Olár {{name}}, pegue seu token imediatamente<br />{{token}}',
        variables: {
          name: user.name,
          token,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
