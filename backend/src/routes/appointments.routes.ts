import { Router } from 'express';
import { uuid } from 'uuidv4';

const appointmentsRouter = Router();

interface Appointment {
  id: string;
  provider: string;
  date: Date;
}

const appointments: Array<Appointment> = [];

appointmentsRouter.get('/', (req, res) => res.json(appointments));

appointmentsRouter.post('/', (req, res) => {
  const { provider, date } = req.body;

  const appointment: Appointment = {
    id: uuid(),
    provider,
    date: new Date(date),
  };

  appointments.push(appointment);

  return res.json(appointment);
});

export default appointmentsRouter;
