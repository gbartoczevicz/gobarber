import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiPower, FiClock } from 'react-icons/fi';
import { RiUserLine } from 'react-icons/ri';
import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Main,
  Schedule,
  NextAppointment,
  Sections,
  Appointments,
  Calendar,
} from './styles';

import logo from '../../assets/logo.svg';
import client from '../../services/client';

interface MonthAvailability {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailability[]
  >([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const { signOut, user } = useAuth();

  const handleDayChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback(
    (month: Date) => setCurrentMonth(month),
    [],
  );

  useEffect(() => {
    client
      .get(`/providers/${user.id}/month`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(res => setMonthAvailability(res.data));
  }, [currentMonth, user]);

  useEffect(() => {
    client
      .get<Appointment[]>('/appointments/schedule', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(res => {
        const appointmentsFormatted = res.data.map(a => {
          return {
            ...a,
            hourFormatted: format(parseISO(a.date), 'HH:mm'),
          };
        });

        setAppointments(appointmentsFormatted);
      });
  }, [selectedDate]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => monthDay.available === false)
      .map(({ day }) => {
        return new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          day,
        );
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDateAsText = useMemo(() => {
    return {
      date: format(selectedDate, "'Dia' dd 'de' MMMM", {
        locale: ptBR,
      }),
      dayOfWeek: format(selectedDate, 'cccc', {
        locale: ptBR,
      }),
    };
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(a => {
      return parseISO(a.date).getHours() < 12;
    });
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(a => {
      return parseISO(a.date).getHours() >= 12;
    });
  }, [appointments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logo} alt="Go Barber Logo" />

          <Profile>
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} />
            ) : (
              <RiUserLine />
            )}
            <div>
              <span>Bem-vindo,</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>
      <Main>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText.date}</span>
            <span>{selectedDateAsText.dayOfWeek}</span>
          </p>

          <NextAppointment>
            <strong>Atendimento a seguir</strong>
            <div>
              <img src={user.avatar_url} alt={user.name} />
              <strong>{user.name}</strong>
              <span>
                <FiClock />
                08:00
              </span>
            </div>
          </NextAppointment>

          <Sections>
            <strong>Manhã</strong>

            {morningAppointments.map(a => (
              <Appointments key={a.id}>
                <span>
                  <FiClock />
                  {a.hourFormatted}
                </span>

                <div>
                  <img src={a.user.avatar_url} alt={a.user.name} />
                  <strong>{a.user.name}</strong>
                </div>
              </Appointments>
            ))}

            <strong>Tarde</strong>

            {afternoonAppointments.map(a => (
              <Appointments key={a.id}>
                <span>
                  <FiClock />
                  {a.hourFormatted}
                </span>

                <div>
                  <img src={a.user.avatar_url} alt={a.user.name} />
                  <strong>{a.user.name}</strong>
                </div>
              </Appointments>
            ))}
          </Sections>
        </Schedule>

        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            selectedDays={selectedDate}
            onDayClick={handleDayChange}
            onMonthChange={handleMonthChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Main>
    </Container>
  );
};

export default Dashboard;
