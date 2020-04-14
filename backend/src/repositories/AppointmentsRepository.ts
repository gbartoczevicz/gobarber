import { isEqual } from 'date-fns';
import Appointment from '../models/Appointment';

class AppointmentRepository {
  private appointments: Appointment[];

  constructor() {
    this.appointments = [];
  }

  public list(): Appointment[] {
    return this.appointments;
  }

  public findByDate(date: Date): Appointment | null {
    const appointment = this.appointments.find(a => isEqual(date, a.date));

    return appointment || null;
  }

  public create(provider: string, date: Date): Appointment {
    const appointment = new Appointment(provider, date);

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentRepository;
