import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAppointmentByDateAndProviderDTO from '@modules/appointments/dtos/IFindAppointmentByDateAndProviderDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

export default interface IAppointmentsRepository {
  find(): Promise<Appointment[]>;
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDateAndProvider(
    data: IFindAppointmentByDateAndProviderDTO,
  ): Promise<Appointment | null>;
  findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<Appointment[]>;
  findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO,
  ): Promise<Appointment[]>;
}
