import { Router } from 'express';
import multer from 'multer';

import ensureAuthenticated from '../app/middlewares/ensureAuthenticated';
import uploadConfig from '../config/upload';

import CreateUserService from '../app/services/CreateUserService';
import UpdateUserAvatarService from '../app/services/UpdateUserAvatarService';

const usersRouter = Router();

const upload = multer(uploadConfig);

usersRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  const createUserService = new CreateUserService();

  try {
    const user = await createUserService.execute({
      name,
      email,
      password,
    });

    delete user.password;

    return res.json(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (req, res) => {
    const { file } = req;
    const { id } = req.user;

    const updateUserAvatar = new UpdateUserAvatarService();

    try {
      const user = await updateUserAvatar.execute({
        user_id: id,
        filename: file.filename,
      });

      delete user.password;

      return res.json(user);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },
);

export default usersRouter;
