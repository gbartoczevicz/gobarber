import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAppointmentByDateAndProviderDTO from '@modules/appointments/dtos/IFindAppointmentByDateAndProviderDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async find(): Promise<Appointment[]> {
    return this.appointments;
  }

  public async create({
    date,
    user_id,
    provider_id,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, provider_id, user_id });

    this.appointments.push(appointment);

    return appointment;
  }

  public async findByDateAndProvider({
    provider_id,
    date,
  }: IFindAppointmentByDateAndProviderDTO): Promise<Appointment | null> {
    const findAppointment = this.appointments.find(
      a => isEqual(a.date, date) && a.provider_id === provider_id,
    );

    return findAppointment || null;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    year,
    month,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const findAppointments = this.appointments.filter(
      a =>
        a.provider_id === provider_id &&
        month === getMonth(a.date) + 1 &&
        year === getYear(a.date),
    );

    return findAppointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    year,
    month,
    day,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const findAppointments = this.appointments.filter(
      a =>
        a.provider_id === provider_id &&
        year === getYear(a.date) &&
        month === getMonth(a.date) + 1 &&
        day === getDate(a.date),
    );

    return findAppointments;
  }
}

export default AppointmentsRepository;
