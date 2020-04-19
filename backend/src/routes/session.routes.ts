import { Router } from 'express';

import CreateUserSession from '../app/services/CreateUserSession';

const sessionRouter = Router();

sessionRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  const createUserSession = new CreateUserSession();

  try {
    const { user, token } = await createUserSession.execute({
      email,
      password,
    });

    delete user.password;

    return res.json({ user, token });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

export default sessionRouter;
