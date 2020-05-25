import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

import UsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import AppError from '@shared/errors/AppError';

describe('UpdateUserAvatar', () => {
  it('should be able to udate user avatar', async () => {
    const fakeUsersRepository = new UsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const user = await fakeUsersRepository.create({
      name: 'Lorem Ipsum',
      email: 'email@email.com',
      password: 'sit_amet',
    });

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    await updateUserAvatar.execute({
      user_id: user.id,
      filename: 'avatar.png',
    });

    expect(user).toHaveProperty('avatar', 'avatar.png');
  });

  it('should not be able to update avatar from non existing user', async () => {
    const fakeUsersRepository = new UsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user-id',
        filename: 'avatar.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete user avatar when updating with new one', async () => {
    const fakeUsersRepository = new UsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const fakeStorageProviderDelete = jest.spyOn(fakeStorageProvider, 'delete');

    const user = await fakeUsersRepository.create({
      name: 'Lorem Ipsum',
      email: 'email@email.com',
      password: 'sit_amet',
    });

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

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
