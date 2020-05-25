import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;

let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeMailProvider = new FakeMailProvider();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeMailProvider,
    );
  });

  it('should be able to send password recovery e-mail', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'send');

    await fakeUsersRepository.create({
      name: 'User',
      email: 'user@email.com',
      password: 'password',
    });

    await sendForgotPasswordEmail.execute({
      email: 'user@email.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send password recovery e-mail to a non existing user', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'send');

    await expect(
      sendForgotPasswordEmail.execute({
        email: 'email@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(sendMail).toHaveBeenCalledTimes(0);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'User',
      email: 'user@email.com',
      password: 'password',
    });

    await sendForgotPasswordEmail.execute({
      email: 'user@email.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
