import React, { useCallback, useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

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
} from './styled';

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

  const { user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    client
      .get<ProviderDTO[]>('/providers')
      .then(res => setProviders(res.data))
      .catch(err => console.log(err));
  }, []);

  const navigateToDashboard = useCallback(() => {
    navigation.navigate('Dashboard');
  }, [navigation]);

  const handleSelectProvider = useCallback((providerId: string) => {
    setCurrentProvider(providerId);
  }, []);

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
    </Container>
  );
};

export default CreateAppointment;
