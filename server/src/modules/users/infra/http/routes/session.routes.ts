import { Router } from 'express';
import { container } from 'tsyringe';

import CreateUserSessionService from '@modules/users/services/CreateUserSessionService';

const sessionRouter = Router();

sessionRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  const createUserSession = container.resolve(CreateUserSessionService);

  const { user, token } = await createUserSession.execute({
    email,
    password,
  });

  delete user.password;

  return res.json({ user, token });
});

export default sessionRouter;
