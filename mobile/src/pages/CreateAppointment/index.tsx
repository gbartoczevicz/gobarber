import React, { useCallback, useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';

import { Platform } from 'react-native';
import { useAuth } from '../../hooks/auth';

import client from '../../services/client';
import ProviderDTO from '../Dashboard/dtos/ProviderDTO';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  CalendarTitle,
  OpenCalendarButton,
  OpenCalendarButtonText,
} from './styled';
import ProviderAvailabilityDTO from './dtos/ProviderAvailabilityDTO';

interface RouteParams {
  providerId: string;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const [providers, setProviders] = useState<ProviderDTO[]>([]);
  const [currentProvider, setCurrentProvider] = useState(
    routeParams.providerId,
  );
  const [toggleCalendar, setToggleCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [providerAvailability, setProviderAvailability] = useState<
    ProviderAvailabilityDTO[]
  >([]);

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
      .get<ProviderAvailabilityDTO[]>(`/providers/${currentProvider}/day`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(res => setProviderAvailability(res.data))
      .catch(err => console.log(err));
  }, [selectedDate, currentProvider]);

  const navigateToDashboard = useCallback(() => {
    navigation.navigate('Dashboard');
  }, [navigation]);

  const handleSelectProvider = useCallback((providerId: string) => {
    setCurrentProvider(providerId);
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

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateToDashboard}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabeleireiros</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <ProvidersListContainer>
        <ProvidersList
          data={providers}
          keyExtractor={p => p.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: p }) => (
            <ProviderContainer
              isCurrent={p.id === currentProvider}
              onPress={() => handleSelectProvider(p.id)}
            >
              <ProviderAvatar source={{ uri: p.avatar_url }} />
              <ProviderName isCurrent={p.id === currentProvider}>
                {p.name}
              </ProviderName>
            </ProviderContainer>
          )}
        />
      </ProvidersListContainer>

      <Calendar>
        <CalendarTitle>Escolha a data do agendamento</CalendarTitle>

        <OpenCalendarButton onPress={handleToggleDatePicker}>
          <OpenCalendarButtonText>Selecionar outra data</OpenCalendarButtonText>
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
    </Container>
  );
};

export default CreateAppointment;
