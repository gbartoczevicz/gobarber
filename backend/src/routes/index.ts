import { Router } from 'express';

import appointmentsRouter from './appointments.routes';
import usersRoutes from './users.routes';
import sessionRouter from './session.routes';

const routes = Router();

routes.get('/', (req, res) => res.json({ message: 'Hello from GoBarber!' }));

routes.use('/sessions', sessionRouter);
routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRoutes);

export default routes;
