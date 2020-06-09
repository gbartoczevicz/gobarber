import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ForgotPasswordController from '@modules/users/infra/http/controllers/ForgotPasswordController';
import ResetPasswordController from '@modules/users/infra/http/controllers/ResetPasswordController';

const passwordRouter = Router();

const forgotPassword = new ForgotPasswordController();
const resetPassword = new ResetPasswordController();

passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPassword.create,
);
passwordRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      password: Joi.string().required(),
      confirmation: Joi.string().required().valid(Joi.ref('password')),
      token: Joi.string().uuid().required(),
    },
  }),
  resetPassword.create,
);

export default passwordRouter;
