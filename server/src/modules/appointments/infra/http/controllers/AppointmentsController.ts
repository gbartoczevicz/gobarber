import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

class AppointmentsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const appointmentsRepository = new AppointmentsRepository();

    const appointments = await appointmentsRepository.find();

    return res.json(appointments);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;
    const { provider_id, date } = req.body;

    const parsedDate = parseISO(date);

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      date: parsedDate,
      provider_id,
      user_id,
    });

    return res.json(appointment);
  }
}

export default AppointmentsController;
