import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import AppError from '@shared/errors/AppError';

let listProviderDayAvailability: ListProviderDayAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeUsersRepository,
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the day availability from provider', async () => {
    const provider = await fakeUsersRepository.create({
      name: 'Provider',
      email: 'provider@email.com',
      password: 'provider',
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: provider.id,
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 20, 11).getTime());

    const availability = await listProviderDayAvailability.execute({
      provider_id: provider.id,
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(provider).toHaveProperty('id');
    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 13, available: true },
        { hour: 12, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
      ]),
    );
  });

  it('should not be able to list the day availability from a non existing provider', async () => {
    await expect(
      listProviderDayAvailability.execute({
        provider_id: 'non-existing-user',
        year: 2020,
        month: 5,
        day: 20,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
