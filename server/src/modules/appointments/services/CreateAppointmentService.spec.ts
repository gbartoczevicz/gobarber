import { uuid } from 'uuidv4';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import AppError from '@shared/errors/AppError';

let createAppointment: CreateAppointmentService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: uuid(),
      user_id: uuid(),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment).toHaveProperty('provider_id');
  });

  it('should not be able to create more than one appointment on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 12, 11);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: uuid(),
      user_id: uuid(),
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: uuid(),
        user_id: uuid(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
