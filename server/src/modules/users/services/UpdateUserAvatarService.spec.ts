import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import AppError from '@shared/errors/AppError';

let updateUserAvatar: UpdateUserAvatarService;
let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to udate user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Lorem Ipsum',
      email: 'email@email.com',
      password: 'sit_amet',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      filename: 'avatar.png',
    });

    expect(user).toHaveProperty('avatar', 'avatar.png');
  });

  it('should not be able to update avatar from non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user-id',
        filename: 'avatar.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete user avatar when updating with new one', async () => {
    const fakeStorageProviderDelete = jest.spyOn(fakeStorageProvider, 'delete');

    const user = await fakeUsersRepository.create({
      name: 'Lorem Ipsum',
      email: 'email@email.com',
      password: 'sit_amet',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      filename: 'avatar.png',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      filename: 'avatar2.png',
    });

    expect(fakeStorageProviderDelete).toHaveBeenCalledWith('avatar.png');
    expect(user).toHaveProperty('avatar', 'avatar2.png');
  });
});
