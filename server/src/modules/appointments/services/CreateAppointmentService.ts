import { injectable, inject } from 'tsyringe';
import { startOfHour, isBefore, getHours, format } from 'date-fns';

import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  private appointmentsRepository: IAppointmentsRepository;

  private notificationsRepository: INotificationsRepository;

  private usersRepository: IUsersRepository;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('AppointmentsRepository')
    appointmentsRepository: IAppointmentsRepository,
    @inject('NotificationsRepository')
    notificationsRepository: INotificationsRepository,
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
    @inject('CacheProvider')
    cacheProvider: ICacheProvider,
  ) {
    this.appointmentsRepository = appointmentsRepository;
    this.notificationsRepository = notificationsRepository;
    this.usersRepository = usersRepository;
    this.cacheProvider = cacheProvider;
  }

  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('You can not create an appointment on a past date');
    }

    if (user_id === provider_id) {
      throw new AppError('You can not create an appointment with yourself');
    }

    const provider = await this.usersRepository.findById(provider_id);

    if (!provider) {
      throw new AppError('This provider does not exists');
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'You can only create an appointment between 8am and 5pm',
      );
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDateAndProvider(
      { provider_id, date },
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      date: appointmentDate,
      provider_id,
      user_id,
    });

    const dateFormatted = format(appointmentDate, "dd/MM/yyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento criado com ${user_id} para o dia ${dateFormatted}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    return appointment;
  }
}

export default CreateAppointmentService;
