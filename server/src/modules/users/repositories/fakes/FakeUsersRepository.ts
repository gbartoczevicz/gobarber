import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '@modules/users/infra/typeorm/entities/User';

class UsersRepository implements IUsersRepository {
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
}

export default UsersRepository;
