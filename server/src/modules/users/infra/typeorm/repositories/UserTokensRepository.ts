import { getRepository, Repository } from 'typeorm';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

class UsersRepository implements IUserTokensRepository {
  private repository: Repository<UserToken>;

  constructor() {
    this.repository = getRepository(UserToken);
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.repository.create({ user_id });

    await this.repository.save(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | null> {
    const userToken = await this.repository.findOne({
      where: { token },
    });

    return userToken || null;
  }
}

export default UsersRepository;
