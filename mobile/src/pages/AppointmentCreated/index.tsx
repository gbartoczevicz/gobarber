import React, { useCallback, useMemo } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import {
  Container,
  Title,
  Description,
  ConfirmButton,
  ConfirmButtonText,
} from './styles';

interface RouteParams {
  date: number;
}

const AppointmentCreated: React.FC = () => {
  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const navigation = useNavigation();

  const handleConfirmationPress = useCallback(() => {
    navigation.reset({
      routes: [{ name: 'Dashboard' }],
      index: 0,
    });
  }, [navigation]);

  const formattedDate = useMemo(() => {
    return format(
      routeParams.date,
      "EEEE, 'dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h' 'com User 01'",
      { locale: ptBR },
    );
  }, [routeParams]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Agendamento marcado</Title>
      <Description>{formattedDate}</Description>

      <ConfirmButton onPress={handleConfirmationPress}>
        <ConfirmButtonText>Ok</ConfirmButtonText>
      </ConfirmButton>
    </Container>
  );
};

export default AppointmentCreated;
