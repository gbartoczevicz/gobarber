import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
  user_id: string;
  filename: string;
}

@injectable()
class UpdateUserAvatarService {
  private usersRepository: IUsersRepository;

  private storageProvider: IStorageProvider;

  constructor(
    @inject('UsersRepository') usersRepository: IUsersRepository,
    @inject('StorageProvider') storageProvider: IStorageProvider,
  ) {
    this.usersRepository = usersRepository;
    this.storageProvider = storageProvider;
  }

  public async execute({ user_id, filename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    if (user.avatar) {
      await this.storageProvider.delete(user.avatar);
    }

    const avatar = await this.storageProvider.save(filename);

    user.avatar = avatar;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
