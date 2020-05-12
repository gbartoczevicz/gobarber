import { Router } from 'express';

import CreateUserSessionService from '@modules/users/services/CreateUserSessionService';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

const sessionRouter = Router();
const usersReporitory = new UsersRepository();

sessionRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  const createUserSession = new CreateUserSessionService(usersReporitory);

  const { user, token } = await createUserSession.execute({
    email,
    password,
  });

  delete user.password;

  return res.json({ user, token });
});

export default sessionRouter;
