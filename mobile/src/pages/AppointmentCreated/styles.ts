import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
`;

export const Title = styled.Text`
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  font-size: 32px;
  text-align: center;
  margin-top: 28px;
`;

export const Description = styled.Text`
  color: #999591;
  font-family: 'RobotoSlab-Regular';
  font-size: 18px;
  text-align: center;
  margin-top: 16px;
`;

export const ConfirmButton = styled(RectButton)`
  padding: 12px 24px;
  background: #ff9000;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 26px;
`;

export const ConfirmButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #232129;
  font-size: 18px;
`;
