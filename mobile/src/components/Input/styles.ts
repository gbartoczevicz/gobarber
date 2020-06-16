import styled from 'styled-components/native';
import Feather from 'react-native-vector-icons/Feather';

export const Container = styled.View`
  width: 100%;
  height: 60px;
  padding: 0 16px;
  background: #232129;
  border-radius: 8px;
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
`;

export const TextInput = styled.TextInput`
  flex: 1;
  color: #ffffff;
  font-family: 'RobotoSlab-Regular';
  font-size: 16px;
`;

export const Icon = styled(Feather)`
  margin-right: 16px;
  color: #666360;
`;
