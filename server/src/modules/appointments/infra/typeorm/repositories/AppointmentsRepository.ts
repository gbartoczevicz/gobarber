import { getRepository, Repository } from 'typeorm';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

class AppointmentRepository implements IAppointmentsRepository {
  private repository: Repository<Appointment>;

  constructor() {
    this.repository = getRepository(Appointment);
  }

  public async find(): Promise<Appointment[]> {
    const appointments = await this.repository.find();

    return appointments;
  }

  public async create(data: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.repository.create(data);

    await this.repository.save(appointment);

    return appointment;
  }

  public async findByDate(date: Date): Promise<Appointment | null> {
    const appointment = await this.repository.findOne({
      where: { date },
    });

    return appointment || null;
  }
}

export default AppointmentRepository;
