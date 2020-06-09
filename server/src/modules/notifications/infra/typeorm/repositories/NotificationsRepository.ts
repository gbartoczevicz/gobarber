import { getMongoRepository, MongoRepository } from 'typeorm';

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

import ICreateAppointmentDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

class NotificationsRepository implements INotificationsRepository {
  private repository: MongoRepository<Notification>;

  constructor() {
    this.repository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    content,
    recipient_id,
  }: ICreateAppointmentDTO): Promise<Notification> {
    const appointment = this.repository.create({ content, recipient_id });

    await this.repository.save(appointment);

    return appointment;
  }
}

export default NotificationsRepository;
