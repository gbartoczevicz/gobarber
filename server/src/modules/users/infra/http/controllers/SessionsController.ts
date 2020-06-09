import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateUserSessionService from '@modules/users/services/CreateUserSessionService';

class SessionsController {
  public async store(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const createUserSession = container.resolve(CreateUserSessionService);

    const { user, token } = await createUserSession.execute({
      email,
      password,
    });

    return res.json({ user: classToClass(user), token });
  }
}

export default SessionsController;
