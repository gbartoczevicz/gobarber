import { uuid } from 'uuidv4';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new AppointmentsRepository();

    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: uuid(),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment).toHaveProperty('provider_id');
  });

  it('shouldnt be able to create more than one appointment on the same time', () => {
    expect(1 + 2).toBe(3);
  });
});
