import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
  name?: string;
  email?: string;
  current_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  private usersRepository: IUsersRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository') usersRepository: IUsersRepository,
    @inject('HashProvider') hashProvider: IHashProvider,
  ) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({
    user_id,
    name,
    email,
    current_password,
    password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    if (email) {
      const doesEmailAlreadyExists = await this.usersRepository.findByEmail(
        email,
      );

      if (doesEmailAlreadyExists && doesEmailAlreadyExists.id !== user_id) {
        throw new AppError('E-mail already exists');
      }

      user.email = email;
    }

    if (password) {
      if (!current_password) {
        throw new AppError('Old password must be provided');
      }

      const checkPassword = await this.hashProvider.compare(
        current_password,
        user.password,
      );

      if (!checkPassword) {
        throw new AppError('Old password does not match');
      }

      user.password = await this.hashProvider.generate(password);
    }

    if (name) {
      user.name = name;
    }

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateProfileService;
