import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import uploadConfig from '../../config/upload';
import User from '../models/User';

interface Request {
  user_id: string;
  filename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, filename }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { id: user_id } });

    if (!user) {
      throw Error('Only authenticated users can change avatar');
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

    await userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
