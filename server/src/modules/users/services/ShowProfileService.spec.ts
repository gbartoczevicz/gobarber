import ShowProfileService from '@modules/users/services/ShowProfileService';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import AppError from '@shared/errors/AppError';

let showProfile: ShowProfileService;
let fakeUsersRepository: FakeUsersRepository;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Lorem Ipsum',
      email: 'lorem@ipsum.dolor',
      password: 'sit_amet',
    });

    const profile = await showProfile.execute({ user_id: user.id });

    expect(profile.name).toBe('Lorem Ipsum');
    expect(profile.email).toBe('lorem@ipsum.dolor');
  });

  it('should not be able to show profile from non-existing user', async () => {
    await expect(
      showProfile.execute({ user_id: 'non-existing user' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
