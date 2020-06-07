import { uuid } from 'uuidv4';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import AppError from '@shared/errors/AppError';

let listProviderAppointments: ListProviderAppointmentsService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeUsersRepository,
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the appointments from provider on a specific day', async () => {
    const provider = await fakeUsersRepository.create({
      name: 'Provider',
      email: 'provider@email.com',
      password: 'provider',
    });

    const a1 = await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 20, 13, 0, 0),
      provider_id: provider.id,
      user_id: uuid(),
    });

    const a2 = await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 20, 14, 0, 0),
      provider_id: provider.id,
      user_id: uuid(),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: provider.id,
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(provider).toHaveProperty('id');
    expect(appointments).toEqual([a1, a2]);
  });

  it('should not be able to list the appointments from a non existing provider', async () => {
    await expect(
      listProviderAppointments.execute({
        provider_id: uuid(),
        year: 2020,
        month: 5,
        day: 20,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
