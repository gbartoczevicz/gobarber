import React, { useCallback, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  ProvidersList,
  ProvidersListTitle,
  ProviderContainer,
  ProviderAvatar,
  ProviderInfo,
  ProviderName,
  ProviderSchedule,
  ProviderScheduleText,
} from './styles';

import client from '../../services/client';
import ProviderDTO from './dtos/ProviderDTO';

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<ProviderDTO[]>([]);

  const { user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    client
      .get<ProviderDTO[]>('/providers')
      .then(res => setProviders(res.data))
      .catch(err => console.log(err));
  }, []);

  const navigateToProfile = useCallback(() => {
    navigation.navigate('Profile');
  }, [navigation]);

  const navigateToCreateAppointment = useCallback(
    (providerId: string) => {
      navigation.navigate('CreateAppointment', { providerId });
    },
    [navigation],
  );

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem vindo,
          {'\n'}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar source={{ uri: user.avatar_url }} />
        </ProfileButton>
      </Header>

      <ProvidersList
        data={providers}
        keyExtractor={p => p.id}
        ListHeaderComponent={
          <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
        }
        renderItem={({ item: p }) => (
          <ProviderContainer onPress={() => navigateToCreateAppointment(p.id)}>
            <ProviderAvatar source={{ uri: p.avatar_url }} />

            <ProviderInfo>
              <ProviderName>{p.name}</ProviderName>
              <ProviderSchedule>
                <Icon name="calendar" size={14} color="#ff9000" />
                <ProviderScheduleText>Segunda à sexta</ProviderScheduleText>
              </ProviderSchedule>

              <ProviderSchedule>
                <Icon name="clock" size={14} color="#ff9000" />
                <ProviderScheduleText>08:00 às 18:00</ProviderScheduleText>
              </ProviderSchedule>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />
    </Container>
  );
};

export default Dashboard;
