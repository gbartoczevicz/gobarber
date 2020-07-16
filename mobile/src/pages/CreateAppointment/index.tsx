import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { Platform, Alert } from 'react-native';
import { useAuth } from '../../hooks/auth';

import client from '../../services/client';
import ProviderDTO from '../Dashboard/dtos/ProviderDTO';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  CalendarTitle,
  OpenCalendarButton,
  OpenCalendarButtonText,
  Schedule,
  ScheduleTitle,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';

import ProviderAvailabilityDTO from './dtos/ProviderAvailabilityDTO';

interface RouteParams {
  providerId: string;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const [providers, setProviders] = useState<ProviderDTO[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  );
  const [toggleCalendar, setToggleCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [providerAvailability, setProviderAvailability] = useState<
    ProviderAvailabilityDTO[]
  >([]);
  const [selectedHour, setSelectedHour] = useState(0);

  const { user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    client
      .get<ProviderDTO[]>('/providers')
      .then(res => setProviders(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    client
      .get<ProviderAvailabilityDTO[]>(`/providers/${selectedProvider}/day`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(res => setProviderAvailability(res.data))
      .catch(err => console.log(err));
  }, [selectedDate, selectedProvider]);

  const navigateToDashboard = useCallback(() => {
    navigation.navigate('Dashboard');
  }, [navigation]);

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setToggleCalendar(state => !state);
  }, []);

  const handleDateChanged = useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        setToggleCalendar(false);
      }

      if (date) {
        setSelectedDate(date);
      }
    },
    [],
  );

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    const appointmentDate = new Date(selectedDate);

    appointmentDate.setHours(selectedHour);

    appointmentDate.setMinutes(0);
    try {
      await client.post('/appointments', {
        provider_id: selectedProvider,
        date: appointmentDate,
      });

      navigation.navigate('AppointmentCreated', {
        date: appointmentDate.getTime(),
      });
    } catch (err) {
      console.log(err.message);

      Alert.alert(
        'Erro ao criar o agendamento',
        'Ocorreu um erro ao criar o agendamento, tente novamente',
      );
    }
  }, [selectedDate, selectedHour, selectedProvider, navigation]);

  const morningAvailability = useMemo(() => {
    return providerAvailability
      .filter(a => a.hour < 12)
      .map(({ available, hour }) => ({
        hour,
        available,
        hourFormatted: format(new Date().setHours(hour), 'hh:00', {
          locale: ptBR,
        }),
      }));
  }, [providerAvailability]);

  const afternoonAvailability = useMemo(() => {
    return providerAvailability
      .filter(a => a.hour >= 12)
      .map(({ available, hour }) => ({
        hour,
        available,
        hourFormatted: format(new Date().setHours(hour), 'hh:00', {
          locale: ptBR,
        }),
      }));
  }, [providerAvailability]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateToDashboard}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabeleireiros</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <Content>
        <ProvidersListContainer>
          <ProvidersList
            data={providers}
            keyExtractor={p => p.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: p }) => (
              <ProviderContainer
                isCurrent={p.id === selectedProvider}
                onPress={() => handleSelectProvider(p.id)}
              >
                <ProviderAvatar source={{ uri: p.avatar_url }} />
                <ProviderName isCurrent={p.id === selectedProvider}>
                  {p.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <CalendarTitle>Escolha a data do agendamento</CalendarTitle>

          <OpenCalendarButton onPress={handleToggleDatePicker}>
            <OpenCalendarButtonText>
              Selecionar outra data
            </OpenCalendarButtonText>
          </OpenCalendarButton>

          {toggleCalendar && (
            <DateTimePicker
              mode="date"
              display="calendar"
              textColor="#f4ede8"
              value={selectedDate}
              onChange={handleDateChanged}
            />
          )}
        </Calendar>

        <Schedule>
          <ScheduleTitle>Escolha o horário</ScheduleTitle>

          <Section>
            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {morningAvailability.map(a => (
                <Hour
                  isAvailable={a.available}
                  isSelected={selectedHour === a.hour}
                  key={a.hourFormatted}
                  onPress={() => handleSelectHour(a.hour)}
                  enabled={a.available}
                >
                  <HourText
                    isSelected={selectedHour === a.hour}
                    isAvailable={a.available}
                  >
                    {a.hourFormatted}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>

            <SectionContent>
              {afternoonAvailability.map(a => (
                <Hour
                  isAvailable={a.available}
                  isSelected={selectedHour === a.hour}
                  key={a.hourFormatted}
                  onPress={() => handleSelectHour(a.hour)}
                  enabled={a.available}
                >
                  <HourText
                    isSelected={selectedHour === a.hour}
                    isAvailable={a.available}
                  >
                    {a.hourFormatted}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
