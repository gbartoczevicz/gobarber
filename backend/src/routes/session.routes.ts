import { Router } from 'express';

import CreateUserSession from '../app/services/CreateUserSession';

const sessionRouter = Router();

sessionRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  const createUserSession = new CreateUserSession();

  const { user, token } = await createUserSession.execute({
    email,
    password,
  });

  delete user.password;

  return res.json({ user, token });
});

export default sessionRouter;
