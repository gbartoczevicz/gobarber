import { uuid } from 'uuidv4';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import AppError from '@shared/errors/AppError';

let createAppointment: CreateAppointmentService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeUsersRepository,
      fakeCacheProvider,
    );

    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());
  });

  it('should be able to create a new appointment', async () => {
    const provider = await fakeUsersRepository.create({
      name: 'Provider',
      email: 'provider@email.com',
      password: 'provider',
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: provider.id,
      user_id: uuid(),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment).toHaveProperty('provider_id');
  });

  it('should not be able to create more than one appointment on the same time', async () => {
    const provider = await fakeUsersRepository.create({
      name: 'Provider',
      email: 'provider@email.com',
      password: 'provider',
    });

    const appointmentDate = new Date(2020, 4, 10, 13);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: provider.id,
      user_id: uuid(),
    });

    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: provider.id,
        user_id: uuid(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    const provider = await fakeUsersRepository.create({
      name: 'Provider',
      email: 'provider@email.com',
      password: 'provider',
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        provider_id: provider.id,
        user_id: uuid(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    const sameUser = uuid();

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 13),
        provider_id: sameUser,
        user_id: sameUser,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with a non existent provider', async () => {
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 13),
        provider_id: uuid(),
        user_id: uuid(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    const provider = await fakeUsersRepository.create({
      name: 'Provider',
      email: 'provider@email.com',
      password: 'provider',
    });

    const provider2 = await fakeUsersRepository.create({
      name: 'Provider',
      email: 'provider2@email.com',
      password: 'provider',
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 7),
        provider_id: provider.id,
        user_id: uuid(),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 18),
        provider_id: provider2.id,
        user_id: uuid(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
