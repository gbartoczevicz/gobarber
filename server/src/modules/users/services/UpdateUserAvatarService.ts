import path from 'path';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  filename: string;
}

@injectable()
class UpdateUserAvatarService {
  private usersRepository: IUsersRepository;

  constructor(@inject('UsersRepository') usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute({ user_id, filename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    const { directory } = uploadConfig;

    if (user.avatar) {
      const avatarFilePath = path.join(directory, user.avatar);

      const doesFileExists = await fs.promises.stat(avatarFilePath);

      if (doesFileExists) {
        await fs.promises.unlink(avatarFilePath);
      }
    }

    user.avatar = filename;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
