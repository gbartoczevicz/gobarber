import CreateUserSessionService from '@modules/users/services/CreateUserSessionService';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AppError from '@shared/errors/AppError';

let createUserSession: CreateUserSessionService;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

describe('CreateUserSession', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUserSession = new CreateUserSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create user session', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Lorem Ipsum',
      email: 'lorem@ipsum.dolor',
      password: 'sit_amet',
    });

    const res = await createUserSession.execute({
      email: 'lorem@ipsum.dolor',
      password: 'sit_amet',
    });

    expect(res).toHaveProperty('token');
    expect(res).toHaveProperty('user', user);
  });

  it('should not create user session when their email does not exists', async () => {
    await expect(
      createUserSession.execute({
        email: 'lorem@ipsum.dolor',
        password: 'sit_amet',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not create user session when their password does not match', async () => {
    await fakeUsersRepository.create({
      name: 'Lorem Ipsum',
      email: 'lorem@ipsum.dolor',
      password: 'sit_amet',
    });

    await expect(
      createUserSession.execute({
        email: 'lorem@ipsum.dolor',
        password: 'sitamet',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
