import CreateUserSessionService from '@modules/users/services/CreateUserSessionService';
import CreateUserService from '@modules/users/services/CreateUserService';

import UsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AppError from '@shared/errors/AppError';

describe('CreateUserSession', () => {
  it('should be able to create user session', async () => {
    const fakeUsersRepository = new UsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const createUserSession = new CreateUserSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
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
    const fakeUsersRepository = new UsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserSession = new CreateUserSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    expect(
      createUserSession.execute({
        email: 'lorem@ipsum.dolor',
        password: 'sit_amet',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not create user session when their password does not match', async () => {
    const fakeUsersRepository = new UsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const createUserSession = new CreateUserSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'Lorem Ipsum',
      email: 'lorem@ipsum.dolor',
      password: 'sit_amet',
    });

    expect(
      createUserSession.execute({
        email: 'lorem@ipsum.dolor',
        password: 'sitamet',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
