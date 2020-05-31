import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

import User from '@modules/users/infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | null> {
    const user = this.users.find(u => u.id === id);

    return user || null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);

    return user || null;
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid() }, data);

    this.users.push(user);

    return user;
  }

  public async save(data: User): Promise<User> {
    const findIndex = this.users.findIndex(u => u.id === data.id);

    this.users[findIndex] = data;

    return data;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let { users } = this;

    if (except_user_id) {
      users = this.users.filter(u => u.id !== except_user_id);
    }

    return users;
  }
}

export default FakeUsersRepository;
