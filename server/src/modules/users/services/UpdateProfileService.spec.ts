import UpdateProfileService from '@modules/users/services/UpdateProfileService';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AppError from '@shared/errors/AppError';

let updateProfile: UpdateProfileService;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update profile', async () => {
    const save = jest.spyOn(fakeUsersRepository, 'save');

    const user = await fakeUsersRepository.create({
      name: 'Lorem Ipsum',
      email: 'lorem@ipsum.dolor',
      password: 'sit_amet',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      email: 'new+lorem@ipsum.dolor',
      name: 'Lorem Ipsum da Silva',
    });

    expect(save).toHaveBeenCalledWith(updatedUser);

    expect(updatedUser.email).toBe('new+lorem@ipsum.dolor');
    expect(updatedUser.name).toBe('Lorem Ipsum da Silva');
  });

  it('should be able to update password', async () => {
    const save = jest.spyOn(fakeUsersRepository, 'save');

    const user = await fakeUsersRepository.create({
      name: 'Lorem Ipsum',
      email: 'lorem@ipsum.dolor',
      password: 'sit_amet',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      email: 'new+lorem@ipsum.dolor',
      name: 'Lorem Ipsum da Silva',
      password: 'updated_password',
      current_password: user.password,
    });

    expect(save).toHaveBeenCalledWith(updatedUser);

    expect(updatedUser.email).toBe('new+lorem@ipsum.dolor');
    expect(updatedUser.name).toBe('Lorem Ipsum da Silva');
    expect(updatedUser.password).toBe('updated_password');
  });

  it('should be able to keep user name when name from request is null', async () => {
    const save = jest.spyOn(fakeUsersRepository, 'save');

    const user = await fakeUsersRepository.create({
      name: 'Lorem Ipsum',
      email: 'lorem@ipsum.dolor',
      password: 'sit_amet',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      email: 'new+lorem@ipsum.dolor',
    });

    expect(save).toHaveBeenCalledWith(updatedUser);

    expect(updatedUser.email).toBe('new+lorem@ipsum.dolor');
    expect(updatedUser.name).toBe('Lorem Ipsum');
  });

  it('should be able to keep user email when email from request is null', async () => {
    const save = jest.spyOn(fakeUsersRepository, 'save');

    const user = await fakeUsersRepository.create({
      name: 'Lorem Ipsum',
      email: 'lorem@ipsum.dolor',
      password: 'sit_amet',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Lorem Ipsu',
    });

    expect(save).toHaveBeenCalledWith(updatedUser);

    expect(updatedUser.email).toBe('lorem@ipsum.dolor');
    expect(updatedUser.name).toBe('Lorem Ipsu');
  });

  it('should not be able to update profile when user does not exists', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'user-non-exists',
        email: 'new+lorem@ipsum.dolor',
        name: 'Lorem Ipsum da Silva',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change email with an another that already exists', async () => {
    await fakeUsersRepository.create({
      name: 'Lorem Ipsum',
      email: 'lorem@ipsum.dolor',
      password: 'sit_amet',
    });

    const user = await fakeUsersRepository.create({
      name: 'Lorem Ipsum',
      email: 'lorem2@ipsum.dolor',
      password: 'sit_amet',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'lorem@ipsum.dolor',
        name: 'Lorem Ipsum da Silva',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password when current password is not provided', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Lorem Ipsum',
      email: 'lorem@ipsum.dolor',
      password: 'sit_amet',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'new+lorem@ipsum.dolor',
        name: 'Lorem Ipsum da Silva',
        password: 'updated_password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password when current password provided is diffrent from user current password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Lorem Ipsum',
      email: 'lorem@ipsum.dolor',
      password: 'sit_amet',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'new+lorem@ipsum.dolor',
        name: 'Lorem Ipsum da Silva',
        password: 'updated_password',
        current_password: 'sit_ame',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
