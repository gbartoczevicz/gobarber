import ListProvidersService from '@modules/appointments/services/ListProvidersService';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import AppError from '@shared/errors/AppError';

let listProviders: ListProvidersService;
let fakeUsersRepository: FakeUsersRepository;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list providers', async () => {
    const loggedUser = await fakeUsersRepository.create({
      name: 'Lorem Ipsum',
      email: 'lorem@ipsum.dolor',
      password: 'sit_amet',
    });

    const provider1 = await fakeUsersRepository.create({
      name: 'Lorem Ipsum 1',
      email: 'lorem+01@ipsum.dolor',
      password: 'sit_amet',
    });

    const provider2 = await fakeUsersRepository.create({
      name: 'Lorem Ipsum 2',
      email: 'lorem+02@ipsum.dolor',
      password: 'sit_amet',
    });

    const provider3 = await fakeUsersRepository.create({
      name: 'Lorem Ipsum 3',
      email: 'lorem+03@ipsum.dolor',
      password: 'sit_amet',
    });

    const providers = await listProviders.execute({ user_id: loggedUser.id });

    expect(providers).toEqual([provider1, provider2, provider3]);
  });

  it('should not be able to list providers when user not exists', async () => {
    await fakeUsersRepository.create({
      name: 'Lorem Ipsum 1',
      email: 'lorem+01@ipsum.dolor',
      password: 'sit_amet',
    });

    await fakeUsersRepository.create({
      name: 'Lorem Ipsum 2',
      email: 'lorem+02@ipsum.dolor',
      password: 'sit_amet',
    });

    await fakeUsersRepository.create({
      name: 'Lorem Ipsum 3',
      email: 'lorem+03@ipsum.dolor',
      password: 'sit_amet',
    });

    await expect(
      listProviders.execute({
        user_id: 'non-existent-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
