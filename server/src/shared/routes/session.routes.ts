import { Router } from 'express';

import CreateUserSessionService from '../../modules/users/services/CreateUserSessionService';

const sessionRouter = Router();

sessionRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  const createUserSession = new CreateUserSessionService();

  const { user, token } = await createUserSession.execute({
    email,
    password,
  });

  delete user.password;

  return res.json({ user, token });
});

export default sessionRouter;
