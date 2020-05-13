import { Router } from 'express';

import CreateUserSessionService from '@modules/users/services/CreateUserSessionService';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

const sessionRouter = Router();

sessionRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  const usersReporitory = new UsersRepository();

  const createUserSession = new CreateUserSessionService(usersReporitory);

  const { user, token } = await createUserSession.execute({
    email,
    password,
  });

  delete user.password;

  return res.json({ user, token });
});

export default sessionRouter;
