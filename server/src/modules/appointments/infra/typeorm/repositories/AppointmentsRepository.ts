import { getRepository, Repository, Raw } from 'typeorm';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAppointmentByDateAndProviderDTO from '@modules/appointments/dtos/IFindAppointmentByDateAndProviderDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import User from '@modules/users/infra/typeorm/entities/User';

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

  public async findByDateAndProvider({
    date,
    provider_id,
  }: IFindAppointmentByDateAndProviderDTO): Promise<Appointment | null> {
    const appointment = await this.repository.findOne({
      where: { date, provider_id },
    });

    return appointment || null;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    year,
    month,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const findAppointments = await this.repository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName => `
          to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'
        `,
        ),
      },
    });

    return findAppointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    year,
    month,
    day,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const parsedDay = String(day).padStart(2, '0');

    const findAppointments = await this.repository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName => `
          to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'
        `,
        ),
      },
      relations: ['user'],
    });

    return findAppointments;
  }
}

export default AppointmentRepository;
