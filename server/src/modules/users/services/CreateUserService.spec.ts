import CreateUserService from '@modules/users/services/CreateUserService';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import AppError from '@shared/errors/AppError';

let createUser: CreateUserService;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Lorem Ipsum',
      email: 'lorem@ipsum.dolor',
      password: 'sit_amet',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with email that already exists', async () => {
    const userEmail = 'email@email.com';

    await createUser.execute({
      name: 'Lorem Ipsum',
      email: userEmail,
      password: 'sit_amet',
    });

    await expect(
      createUser.execute({
        name: 'Lorem Ipsum 2',
        email: userEmail,
        password: 'sit_amet',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
